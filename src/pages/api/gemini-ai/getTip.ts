import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Replace with your actual data types if needed
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface RequestPayload {
  goals: Goal[];
  transactions: Transaction[];
  balance: number;
}

interface GeminiAIResponse {
  tip: string;
  category: string;
}

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_AI_KEY;
if (!apiKey) {
  throw new Error("GEMINI_AI_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest", // Or use "gemini-pro"
});

const generationConfig = {
  temperature: 0.7, // Adjust creativity (0-1)
  topP: 1,
  topK: 1,
  maxOutputTokens: 150, // Limit response length
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Function to call the actual Gemini AI API
async function callGeminiAI(prompt: string): Promise<GeminiAIResponse> {
  console.log("Calling Gemini AI with prompt...");

  try {
    const result = await model.generateContentStream([
      {
        text: prompt + `\n\nRespond ONLY with a JSON object containing 'tip' and 'category' keys, like this: { "tip": "...", "category": "..." }. Do not include markdown formatting (like \`\`\`json).`
      }
    ]);

    // Aggregate the streamed response
    let aggregatedResponse = '';
    for await (const chunk of result.stream) {
      aggregatedResponse += chunk.text();
    }

    console.log("Raw Gemini AI Response:", aggregatedResponse);

    // Attempt to parse the JSON response
    try {
      // Clean potential markdown/extra characters
      const cleanedResponse = aggregatedResponse.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(cleanedResponse);
      if (parsed.tip && parsed.category) {
        return { tip: parsed.tip, category: parsed.category };
      } else {
        console.error("Parsed Gemini response missing tip or category:", parsed);
        throw new Error("Received incomplete data structure from Gemini AI.");
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini AI response:", parseError, "Raw response was:", aggregatedResponse);
      throw new Error("Failed to parse response from Gemini AI. Raw: " + aggregatedResponse.substring(0, 100));
    }

  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    // Rethrow or handle specific API errors
    throw new Error(`Gemini API call failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function generatePrompt(data: RequestPayload): string {
  // Basic prompt structure - Enhance as needed!
  let prompt = `Analyze the following user financial data and provide ONE short, actionable financial tip (1-2 sentences) and a relevant category (e.g., Savings, Budgeting, Spending, Investment). Focus on being helpful and concise.

User Balance: $${data.balance.toFixed(2)}

Goals (${data.goals.length}):\n`;
  data.goals.slice(0, 3).forEach(g => {
    prompt += `- ${g.name} ($${g.currentAmount} / $${g.targetAmount})\n`;
  });
  if (data.goals.length > 3) prompt += `- ...and ${data.goals.length - 3} more.\n`;

  prompt += `\nRecent Transactions (${data.transactions.length}):\n`;
  // Limit transactions shown in prompt for brevity
  data.transactions.slice(0, 5).forEach(t => {
    prompt += `- ${t.date.substring(0, 10)}: ${t.description}: $${t.amount.toFixed(2)} (${t.category})\n`;
  });
  if (data.transactions.length > 5) prompt += `- ...and ${data.transactions.length - 5} more.\n`;

  // Explicit instruction for the desired output format is now handled in the callGeminiAI function
  return prompt;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeminiAIResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { goals, transactions, balance } = req.body as RequestPayload;

    // Basic validation (enhance as needed)
    if (!Array.isArray(goals) || !Array.isArray(transactions) || typeof balance !== 'number') {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    const prompt = generatePrompt({ goals, transactions, balance });

    // Call Gemini AI (or the simulation)
    const aiResponse = await callGeminiAI(prompt);

    return res.status(200).json(aiResponse);

  } catch (error) {
    console.error('API Error fetching Gemini tip:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return res.status(500).json({ error: `Failed to get AI tip: ${message}` });
  }
}
