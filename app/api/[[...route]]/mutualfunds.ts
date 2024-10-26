import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";

import { readFileSync } from "fs";
import { join } from "path";
import { db } from "@/db/drizzle";
import { transactions } from "@/db/schema";

interface Fund {
  NAV?: number;
  FundName: string;
  Manager: string;
  Category: string;
  ExpenseRatio?: number;
  Returns?: number;
  RiskRating?: string;
  InceptionDate?: string;
  AUM?: string;
  ExitLoad?: number | null;
}

function readCSV(filename: string): Fund[] {
  const funds: Fund[] = [];
  
//   const filePath = join(process.cwd(), filename);

//   console.log(filePath);




  

  const data = `Fund Name,Fund Category,Fund Manager,NAV,Expense Ratio,Returns (%),Risk Rating,Inception Date,AUM,Exit Load
ICICI Prudential Liquid Fund,Liquid Fund,Vineet Nalwa,100.25,0.75%,6.5%,Low,01/01/2018,₹50,000 crore,0.5%
SBI Magnum Ultra Short Duration Fund,Ultra Short-term Fund,Dinesh Ahuja,101.12,0.60%,5.2%,Very Low,06/15/2015,₹10,000 crore,0.25%
Franklin India Ultra Short Bond Fund,Ultra Short-term Fund,Sachin Padwal Desai,99.85,0.80%,5.8%,Low,03/01/2012,₹5,000 crore,0.40%
Kotak Money Market Fund,Money Market Fund,Debasish Ghosh,100.50,0.65%,4.9%,Very Low,09/01/2008,₹15,000 crore,0.30%
Axis Short Term Fund,Short-term Debt Fund,Aditya Pagaria,98.75,0.90%,6.1%,Moderate,02/01/2010,₹25,000 crore,0.55%
UTI Treasury Advantage Fund,Low Duration Fund,Amandeep Singh Chopra,102.38,0.95%,7.3%,Moderate,05/01/2016,₹10,000 crore,0.60%
Canara Robeco Conservative Hybrid Fund,Conservative Hybrid Fund,Krishna Sanghvi,105.62,1.10%,8.5%,Moderate,11/01/2005,₹5,000 crore,0.70%
DSP Tax Saver Fund,Tax Saving Fund,Rohit Singhania,108.21,1.20%,9.2%,High,08/01/2002,₹10,000 crore,0.80%
Mirae Asset India Equity Fund,Large Cap Equity Fund,Neelesh Surana,115.89,1.50%,12.5%,High,04/01/2000,₹35,000 crore,1.00%
HDFC Balanced Advantage Fund,Balanced Advantage Fund,Prashant Jain,110.45,0.80%,9.8%,Moderate,07/01/2014,₹40,000 crore,0.50%
IDFC Dynamic Bond Fund,Dynamic Bond Fund,Suyash Choudhary,101.78,0.85%,6.8%,Moderate,03/15/2013,₹15,000 crore,0.45%
Sundaram Low Duration Fund,Low Duration Fund,Siddharth Chaudhary,100.92,0.70%,5.5%,Low,06/01/2011,₹5,000 crore,0.35%
ICICI Prudential Credit Risk Fund,Credit Risk Fund,Manish Banthia,103.15,1.05%,7.9%,High,09/01/2017,₹10,000 crore,0.65%
Franklin India Government Securities Fund,Government Securities Fund,Kunal Agrawal,102.50,0.80%,6.3%,Low,02/01/2009,₹5,000 crore,0.50%
Kotak Gilt Investment Fund,Government Securities Fund,Abhishek Bisen,105.90,1.00%,8.1%,Moderate,05/01/2012,₹10,000 crore,0.60%
Axis Banking & PSU Debt Fund,Banking and PSU Fund,Aditya Pagaria,104.20,0.95%,7.5%,Moderate,08/01/2015,₹15,000 crore,0.55%
UTI Arbitrage Fund,Arbitrage Fund,Amit Sharma,101.50,0.75%,5.8%,Very Low,04/01/2014,₹5,000 crore,0.30%
SBI Equity Savings Fund,Equity Savings Fund,Dinesh Ahuja,106.80,1.10%,9.5%,Moderate,03/01/2016,₹10,000 crore,0.65%
HDFC Top 200 Fund,Large Cap Equity Fund,Prashant Jain,112.50,1.25%,11.2%,High,01/01/2005,₹20,000 crore,0.90%
ICICI Prudential Midcap Fund,Mid Cap Equity Fund,Mitul Patel,109.20,1.20%,10.5%,High,06/01/2008,₹15,000 crore,0.80%
Franklin India Smaller Companies Fund,Small Cap Equity Fund,R Janakiraman,114.90,1.30%,12.8%,High,09/01/2010,₹10,000 crore,0.95%
UTI NIFTY Index Fund,Index Funds/ETFs,V Srivatsa,111.15,1.20%,11.0%,High,03/01/2007,₹5,000 crore,0.85%
Axis Long Term Equity Fund,Tax Saving Fund,Jinesh Gopani,108.60,1.05%,9.8%,Moderate,02/01/2012,₹10,000 crore,0.70%
Kotak Infrastructure & Economic Reform Fund,Sectoral Equity Fund,Harsha Upadhyaya,110.80,1.15%,10.8%,High,05/01/2015,₹5,000 crore,0.80%
Mirae Asset Global Commodity Stocks Fund,International Equity Fund,Neelesh Surada,113.40,1.35%,12.2%,High,08/01/2010,₹5,000 crore,0.95%
DSP World Gold Fund,Commodity Fund,Kapil Punjabi,109.50,1.20%,10.3%,High,04/01/2012,₹2,000 crore,0.85%
ICICI Prudential Regular Savings Fund,Conservative Hybrid Fund,Manish Banthia,112.00,1.25%,11.5%,High,06/01`;
//   console.log(data);
  
  const lines = data.split("");

  // Skip header row
  const header = lines[0].split(",");
  const columnIndices: { [key: string]: number } = {};

  for (let i = 0; i < header.length; i++) {
    columnIndices[header[i].trim().toLowerCase().replace(/ /g, "_")] = i; // Handle spaces in headers
  }

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",");
    const fundData: Partial<Fund> = {};

    for (const [key, index] of Object.entries(columnIndices)) {
      const value = row[index];
      if (value) {
        switch (key.toLowerCase()) {
          case "nav":
            fundData.NAV = parseFloat(value);
            break;
          case "fund_name":
            fundData.FundName = value.trim();
            break;
          case "manager":
            fundData.Manager = value.trim();
            break;
          case "category":
            fundData.Category = value.trim();
            break;
          case "expense_ratio":
            fundData.ExpenseRatio = parseFloat(value.replace("%", "")) / 100;
            break;
          case "returns":
            fundData.Returns = parseFloat(value.replace("%", ""));
            break;
          case "risk_rating":
            fundData.RiskRating = value.trim();
            break;
          case "inception_date":
            fundData.InceptionDate = value.trim();
            break;
          case "aum":
            fundData.AUM = value.trim();
            break;
          case "exit_load":
            fundData.ExitLoad = parseFloat(value.replace("%", "")) || null;
            break;
        }
      }
    }
    funds.push(fundData as Fund);
  }
  return funds;
}

