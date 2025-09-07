import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "default_key"
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    // Convert messages to Gemini format
    const geminiMessages = messages
      .filter(msg => msg.role !== "system") // Gemini handles system messages differently
      .map(msg => msg.content)
      .join("\n\n");

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: geminiMessages,
    });

    return response.text || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    } else if (error.status === 401 || error.status === 403) {
      throw new Error("Invalid Gemini API key. Please check your configuration.");
    } else if (error.status === 400) {
      throw new Error("Invalid request. Please try rephrasing your message.");
    } else {
      throw new Error(`Failed to generate response: ${error.message || 'Unknown error'}`);
    }
  }
}

export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const prompt = `Generate a short, descriptive title (3-5 words) for a conversation based on this message: "${firstMessage}". Be concise and specific. Only return the title, nothing else.`;
    
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || "New Conversation";
  } catch (error) {
    console.error("Failed to generate title:", error);
    return "New Conversation";
  }
}
