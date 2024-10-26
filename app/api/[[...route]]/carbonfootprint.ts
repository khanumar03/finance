import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { transactions } from "@/db/schema";
import { db } from "@/db/drizzle";

const genAI = new GoogleGenerativeAI("AIzaSyCMG6-ND4m_5mv1SBWohrDuJG7Zo3SJ1N4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  const data = await db.select().from(transactions)
  

  const response = await model.generateContent(`
         ${data}, 
         "Analyze the following user transaction data to calculate the carbon emissions for each spending category, estimate the total current carbon footprint, and provide recommendations for reducing both spending and emissions. For each spending category, outline strategies to lower carbon output and specify potential financial savings where applicable.

Additionally, create a forecast showing projected monthly reductions in carbon emissions if the recommendations are followed, formatted as JSON for easy integration into visualization tools. The JSON format should include:

Current emissions: Total emissions categorized by spending.
Reduction recommendations: Strategies with details for each spending category.
Forecast: Monthly data points for the next 12 months showing predicted reductions in carbon emissions based on each category, allowing for a comparative analysis with current levels.
        `);
          

  return c.json({ data: response.response.text() });
});

export default app;
