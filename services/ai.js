const axios = require("axios");
const {jsonrepair} = require("jsonrepair");
require("dotenv").config();
const fs = require("fs");


const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

class Llm{
    
    constructor(inputData){
        this.prompt = `
        You are an expert release notes generator and GitHub PR analyst.
        
        I have provided you a list of GitHub Pull Requests, each containing a PR title and number (in the Input section).
        
        Your tasks:
        1. Analyze the titles to identify the purpose of each PR.
        2. Group PRs under **meaningful feature themes** based on your understanding.
        3. You may create **any number of themes** — do not limit yourself to examples. Use your best judgment.
        4. Ensure **no PR appears in more than one theme**.
        5. For each PR in the output, rewrite its title to concisely describe the specific change or enhancement **without repeating the theme name** (e.g., if the theme is "Bug Fixes", do not include "Fixed..." or "Bug..." in the PR title — just describe what was fixed).
        
        ## Input:
        ${inputData}
        
        ## Output Format (strict JSON):
        Return the data as a JSON object structured like this:
        
        {
          "themes": [
            {
              "theme": "",                           // Meaningful name for the group
              "prs": [
                {
                  "description": "",                      // Clean, theme-independent description
                  "number": (PR number from input) 
                }
              ]
            }
          ]
        }
        
        Do not include markdown, explanations, or any other text. Just return valid JSON.
        
        ### Example Input:
        [
          { "title": "Added refund logic for delayed orders", "number": 2700 },
          { "title": "Pay now button added on order screen", "number": 2683 },
          { "title": "Reminder not sent to customer on time", "number": 2703 }
        ]
        
        ### Example JSON Output:
        {
          "themes": [
            {
              "theme": "Order Management Enhancements",
              "prs": [
                { "description": "Refund logic for delayed orders", "number": 2700 },
                { "description": "Pay now button on order screen", "number": 2683 }
              ]
            },
            {
              "theme": "Bug Fixes",
              "prs": [
                { "description": "Reminder timing issue for customers", "number": 2703 }
              ]
            }
          ]
        }
        
        Analyze the input list of PRs above and return the JSON output in the specified format.
        `;
        
    }

    async getInsightsByGroq(){
        try{
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: "gemma2-9b-it",
                    messages: [{ role: "user", content: this.prompt }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            const truncatedJsonString = truncateBeforeResponse(response.data.choices[0].message.content);
            
            // console.log(truncatedJsonString);

            return JSON.parse(jsonrepair(truncatedJsonString)).themes;
        }catch(error){
            console.error("Error getting key insights:", error);
            return [];
        }
    }

    async getInsightsByOpenRouter() {
        try {
            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "deepseek/deepseek-r1:free",
                    messages: [
                        {
                            role: "user",
                            content: this.prompt
                        }
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            console.log(response.data);
    
            const truncatedJsonString = truncateBeforeResponse(response.data.choices[0].message.content);
    
            console.log(truncatedJsonString);
    
            return JSON.parse(jsonrepair(truncatedJsonString)).themes;
    
        } catch (error) {
            if (error.response) {
                console.error("Error data:", error.response.data);
                console.error("Status:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else {
                console.error("Error message:", error.message);
            }
            return [];
        }
    }    

}

module.exports = Llm;

function truncateBeforeResponse(jsonString){
    const pattern = /{([\s\S]*)}/;
    const match = pattern.exec(jsonString);

    if(match)
    return match[0];

    return "";
}
