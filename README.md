🚀 AI Decision Flow Canvas
An interactive visual decision-tree builder and orchestration engine powered by Next.js 15 (App Router), React Flow (@xyflow/react), Inngest Workflow Engine, and Google Gemini AI.

This project enables users to construct complex decision workflows visually, execute prompts through Gemini AI, traverse graph paths based on boolean evaluations, and track step-by-step background execution logs in real time.

🌟 Key Features
🎨 Interactive Decision Builder: Drag, connect, and configure decision nodes with customizable prompts using React Flow.

🤖 Gemini AI Evaluation: Dynamic evaluation of prompts returning structured YES / NO decision pathways.

⚡ Background Workflow Orchestration: Asynchronous graph traversal powered by Inngest steps, handling retries and status logging.

📜 Real-time Execution Terminal: Integrated UI logs drawer displaying event trigger status, event IDs, and error states.

💾 JSON State Management: Export complete graph topologies and node settings with a single click.

🛠️ Tech Stack
Frontend Framework: Next.js 15 (React 19, TypeScript)

Canvas Engine: @xyflow/react

Orchestration & Background Jobs: Inngest

AI Provider: @google/genai (Google Gemini API)

Styling & UI: Tailwind CSS, Lucide React Icons

🏗️ Architecture & How It Works
Graph Construction: The user adds decision nodes on the canvas and connects conditional outputs (YES green handle / NO red handle).

Event Dispatch: Clicking Execute Flow triggers a POST request to /api/execute-flow, sending node topologies and edge mappings to Inngest.

AI Step Processing: Inngest step functions evaluate node prompts via Google Gemini AI sequentially or conditionally based on prior decisions.

Execution Tracing: Results and status updates stream back to the UI execution logs panel and the Inngest Dev Server dashboard.

🚀 Getting Started
1. Prerequisites
Ensure you have Node.js 18+ installed on your machine.

2. Clone the Repository
git clone [https://github.com/Sobia122/ai-decision-flow-canvas.git](https://github.com/Sobia122/ai-decision-flow-canvas.git)
cd ai-decision-flow-canvas
3. Install Dependencies
npm install
4. Configure Environment Variables
Create a .env.local file in the root directory:

GEMINI_API_KEY=your_gemini_api_key_here
INNGEST_EVENT_KEY=local-dev-key
5. Run Development Servers
Start the Next.js development server:

npm run dev
In a separate terminal window, launch the Inngest Dev Server:

npx inngest-cli@latest dev
Canvas UI: http://localhost:3000

Inngest Dashboard: http://localhost:8288

📂 Project Structure
├── app/
│   ├── api/
│   │   ├── execute-flow/route.ts  # Triggers Inngest flow event
│   │   └── inngest/route.ts       # Inngest API endpoint handler
│   ├── page.tsx                   # Main React Flow Canvas page
│   └── layout.tsx
├── components/
│   └── DecisionNode.tsx           # Custom React Flow Node Component
├── inngest/
│   ├── client.ts                  # Inngest Client Instance
│   └── functions.ts               # AI Decision Execution Workflow Functions
├── public/
└── README.md
📝 License
Distributed under the MIT License.