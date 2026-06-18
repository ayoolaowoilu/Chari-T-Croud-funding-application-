"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  ArrowUpRight,
  Sparkles,
  PlusCircle,
  Heart,
  Wallet,
  Shield,
  HelpCircle,
  Landmark,
  Copy,
  Check
} from "lucide-react";

// --- Female Avatar SVG Component ---
function LauraAvatar({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow backdrop */}
      <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" opacity="0.3" />
      
      {/* Face circle */}
      <circle cx="50" cy="50" r="40" fill="#F8D7C8" />
      
      {/* Hair back */}
      <path
        d="M15 45C15 25 30 10 50 10C70 10 85 25 85 45C85 55 82 62 78 68L75 72C75 72 70 55 50 55C30 55 25 72 25 72L22 68C18 62 15 55 15 45Z"
        fill="#2D1B0E"
      />
      
      {/* Hair front/bangs */}
      <path
        d="M25 35C25 35 30 20 50 20C70 20 75 35 75 35C75 35 70 28 50 28C30 28 25 35 25 35Z"
        fill="#2D1B0E"
      />
      
      {/* Eyes */}
      <ellipse cx="38" cy="48" rx="4" ry="5" fill="#1A1A1A" />
      <ellipse cx="62" cy="48" rx="4" ry="5" fill="#1A1A1A" />
      
      {/* Eye highlights */}
      <circle cx="39.5" cy="46.5" r="1.5" fill="white" />
      <circle cx="63.5" cy="46.5" r="1.5" fill="white" />
      
      {/* Eyebrows */}
      <path d="M32 40Q38 37 44 40" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M56 40Q62 37 68 40" stroke="#2D1B0E" strokeWidth="2" strokeLinecap="round" fill="none" />
      
      {/* Nose */}
      <path d="M50 52L48 58H52L50 52Z" fill="#E8B8A0" />
      
      {/* Smile */}
      <path
        d="M40 64Q50 72 60 64"
        stroke="#C4785A"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Blush */}
      <ellipse cx="30" cy="58" rx="5" ry="3" fill="#E8A090" opacity="0.4" />
      <ellipse cx="70" cy="58" rx="5" ry="3" fill="#E8A090" opacity="0.4" />
      
      {/* Headset */}
      <path
        d="M12 45C12 30 25 18 50 18C75 18 88 30 88 45"
        stroke="#2563EB"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="8" y="38" width="8" height="14" rx="4" fill="#2563EB" />
      <rect x="84" y="38" width="8" height="14" rx="4" fill="#2563EB" />
      
      {/* Mic */}
      <path
        d="M84 52L80 62H76"
        stroke="#2563EB"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="76" cy="62" r="2.5" fill="#2563EB" />
      
      {/* Gradients */}
      <defs>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// --- Small Avatar for Chat Header ---
function LauraAvatarSmall({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <circle cx="50" cy="50" r="40" fill="#F8D7C8" />
      <path d="M15 45C15 25 30 10 50 10C70 10 85 25 85 45C85 55 82 62 78 68L75 72C75 72 70 55 50 55C30 55 25 72 25 72L22 68C18 62 15 55 15 45Z" fill="#2D1B0E" />
      <path d="M25 35C25 35 30 20 50 20C70 20 75 35 75 35C75 35 70 28 50 28C30 28 25 35 25 35Z" fill="#2D1B0E" />
      <ellipse cx="38" cy="48" rx="4" ry="5" fill="#1A1A1A" />
      <ellipse cx="62" cy="48" rx="4" ry="5" fill="#1A1A1A" />
      <circle cx="39.5" cy="46.5" r="1.5" fill="white" />
      <circle cx="63.5" cy="46.5" r="1.5" fill="white" />
      <path d="M40 64Q50 72 60 64" stroke="#C4785A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="30" cy="58" rx="5" ry="3" fill="#E8A090" opacity="0.4" />
      <ellipse cx="70" cy="58" rx="5" ry="3" fill="#E8A090" opacity="0.4" />
      <path d="M12 45C12 30 25 18 50 18C75 18 88 30 88 45" stroke="#2563EB" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="8" y="38" width="8" height="14" rx="4" fill="#2563EB" />
      <rect x="84" y="38" width="8" height="14" rx="4" fill="#2563EB" />
    </svg>
  );
}

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  steps?: string[];
  links?: { label: string; href: string }[];
  timestamp: Date;
}