function recommendFunds(funds: Fund[], savings: number): Fund[] {
  const affordableFunds = funds.filter(
    (fund) => fund.NAV !== undefined && fund.NAV <= savings
  );
  const sortedFunds = affordableFunds.sort(
    (a, b) => (b.Returns || 0) - (a.Returns || 0)
  );
  return sortedFunds.slice(0, 3);
}

function calculateProfit(
  investmentAmount: number,
  returnPercentage: number
): number {
  return investmentAmount * (returnPercentage / 100);
}

const app = new Hono().post("/", async (c) => {
    const csvFile = "/public/fund.csv"
    

    try {
      const allFunds = readCSV(csvFile);
      const { savings }: any  = c.body
    //   console.log(savings);
      
      const recommended = recommendFunds(allFunds, savings);
      
  
      console.log("\nRecommended Mutual Funds:");
      for (let i = 1; i <= recommended.length; i++) {
        const fund = recommended[i - 1];
        const investmentAmount = Math.min(savings, fund.NAV || 0);
        const profit = calculateProfit(investmentAmount, fund.Returns || 0);
  
        console.log(`\n${i}. ${fund.FundName || ""}`);
        console.log(`   Managed by: ${fund.Manager || ""}`);
        console.log(`   NAV: ₹${(fund.NAV || 0).toFixed(2)}`);
        console.log(`   Return: ${fund.Returns || 0}%`);
        console.log(`   Risk: ${fund.RiskRating || ""}`);
        console.log(`   AUM: ${fund.AUM || ""}`);
        console.log(`   Exit Load: ${(fund.ExitLoad || 0).toFixed(2)}%`);
        console.log(`   Investment Amount: ₹${investmentAmount.toFixed(2)}`);
        console.log(`   Potential Profit after 1 year: ₹${profit.toFixed(2)}`);
        console.log(
          `   Total after 1 year: ₹${(investmentAmount + profit).toFixed(2)}`
        );
      }

      return c.json({data: recommended})
    } catch (error) {
        return c.json({error: "error"})
    //   console.error("An error occurred:", error);
    }
});


export default app;