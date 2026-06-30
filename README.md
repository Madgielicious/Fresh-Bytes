# FreshStart (Fresh-Bytes)

FreshStart is a web app that helps freshman students navigate government and community services. It provides a searchable services directory, a "how it works" guide, an FAQ section, and an AI assistant (powered by Google's Gemini API) that answers questions about government services, student requirements, and local processes.

## Features

- **Service directory** – browse cards for services like searching government offices, scholarships, and document requirements.
- **How It Works** section explaining the step-by-step process for getting things done.
- **AI Assistant** – a chat widget that sends user questions to a Gemini-powered backend and displays the answers.
- **FAQ accordion** with expandable questions and answers.
- **Responsive navbar** with a mobile menu toggle.
- Scroll-reveal animations for service cards.

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js with Express, acting as a proxy to the Gemini API
- **AI Model:** Google Gemini (`gemini-2.0-flash`)

## Project Structure

```
Fresh-Bytes-main/
├── index.html      # Main page markup (navbar, hero, services, FAQ, chatbot)
├── style.css        # Styling for all sections and components
├── script.js         # Mobile menu, chatbot client logic, scroll reveal, FAQ accordion
├── server.js         # Express server + /api/chat proxy to Gemini API
└── package.json       # Project metadata and dependencies
```

## Prerequisites

- Node.js >= 18
- A Google Gemini API key

## Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone <repo-url>
   cd Fresh-Bytes-main
   npm install
   ```

2. Set your Gemini API key as an environment variable:

   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

   On Windows (PowerShell):

   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open your browser to [http://localhost:3000](http://localhost:3000).

## How the AI Assistant Works

The frontend (`script.js`) sends the user's question to the backend endpoint `POST /api/chat`. The Express server (`server.js`) forwards the request to the Gemini API, with a system instruction that scopes the assistant to answering questions about government services, student requirements, and local processes. The generated answer is returned to the frontend and rendered in the chat window.


## License

This project does not currently specify a license.
