
import { GoogleGenAI, Type } from "@google/genai";
import { OHLCData, AIAnalysis, Timeframe } from "../types";
import { GEMINI_MODEL } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeForexData = async (
  symbol: string,
  data: OHLCData[],
  timeframe: Timeframe
): Promise<AIAnalysis> => {
  const dataString = data.map(d => 
    `Time: ${d.time}, O: ${d.open}, H: ${d.high}, L: ${d.low}, C: ${d.close}`
  ).join('\n');

  const prompt = `
    As a professional Binary Options analyst specialized in the Quotex platform, analyze this ${timeframe} candlestick data for ${symbol}.
    Your goal is to predict the direction of the NEXT candle(s) for a Fixed Time Trade.
    
    1. Identify price action patterns (Engulfing, Pin Bars, S/R rejections).
    2. Determine if the next move is a CALL (UP) or PUT (DOWN).
    3. Suggest a recommended expiration time (e.g., '1 candle', '3-5 minutes') based on the ${timeframe} interval.
    4. Calculate a probability percentage for the next candle closing in the predicted direction.

    Data:
    ${dataString}
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pattern: { type: Type.STRING, description: "Candlestick pattern name" },
            direction: { type: Type.STRING, enum: ["UP", "DOWN", "WAIT"], description: "CALL or PUT signal" },
            confidence: { type: Type.NUMBER, description: "Overall signal confidence 0-100" },
            nextCandleProbability: { type: Type.NUMBER, description: "Probability of next candle closing in direction" },
            recommendedExpiration: { type: Type.STRING, description: "Suggested trade duration" },
            explanation: { type: Type.STRING, description: "Reasoning for the binary signal" },
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
    throw new Error("Analysis failed. Ensure market volatility is sufficient.");
  }
};
