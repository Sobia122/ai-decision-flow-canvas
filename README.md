
# AI Decision Flow Canvas

An interactive visual decision-tree builder and orchestration engine powered by Next.js 15, React Flow, Inngest, and Google Gemini AI.

This project enables users to construct complex decision workflows visually, execute prompts through Gemini AI, traverse graph paths based on boolean evaluations, and track background execution logs in real time.

## Key Features

- **Interactive Decision Builder:** Drag, connect, and configure decision nodes with customizable prompts using React Flow.
- **Gemini AI Evaluation:** Dynamic evaluation of prompts returning structured YES or NO decision pathways.
- **Background Workflow Orchestration:** Asynchronous graph traversal powered by Inngest steps.
- **Real-time Execution Terminal:** Integrated UI logs drawer displaying event trigger status and event IDs.
- **JSON State Management:** Export complete graph topologies with a single click.

## Tech Stack

- **Frontend Framework:** Next.js 15 (React 19, TypeScript)
- **Canvas Engine:** `@xyflow/react`
- **Orchestration:** Inngest
- **AI Provider:** Google Gemini API
- **Styling:** Tailwind CSS, Lucide React Icons

## Architecture & How It Works

1. **Graph Construction:** The user adds decision nodes on the canvas and connects conditional outputs.
2. **Event Dispatch:** Clicking Execute Flow triggers a POST request to `/api/execute-flow`.
3. **AI Step Processing:** Inngest step functions evaluate node prompts via Google Gemini AI.
4. **Execution Tracing:** Results stream back to the UI execution logs panel.

## Getting Started

### 1. Prerequisites
Ensure you have Node.js 18+ installed on your machine.

### 2. Clone the Repository

git clone [https://github.com/Sobia122/ai-decision-flow-canvas.git](https://github.com/Sobia122/ai-decision-flow-canvas.git)
cd ai-decision-flow-canvas
3. Install Dependencies
Bash
npm install
4. Configure Environment Variables
Create a .env.local file in the root directory:

GEMINI_API_KEY=your_gemini_api_key_here
INNGEST_EVENT_KEY=local-dev-key
5. Run Development Servers
Start the Next.js development server:

Bash
npm run dev
In a separate terminal window, launch the Inngest Dev Server:

Bash
npx inngest-cli@latest dev
Canvas UI: http://localhost:3000

Inngest Dashboard: http://localhost:8288

License
Distributed under the MIT License.
