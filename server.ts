import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to prevent crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not defined. Chatbot will run in guest offline mode.");
      throw new Error("GEMINI_API_KEY is not defined. Please verify your secrets configuration.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global state / mock in-memory database for leads
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  createdAt: string;
}

const contactLeads: ContactMessage[] = [];

// API endpoints
app.post("/api/contact", (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: "Missing required fields (name, email, service, message)" });
  }

  const newLead: ContactMessage = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name,
    email,
    phone,
    service,
    message,
    createdAt: new Date().toISOString(),
  };

  contactLeads.push(newLead);
  console.log(`[Lead received] ID: ${newLead.id}, Name: ${newLead.name}, Service: ${newLead.service}`);

  return res.json({
    success: true,
    message: "Thank you for contacting Go Happy Con! We have received your inquiry and will get back to you within 24 hours.",
    leadId: newLead.id
  });
});

// AI Chatbot endpoint proxying Gemini API securely
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array provided." });
  }

  // Extract the latest user message
  const userMessages = messages.filter(m => m.role === "user");
  const latestUserMessageIdx = messages.length - 1;
  const latestUserMessage = messages[latestUserMessageIdx];

  if (!latestUserMessage || latestUserMessage.role !== "user") {
    return res.status(400).json({ error: "Missing active user prompt." });
  }

  try {
    const ai = getGenAIClient();
    
    // Construct system instructions with deep background knowledge about Go Happy Con
    const systemPrompt = `You are "HappyCon-Bot", the friendly, highly competent AI concierge for Go Happy Con (GoHappyCon.com), located in Gig Harbor, WA.
Your goal is to answer visitor questions, build deep trust, demonstrate specialized drone and aviation expertise, guide them in selecting services, and assist them in booking a call or submitting a contact request.

### BUSINESS CONTACT INFORMATION
- **Company Name**: Go Happy Con
- **Website**: GoHappyCon.com
- **HQ Location**: Gig Harbor, Washington (serving all surrounding Pacific Northwest areas: Tacoma, Port Orchard, Bremerton, Seattle, Key Peninsula)
- **Phone**: 253-888-3432 (click-to-call)
- **Email**: rbd171@gmail.com
- **Founder/Operator**: Robert B.

### THE THREE CORE SERVICES
1. **Real Estate Photography**:
   - High-fidelity property visualization including interior HDR imagery, twilight elevation captures, and 4K aerial drone mapping.
   - Fast 24-48h turnaround time.
   - Compliant with MLS standards.
   - Delivers agent marketing kits, high-definition videos, and social media exports.

2. **Police Misconduct Consulting**:
   - Compassionate and professional consulting for individuals wrongfully attacked, excessive force targets, or mistreated by law enforcement.
   - Guide them through meticulous documentation of physical injuries and vehicle/property damage, structured collection of witness testimonies, filing of formal public records acts requests (bodycams, dashcams), organizing chronological incident files, and understanding options.
   - **CRITICAL LEGAL DISCLAIMER**: You MUST deliver this exact disclaimer if asked about medical, formal judicial, or attorney representation: "Go Happy Con provides consulting and informational services only and does not provide legal advice, legal action representation, or act as a law firm. We help you package data so your legal or public complaint has maximum impact."

3. **Drone Power Washing**:
   - Cutting-edge heavy-lift drone pressure washing and soft washing systems for commercial properties, high-rise building facades, fragile residential roof cleaning, and hard-to-reach industrial structures.
   - Much safer, eliminates scaffolding or crane risks, utilizes biodegradable eco-safe solvents, and reduces site disruption down to a fraction of traditional crews.

### CONVERSATIONAL RULES
- Be extremely compassionate, clear, professional, and slightly conversational.
- Incorporate a subtle local Northwest resonance (Gig Harbor, Puget Sound, evergreen forests).
- Suggest relevant CTA buttons (e.g., advising they use the "Request Quote" or "Contact page" for full bookings).
- Keep formatting clean, structure with responsive lists or short paras, and avoid overly technical jargon unless asked.
- Do NOT output markdown code blocks formatting your *whole* response, just normal markdown. Keep answers under 150 words for readability.`;

    // Convert messages history format for Gemini Chats
    // Since we want to use the streamlined chats API, let's create a chat session
    const chatHistory = messages.slice(0, -1).map(msg => {
      return {
        role: msg.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: msg.text || msg.content || "" }]
      };
    });

    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      history: chatHistory
    });

    const aiResponse = await chatInstance.sendMessage({
      message: latestUserMessage.text || latestUserMessage.content || ""
    });

    return res.json({
      role: "assistant",
      text: aiResponse.text || "I apologize, I could not generate a response. Please call us directly at 253-888-3432 for immediate assistance."
    });

  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    // Graceful fallback response if API fails or KEY is missing
    return res.json({
      role: "assistant",
      text: `**Hello!** I am running in guest offline mode right now, but I can still tell you about Go Happy Con in Gig Harbor!
      
We specialize in:
1. **Real Estate Photography** (HD interiors, professional drone view, 4K video)
2. **Police Misconduct Consulting** (Injury documentation, official evidence organizing, strict consulting; *not a law firm*)
3. **Drone Power Washing** (Safe aerial building & roof soft washing)

Please feel free to reach out to us directly at **253-888-3432** or email **rbd171@gmail.com**, and we'll start work right away!`
    });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Express server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting Express server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted! Client interface is accessible on http://localhost:${PORT}`);
  });
}

startServer();