const quickActions = [
  { icon: PlusCircle, label: "Start a Cause", href: "/causes/create" },
  { icon: Heart, label: "Donate", href: "/causes" },
  { icon: Wallet, label: "My Donations", href: "/dashboard/donor?goto=donations" },
  { icon: Shield, label: "Verify Account", href: "/dashboard/kyc" },
  { icon: Landmark, label: "Add Bank", href: "/dashboard/donor?goto=profile" },
  { icon: HelpCircle, label: "How it Works", href: "/docs/how-it-works" },
];

const knowledgeBase = [
  {
    keywords: ["start", "create", "cause", "campaign", "fundraise", "begin"],
    response: "Starting a cause on Chari-T is simple and fully verified for trust.",
    steps: [
      "Click the '+' button or navigate to 'Start a Cause'",
      "Login or create your account",
      "Complete Bank Verification (BVN + bank details)",
      "Complete KYC Verification (NIN, voter's card, or passport)",
      "Submit your cause with images, story, and goal amount",
      "Wait for approval (usually within 24 hours)"
    ],
    links: [
      { label: "Start a Cause", href: "/causes/create" },
      { label: "View Requirements", href: "/docs/requirements" }
    ]
  },
  {
    keywords: ["donate", "give", "contribution", "support", "help", "send money"],
    response: "Donating on Chari-T is secure, transparent, and 100% fee-free.",
    steps: [
      "Browse causes by category or search",
      "Select a cause and review its details & safety rating",
      "Click 'Donate Now' and enter your amount",
      "Choose payment method (card, bank transfer, or wallet)",
      "Receive instant confirmation and tracking"
    ],
    links: [
      { label: "Browse Causes", href: "/causes" },
      { label: "How Donations Work", href: "/docs/donations" }
    ]
  },
  {
    keywords: ["kyc", "verify", "verification", "bvn", "nin", "identity", "document"],
    response: "Verification ensures trust and safety for all users on the platform.",
    steps: [
      "Go to your Dashboard → Profile",
      "Click 'Verify Identity'",
      "Upload a valid government ID (NIN, voter's card, or passport)",
      "Provide your BVN for bank verification",
      "Wait for automated review (usually instant to 2 hours)"
    ],
    links: [
      { label: "Start Verification", href: "/dashboard/kyc" },
      { label: "Why We Verify", href: "/docs/verification" }
    ]
  },
  {
    keywords: ["bank", "account", "payout", "withdraw", "payment", "receive"],
    response: "Linking your bank account enables withdrawals and verified payouts.",
    steps: [
      "Navigate to Dashboard → Profile → Bank Details",
      "Click 'Add Bank Details'",
      "Select your bank from the dropdown",
      "Enter your account number (we auto-verify the name)",
      "Save — you're ready to receive donations"
    ],
    links: [
      { label: "Add Bank", href: "/dashboard/donor?goto=profile" },
      { label: "Payout Schedule", href: "/docs/payouts" }
    ]
  },
  {
    keywords: ["fee", "charge", "cost", "platform", "percentage", "deduct", "tip"],
    response: "Chari-T charges ZERO fees on donations. 100% goes to the cause.",
    steps: [
      "We do not deduct any percentage from your donation",
      "Optional tips at checkout help us run the platform",
      "Tips are entirely voluntary — skip them if you prefer",
      "Payment processors may charge standard card fees"
    ],
    links: [
      { label: "Our Fee Policy", href: "/docs/fees" },
      { label: "How We're Funded", href: "/docs/transparency" }
    ]
  },
  {
    keywords: ["safety", "scam", "fraud", "trust", "report", "fake", "verify cause"],
    response: "Every cause is rated for safety. We use AI + human review to protect donors.",
    steps: [
      "Check the safety badge on each cause (Verified, Likely Safe, Uncertain, Risky)",
      "Read the story, view images, and check donor history",
      "Report suspicious causes using the flag button",
      "Verified centers display a blue checkmark"
    ],
    links: [
      { label: "Safety Ratings", href: "/docs/safety-ratings" },
      { label: "Report a Cause", href: "/docs/reporting" }
    ]
  },
  {
    keywords: ["contact", "support", "help", "email", "phone", "reach", "talk"],
    response: "Our support team is here to help you 24/7.",
    steps: [
      "Email: support@chari-t.org",
      "Live chat: Available in your dashboard",
      "Response time: Usually under 2 hours"
    ],
    links: [
      { label: "Contact Support", href: "/contact" },
      { label: "Help Center", href: "/docs" }
    ]
  }
];

