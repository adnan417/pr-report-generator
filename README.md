# 📄 PR Report Generator

Automate the generation of weekly Pull Request (PR) summary reports from multiple GitHub repositories.  
This tool fetches PR insights, organizes them by module or project area, and generates a professional Word document report. Additionally, it leverages an LLM (Groq) to fetch key insights from PRs, with the option to extend or replace it.

---

## 🚀 Features

- 🔹 Generate PR summaries across **multiple repositories**.
- 🔹 **Fully dynamic** — pass repository details via command-line arguments.
- 🔹 Outputs a clean **.docx** report.
- 🔹 Fetches **key insights** from PRs using an integrated LLM (Groq).
- 🔹 Users can **extend** the LLM functionality by adding their own LLM.
- 🔹 If the LLM is not used, the output will be **logged** for later review.
- 🔹 **Reusable** across any project, any team.
- 🔹 Easy to customize and automate.

---

## 📦 Tech Stack

- Node.js
- GitHub REST API
- DOCX document generation (`docx` library)
- **Groq LLM** for key insights (optional)
- Support for extending with **custom LLMs**

---

## 📚 Requirements

- **Node.js** v16 or higher
- **GitHub Personal Access Token (PAT)** with `repo` permissions (for private repos)
- Your repositories should be hosted on **GitHub**
- **Groq LLM** (Optional, but required for fetching key insights from PRs)

---

## 🛠 Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pr-report-generator.git
   cd pr-report-generator
   
2. **Install dependencies**
   ```bash
   npm install
3. **Set up environtment variables**
   ```ini
   GITHUB_TOKEN=your_github_pat_token
   REPO_OWNER=your_github_username_or_organization
   GROQ_API_KEY=""  # Set the Groq API key (default)
4. **Usage**
   ```bash
   node index backend:your-backend-repo frontend:your-frontend-repo mobile:your-mobile-repo

## Output
After running the script, the output will be saved as a Word document:
```ini
Weekly-PR-Report.docx
```

## LLM Integration
By default, the script uses Groq to fetch key insights from PRs. This is integrated for ease of use.
Make sure you have the Groq API Key in your .env file to enable it. If you wish to use any other LLM,
add its api key in .env file and create a function ai service and use it. An example for OpenRouter has been given
there in the code.
When no LLM is used, the script will log the PR data without fetching key insights.


