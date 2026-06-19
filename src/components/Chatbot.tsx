import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Phone, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hello! Welcome to **Go Happy Con** in Gig Harbor. 🌲 I am your aerial assistant. How can I help you today? Ask me about our Drone Photography, Police Misconduct files, or Drone Exterior Softwashing, or request a fast quote!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsgText = inputVal.trim();
    setInputVal("");

    const newMsg: ChatMessage = {
      role: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const payloadMessages = [...chatHistory, newMsg].map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        throw new Error("Local backend proxy failure.");
      }

      const data = await res.json();
      
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error("Chat proxy issue:", err);
      // Failover response
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I had a moment of connection variance, but please understand you can always call us directly at **253-888-3432** or reach out to us at **rbd171@gmail.com**. What other services can I outline for you?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePredefinedQuestion = (q: string) => {
    setInputVal(q);
  };

  const sampleQuestions = [
    "What are your drone cleaning services?",
    "Do you offer legal representation for police consulting?",
    "What is your typical photography turnaround?",
    "Are you certified for commercial flight?",
  ];

  return (
    <div id="ai-chatbot-widget" className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Toggle Round Button */}
      {!isOpen && (
        <button
          id="chatbot-toggle-button"
          onClick={() => setIsOpen(true)}
          className="relative group w-14 h-14 bg-gradient-to-tr from-sky-blue to-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-sky-blue/40 transition-all duration-300 transform hover:scale-110 border border-sky-blue/30 cursor-pointer"
          title="Chat with HappyCon-Bot"
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00F0FF]"></span>
          </span>
          <MessageSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          id="chatbot-window"
          className="w-[360px] sm:w-[380px] h-[520px] rounded-2xl overflow-hidden shadow-2xl glass-panel-heavy border border-sky-blue/30 flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0C2E4E] to-[#0A2540] px-4 py-3.5 flex items-center justify-between border-b border-sky-blue/20">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-blue/20 flex items-center justify-center border border-sky-blue/50">
                <Bot className="w-5 h-5 text-neon-blue animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-white tracking-tight">
                  HappyCon-Bot
                </h4>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                  <p className="text-[10px] text-green-400 font-medium">Online &middot; Gig Harbor</p>
                </div>
              </div>
            </div>
            
            <button
              id="chatbot-close-button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Panel */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A2540]/40"
            id="chatbot-messages-container"
          >
            {chatHistory.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] ${
                    isUser ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <p className="text-[10px] text-gray-400 font-mono mb-1 px-1">
                    {isUser ? "You" : "HappyCon-Bot"} &middot; {msg.timestamp}
                  </p>
                  
                  <div
                    className={`px-3 py-2.5 rounded-xl text-xs leading-relaxed ${
                      isUser
                        ? "bg-sky-blue text-white rounded-tr-none shadow-md"
                        : "bg-dark-surface/95 text-gray-100 border border-sky-blue/15 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {/* Render markdown headers or bolding */}
                    {msg.text.split("\n").map((line, lIdx) => (
                      <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                        {line.split("**").map((chunk, cIdx) => (
                          cIdx % 2 === 1 ? <strong key={cIdx} className="text-neon-blue font-semibold">{chunk}</strong> : chunk
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Simulated AI Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start max-w-[85%]">
                <p className="text-[10px] text-gray-400 font-mono mb-1 px-1">HappyCon-Bot is thinking...</p>
                <div className="bg-dark-surface/95 border border-sky-blue/15 px-4 py-3 rounded-xl rounded-tl-none flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-sky-blue animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-sky-blue animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-sky-blue animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Predefined Questions */}
          <div className="px-3 py-2 bg-gradient-to-t from-dark-surface/30 to-[#0A2540]/60 border-t border-sky-blue/10">
            <p className="text-[9px] text-[#00F0FF] uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-neon-blue" />
              <span>Suggested Queries</span>
            </p>
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePredefinedQuestion(q)}
                  className="bg-[#0E2E4E] hover:bg-[#15416D] border border-sky-blue/15 text-[10px] text-gray-300 hover:text-white px-2 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Form Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#0A2540] border-t border-sky-blue/20 flex gap-2"
          >
            <input
              type="text"
              id="chatbot-input-field"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about Go Happy Con..."
              className="flex-1 bg-dark-surface border border-sky-blue/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
            />
            <button
              type="submit"
              id="chatbot-send-button"
              className="bg-sky-blue hover:bg-sky-blue/80 text-white rounded-xl px-3 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
