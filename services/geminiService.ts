import { GoogleGenAI } from "@google/genai";
import { MENU_ITEMS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPizzaRecommendation = async (userPreference: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "I'm sorry, I can't access my brain right now (API Key missing). Try the Pepperoni Feast!";
  }

  const menuContext = MENU_ITEMS.map(
    (item) => `${item.name} (${item.category}, Price: $${item.price}, Spiciness: ${item.spiciness}/3): ${item.description}`
  ).join("\n");

  const systemInstruction = `You are SliceHub's expert AI Pizza Chef.
Your goal is to recommend 1 or 2 specific pizzas from our menu based on the user's craving.
Be friendly, appetizing, and concise.
ONLY recommend items from the provided menu list.
If the user asks for something not on the menu, politely steer them to the closest match.
Do not invent prices or items.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Menu:\n${menuContext}\n\nUser request: "${userPreference}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    return response.text || "I couldn't decide! Everything is delicious.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the kitchen server. But the Margherita is always a safe bet!";
  }
};
