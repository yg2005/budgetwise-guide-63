import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Load environment variables from .env.local in the parent directory
dotenv.config({ path: '../.env.local' });

// --- Interfaces (copy from original API route) ---
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

interface ErrorResponse {
  error: string;
}
// --- End Interfaces ---

// --- Gemini AI Setup (copy from original API route) ---
const apiKey = process.env.GEMINI_AI_KEY;
if (!apiKey) {
  console.error("ERROR: GEMINI_AI_KEY environment variable not set. Make sure it's in the .env.local file in the project root.");
  process.exit(1); // Exit if key is missing
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

const generationConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 1,
  maxOutputTokens: 150,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];
// --- End Gemini AI Setup ---

// --- Helper Functions (copy from original API route) ---
async function callGeminiAI(prompt: string): Promise<GeminiAIResponse> {
  // ... (Keep the exact same callGeminiAI function logic as before)
  console.log("Calling Gemini AI with prompt...");
  try {
    const result = await model.generateContentStream([
      {
        text: prompt + `\n\nRespond ONLY with a JSON object containing 'tip' and 'category' keys, like this: { "tip": "...", "category": "..." }. Do not include markdown formatting (like \`\`\`json).`
      }
    ]);
    let aggregatedResponse = '';
    for await (const chunk of result.stream) {
      aggregatedResponse += chunk.text();
    }
    console.log("Raw Gemini AI Response:", aggregatedResponse);
    try {
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
    throw new Error(`Gemini API call failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function generatePrompt(data: RequestPayload): string {
  // ... (Keep the exact same generatePrompt function logic as before)
  let prompt = `Analyze the following user financial data and provide ONE short, actionable financial tip (1-2 sentences) and a relevant category (e.g., Savings, Budgeting, Spending, Investment). Focus on being helpful and concise.\n\nUser Balance: $${data.balance.toFixed(2)}\n\nGoals (${data.goals.length}):\n`;
  data.goals.slice(0, 3).forEach(g => {
    prompt += `- ${g.name} ($${g.currentAmount} / $${g.targetAmount})\n`;
  });
  if (data.goals.length > 3) prompt += `- ...and ${data.goals.length - 3} more.\n`;
  prompt += `\nRecent Transactions (${data.transactions.length}):\n`;
  data.transactions.slice(0, 5).forEach(t => {
    prompt += `- ${t.date.substring(0, 10)}: ${t.description}: $${t.amount.toFixed(2)} (${t.category})\n`;
  });
  if (data.transactions.length > 5) prompt += `- ...and ${data.transactions.length - 5} more.\n`;
  return prompt;
}
// --- End Helper Functions ---

// --- Express Server Setup ---
const app = express();
const port = 3001; // Use a different port than Vite (e.g., 3001)

app.use(cors()); // Enable CORS for requests from the Vite dev server
app.use(express.json()); // Middleware to parse JSON request bodies

// Define the API endpoint with more specific Request/Response types
app.post<
    {},
    GeminiAIResponse | ErrorResponse, // Possible Response Body types
    RequestPayload                   // Expected Request Body type
  >('/api/gemini-ai/getTip', 
  async (req: Request<{}, GeminiAIResponse | ErrorResponse, RequestPayload>, res: Response<GeminiAIResponse | ErrorResponse>) => {
  try {
    // Request body should be correctly typed now, cast is less necessary but safe
    const { goals, transactions, balance } = req.body;

    if (!Array.isArray(goals) || !Array.isArray(transactions) || typeof balance !== 'number') {
      // TS knows this response should match ErrorResponse
      res.status(400).json({ error: 'Invalid request payload' });
      return; // Exit the function after sending response
    }

    const prompt = generatePrompt({ goals, transactions, balance });
    const aiResponse = await callGeminiAI(prompt);
    // TS knows this response should match GeminiAIResponse
    res.status(200).json(aiResponse);

  } catch (error) {
    console.error('API Error fetching Gemini tip:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    // TS knows this response should match ErrorResponse
    res.status(500).json({ error: `Failed to get AI tip: ${message}` });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
// --- End Express Server Setup ---
