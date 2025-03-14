import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateText(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        return response;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating response.";
    }
}

export default  generateText;
