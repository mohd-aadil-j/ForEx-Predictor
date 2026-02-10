
import { GoogleGenAI, Type } from "@google/genai";
import { OHLCData, AIAnalysis, Timeframe } from "../types";
import { GEMINI_MODEL } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeForexData = async (
  symbol: string,
  data: OHLCData[],
  timeframe: Timeframe
): Promise<AIAnalysis> => {
  const dataString = data.slice(-40).map(d => 
    `T:${d.time}, O:${d.open}, H:${d.high}, L:${d.low}, C:${d.close}, V:${d.volume}`
  ).join('\n');

  const systemInstruction = `
    You are an elite institutional-grade technical analyst specialized in Binary Options (Fixed Time Trades) for platforms like Quotex and PocketOption.
    
    YOUR GOAL: Predict the color (Bullish/Bearish) of the VERY NEXT candle.
    
    ANALYSIS PROTOCOL:
    1. MARKET STRUCTURE: Identify if the market is in a Consolidation, Markup, or Markdown phase. Look for Break of Structure (BOS) or Change of Character (CHoCH).
    2. CANDLESTICK DYNAMICS: Analyze wicks. Long upper wicks at resistance = Selling pressure. Long lower wicks at support = Buying pressure.
    3. VOLUME SPREAD ANALYSIS (VSA): Compare price move distance with volume. High volume with small price move = Absorption/Reversal.
    4. FIBONACCI LEVELS: Infer 0.618 or 0.5 retracement zones from the current High/Low range.
    5. SMART MONEY CONCEPTS: Look for Fair Value Gaps (FVG) that need to be filled.
    
    STRICT RULES:
    - If market is sideways (choppy), return direction "WAIT".
    - Only signal UP/DOWN if probability is > 65%.
    - Use the provided timeframe (${timeframe}) to determine expiration.
  `;

  const prompt = `
    Symbol: ${symbol}
    Timeframe: ${timeframe}
    Historical Data (last 40 candles):
    ${dataString}

    Perform a high-precision analysis. Return a JSON response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pattern: { type: Type.STRING, description: "Technical pattern detected (e.g., FVG Fill, Order Block Rejection, Morning Star)" },
            direction: { type: Type.STRING, enum: ["UP", "DOWN", "WAIT"], description: "The predicted direction for the next candle" },
            confidence: { type: Type.NUMBER, description: "Overall strength of technical confluence (0-100)" },
            nextCandleProbability: { type: Type.NUMBER, description: "Calculated mathematical probability of success (0-100)" },
            recommendedExpiration: { type: Type.STRING, description: "Duration (e.g., '1 min', '2 min')" },
            explanation: { type: Type.STRING, description: "Technical justification using S/R and wicks" },
            keyLevels: {
              type: Type.OBJECT,
              properties: {
                support: { type: Type.NUMBER },
                resistance: { type: Type.NUMBER }
              },
              required: ["support", "resistance"]
            }
          },
          required: ["pattern", "direction", "confidence", "explanation", "keyLevels", "recommendedExpiration", "nextCandleProbability"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AIAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Pattern analysis failed. Increase candle data or check API.");
  }
};