function findBestResponse(input: string): { response: string; steps?: string[]; links?: { label: string; href: string }[] } | null {
  const lower = input.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  for (const item of knowledgeBase) {
    const score = item.keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    if (score > maxScore && score > 0) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch) {
    return {
      response: bestMatch.response,
      steps: bestMatch.steps,
      links: bestMatch.links
    };
  }

  if (lower.length > 3) {
    return {
      response: "I'm not sure I understand. Here are some things I can help with:",
      links: [
        { label: "Start a Cause", href: "/causes/create" },
        { label: "How to Donate", href: "/docs/donations" },
        { label: "Verification Guide", href: "/docs/verification" },
        { label: "Contact Support", href: "/contact" }
      ]
    };
  }

  return null;
}

export default function Laura() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hi! I'm Laura, your Chari-T assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show "Ask Laura" tag after 3 seconds, hide after first open
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) setHasOpened(false); // trigger entrance animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasOpened]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const result = findBestResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: result?.response || "I'm here to help! Try asking about starting a cause, donating, verification, or fees.",
        steps: result?.steps,
        links: result?.links,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleSend(`Take me to ${action.label}`);
  };

  return (
    <>
      {/* Floating Button + Tag Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
        
        {/* "Ask Laura" Tag — appears after delay */}
        <AnimatePresence>
          {!isOpen && !hasOpened && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ delay: 2, duration: 0.4, type: "spring" }}
              className="flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-2xl px-4 py-2.5 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setIsOpen(true)}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-sm font-semibold text-gray-800">Ask Laura</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button with Glow */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative group"
            >
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl animate-pulse" />
              <div className="absolute -inset-1 rounded-full bg-blue-400/20 blur-lg animate-pulse delay-75" />
              
              {/* Button */}
              <div className="relative w-16 h-16 bg-white rounded-full shadow-xl border-2 border-blue-100 flex items-center justify-center overflow-hidden hover:border-blue-300 transition-colors">
                <LauraAvatar className="w-12 h-12" />
                
                {/* Online dot */}
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <LauraAvatarSmall className="w-9 h-9" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-gray-900 rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Laura</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    AI Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.type === "bot" ? "bg-blue-100" : "bg-gray-200"}`}>
                    {msg.type === "bot" ? (
                      <LauraAvatarSmall className="w-6 h-6" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`max-w-[80%] space-y-2 ${msg.type === "user" ? "items-end" : "items-start"}`}>
                    <div className={`relative p-3 rounded-2xl text-sm leading-relaxed ${msg.type === "bot" ? "bg-white border border-gray-200 text-gray-800 rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm"}`}>
                      <p>{msg.content}</p>
                      {msg.type === "bot" && (
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="absolute -right-1 -top-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity shadow-sm"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>

                    {msg.steps && msg.steps.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Steps</p>
                        {msg.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.links && msg.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.href}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors"
                          >
                            {link.label}
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-gray-400 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <LauraAvatarSmall className="w-6 h-6" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3">
                    <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-gray-300 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-2 h-2 bg-gray-300 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Actions</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap transition-colors"
                    >
                      <action.icon className="w-3.5 h-3.5" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-200 shrink-0">
              <div className="flex items-center gap-2 text-black">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Laura is an AI assistant. For urgent issues, <a href="/contact" className="text-blue-600 hover:underline">contact support</a>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}