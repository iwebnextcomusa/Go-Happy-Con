import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import vm from "vm";
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

// Dynamic proxy to stream the remote background video on-the-fly and cache it securely
app.get("/api/hero-bg.mp4", async (req, res) => {
  const videoUrl = "https://iwebnext.kesug.com/herobg.mp4";
  const cachedPath = path.join(process.cwd(), "src/assets/hero_bg_cached.mp4");

  // Ensure directories exist
  const dir = path.dirname(cachedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Helper function to get text content over HTTPS
  const fetchText = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, (response) => {
        let body = "";
        response.on("data", (chunk) => body += chunk);
        response.on("end", () => resolve(body));
      }).on("error", reject);
    });
  };

  // Helper function to download file with specific cookie
  const downloadWithCookie = (url: string, cookieVal: string, dest: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Cookie': '__test=' + cookieVal
        }
      };
      https.get(url, options, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // If redirected, follow redirect
          downloadWithCookie(response.headers.location, cookieVal, dest).then(resolve).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status code ${response.statusCode}`));
          return;
        }
        const fileStream = fs.createWriteStream(dest);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close(() => resolve());
        });
        fileStream.on("error", (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      }).on("error", reject);
    });
  };

  const serveCachedFile = () => {
    return res.sendFile(cachedPath);
  };

  // If already cached and valid, serve immediately!
  if (fs.existsSync(cachedPath) && fs.statSync(cachedPath).size > 1000000) {
    return serveCachedFile();
  }

  try {
    console.log("[Video Proxy] Cache missed or invalid. Resolving security challenge...");
    const htmlPage = await fetchText(videoUrl);
    const aesScript = await fetchText("https://iwebnext.kesug.com/aes.js");

    const matchA = htmlPage.match(/a=toNumbers\(\"([a-f0-9]+)\"\)/);
    const matchB = htmlPage.match(/b=toNumbers\(\"([a-f0-9]+)\"\)/);
    const matchC = htmlPage.match(/c=toNumbers\(\"([a-f0-9]+)\"\)/);

    if (!matchA || !matchB || !matchC) {
      console.warn("[Video Proxy] Challenge markers not found. Trying download without cookie...");
      await downloadWithCookie(videoUrl, "", cachedPath);
      return serveCachedFile();
    }

    const aHex = matchA[1];
    const bHex = matchB[1];
    const cHex = matchC[1];

    const context = { slowAES: {} };
    vm.createContext(context);
    vm.runInContext(aesScript, context);

    const runnerCode = `
      function toNumbers(d){var e=[];d.replace(/(..)/g,function(d){e.push(parseInt(d,16))});return e}
      function toHex(){for(var d=[],d=1==arguments.length&&arguments[0].constructor==Array?arguments[0]:arguments,e="",f=0;f<d.length;f++)e+=(16>d[f]?"0":"")+d[f].toString(16);return e.toLowerCase()}
      var a = toNumbers("${aHex}");
      var b = toNumbers("${bHex}");
      var c = toNumbers("${cHex}");
      var d = toHex(slowAES.decrypt(c, 2, a, b));
      d;
    `;

    const decryptedCookie = vm.runInContext(runnerCode, context) as string;
    console.log(`[Video Proxy] Decrypted security cookie: ${decryptedCookie}`);

    const directUrl = `${videoUrl}?i=1`;
    await downloadWithCookie(directUrl, decryptedCookie, cachedPath);
    console.log(`[Video Proxy] Successfully downloaded and cached background video (Size: ${fs.statSync(cachedPath).size} bytes)`);

    return serveCachedFile();
  } catch (error: any) {
    console.error("[Video Proxy] Error loading video dynamically:", error.message);
    const fallbackVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-perfect-lawn-of-a-residential-house-4828-large.mp4";
    console.log("[Video Proxy] Redirecting to handsome public drone real-estate fallback video...");
    return res.redirect(fallbackVideoUrl);
  }
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
    
    // Construct system instructions with deep background knowledge about Go Happy Con & Robert David's Expert Witness / Consulting
    const systemPrompt = `You are "HappyCon-Bot", the friendly, highly competent AI concierge for Go Happy Con (GoHappyCon.com), located in Gig Harbor, WA, which operates in partnership with Blue Line Safety & Consulting Group and Happy Contractors, LLC.
Your goal is to answer visitor questions, build deep trust, demonstrate specialized drone and aviation / expert witness expertise, guide them in selecting services, and assist them in booking a call or submitting a contact request.

### CHIEF CONSULTANT BACKGROUND & CREDENTIALS
- **Name**: Robert David
- **Company Affiliations**: Blue Line Safety & Consulting Group & Happy Contractors, LLC (operating as Go Happy Con)
- **HQ Location**: Gig Harbor, Washington (serving all surrounding Pacific Northwest areas & nationwide for consulting/expert witness cases)
- **Phone**: 253-888-3432 
- **Email**: rbd171@gmail.com
- **Core Statement**: Over 45 years of combined real-world experience. Retired law enforcement professional and certified construction safety specialist.
- **Key Credentials**:
  * 20-Year Law Enforcement Career – Municipal & Military Police
  * Appointed Board Member, Deadly Force Review Board
  * 20-Year OTR Commercial Truck Driver – US & Canada
  * 5-Year Construction Safety Manager
  * CHST – Construction Health & Safety Technician (Certified, Washington State)
  * Construction Safety Consulting provided in partnership with Shield of Armor Safety, Lacey, WA
  * Traffic Accident Reconstruction services available through retired law enforcement partner

### AREAS OF EXPERT WITNESS TESTIMONY & CONSULTATION
1. **Law Enforcement**: Patrol Tactics & Officer Survival, Deadly Force Dynamics & Standards, Alcohol-Related Driving Offenses (DUI/DWI), Narcotics Investigation Standards, Informant Development & Handling, Undercover Operation Protocols.
2. **Construction & Workplace Safety**: Accident Prevention Program (APP) Development, Company APP Review & Compliance Analysis, Construction Site Detailed Evaluations, OSHA Compliance & Violation Defense, Incident Investigation & Root Cause Analysis.
3. **Commercial Transportation**: Traffic Accident Reconstruction, FMCSA / DOT Compliance Standards, OTR Driver Conduct & Hours of Service, Truck Accident Reconstruction Support, US & Canada Cross-Border Regulations.
4. **Policy & Training**: Use-of-Force Policy Drafting, Drug-Free Workplace Programs, Security Risk Assessments, Deadly Force Review Board Consulting.

### ENGAGEMENT INFORMATION
- **Availability**: Part-time consulting – flexible scheduling, remote review accepted.
- **Fee Structure**: Hourly rate available upon inquiry. Retainer arrangements considered.
- **Services**: Case review, written reports, deposition testimony, trial testimony, policy drafting, training.
- **Note**: References and CV are available upon request. Serving attorneys, municipalities, insurers & private firms nationwide. Criminal Pro Bono work considered, terms apply.

### THE THREE CORE divisions OF GO HAPPY CON
1. **Real Estate Photography**: High-fidelity property visualization, interior HDR imagery, twilight elevation captures, and 4K aerial drone mapping. Fast 24-48h turnaround time. MLS standards.
2. **Expert Witness & Safety/Law Enforcement Consulting**: Blue Line Safety & Consulting Group services led by Robert David, providing expert witness testimony, policy drafting, accident reconstruction, and case review.
3. **Drone Power Washing**: Cutting-edge heavy-lift drone pressure washing and soft washing systems for commercial properties, residential roofs, moss-dissolving treatment. Safe, eliminates scaffolding risk.

### CONVERSATIONAL RULES
- Be extremely compassionate, clear, professional, and helpful.
- Incorporate a subtle local Northwest resonance (Gig Harbor, Puget Sound, evergreen forests).
- Suggest relevant CTA buttons (e.g., advising they use the "Request Quote" or "Contact page" for full bookings).
- Keep answers under 150 words for readability.`;

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
