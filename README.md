# BudgetAI

BudgetAI is a sleek, AI-powered personal finance assistant that helps users manage their spending, track their financial goals, and receive personalized, real-time insights based on current economic conditions.

## Live Application

Explore BudgetAI live at:  
[https://budgetwise-guide-63.lovable.app/](https://budgetwise-guide-63.lovable.app/)

## Overview

BudgetAI combines a clean, minimalistic frontend with a robust backend to deliver a seamless, interactive financial management experience. Users can add transactions directly from the dashboard, track their goals, and receive personalized financial tips powered by Gemini AI. The backend is powered by Supabase for real-time data storage and retrieval.

## Technologies Used

- **Frontend:**  
  - Vite  
  - React  
  - TypeScript  
  - shadcn-ui  
  - Tailwind CSS

- **Backend:**  
  - Express (Node.js)  
  - Supabase  
  - Gemini AI (Google Generative Language API)

## Project Structure & Process

### 1. Frontend Development
- **Dashboard & UI:**  
  - Designed a minimalistic, user-friendly interface with a focus on clear information hierarchy and intuitive navigation.
  - Implemented various pages (Dashboard, Transactions, Insights, Goals, Education, and Settings) with consistent styling.
  - The Dashboard displays user transactions, goal progress, and a Financial Tip Card that is dynamically updated using Gemini AI.

- **Real-Time Data Integration:**  
  - Connected the UI to Supabase to store and fetch user data such as transactions, financial goals, and education progress.
  - Ensured that the user can input data directly from the dashboard as well as on dedicated pages.

### 2. Backend Development
- **API Server:**  
  - Built a standalone Node.js Express server to handle API requests.
  - Created endpoints to manage user data, handle transactions, and generate personalized financial tips.
  - Integrated Gemini AI to produce context-aware financial insights by feeding it user-specific data and real-time economic indicators.

- **Supabase Integration:**  
  - Set up Supabase for user authentication, data storage, and real-time updates.
  - Structured the database to include tables for users, transactions, goals, education progress, and user settings.

### 3. Gemini AI Integration
- **Personalized Financial Tips:**  
  - Implemented a Financial Tip Card component that calls a backend endpoint to fetch an AI-generated financial tip.
  - Gemini AI uses user data (goals, transactions, and balance) alongside economic trends to produce a concise, actionable tip.
  - Detailed prompts ensure that the output is tailored, relevant, and helpful for the user's financial planning.

### 4. Deployment
- The project is deployed and accessible online. For further updates or modifications, you can clone the repository and run the development server locally.

## Local Setup

To work on BudgetAI locally:

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
Navigate to the project directory:

sh
Copy
cd <YOUR_PROJECT_NAME>
Install dependencies:

sh
Copy
npm install
Start the development server:

sh
Copy
npm run dev
Backend Setup:
Navigate to the api-server directory, install its dependencies, and run:

sh
Copy
cd api-server
npm install
npm start
Ensure that the API server is running while using the frontend.
