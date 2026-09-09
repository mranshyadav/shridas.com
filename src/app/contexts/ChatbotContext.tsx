import React, { createContext, useContext, useState, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "vrinda";
  timestamp: Date;
}

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string;
  businessSize?: string;
  isRegistered?: boolean;
  currentChallenge?: string;
  purpose?: string;
  hasBusiness?: boolean;
  requirement?: string;
  conversationStage:
    | "greeting"
    | "collecting_contact"
    | "identifying_purpose"
    | "business_check"
    | "business_details"
    | "qualifying"
    | "qualified"
    | "converted";
  leadTemperature?: "hot" | "warm" | "cold";
}

interface ChatInteraction {
  id: string;
  sessionId: string;
  messages: Message[];
  leadData: LeadData;
  startTime: Date;
  lastActivity: Date;
  status: "active" | "qualified" | "converted" | "abandoned";
}

interface ChatbotContextType {
  interactions: ChatInteraction[];
  addInteraction: (messages: Message[], leadData: LeadData) => void;
  updateInteraction: (sessionId: string, messages: Message[], leadData: LeadData) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [interactions, setInteractions] = useState<ChatInteraction[]>(() => {
    // Load from localStorage. Guarded because this initializer runs during
    // render, including the build-time prerender. Testing `localStorage`
    // itself is not enough: Node defines the global and throws on access, so
    // the check is for a browser, and the read is wrapped as well.
    if (typeof window === "undefined") return [];

    let stored: string | null = null;
    try {
      stored = localStorage.getItem("chatbot_interactions");
    } catch {
      return [];
    }

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((interaction: any) => ({
          ...interaction,
          startTime: new Date(interaction.startTime),
          lastActivity: new Date(interaction.lastActivity),
          messages: interaction.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      } catch (e) {
        console.error("Failed to parse chatbot interactions", e);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever interactions change
  useEffect(() => {
    localStorage.setItem("chatbot_interactions", JSON.stringify(interactions));
  }, [interactions]);

  const determineStatus = (
    leadData: LeadData,
    messages: Message[]
  ): "active" | "qualified" | "converted" | "abandoned" => {
    if (leadData.conversationStage === "converted") {
      return "converted";
    }
    if (leadData.conversationStage === "qualified") {
      return "qualified";
    }
    if (messages.length <= 2) {
      return "abandoned";
    }
    return "active";
  };

  const addInteraction = (messages: Message[], leadData: LeadData) => {
    const sessionId = `session-${Date.now()}`;
    const now = new Date();

    const newInteraction: ChatInteraction = {
      id: Date.now().toString(),
      sessionId,
      messages,
      leadData,
      startTime: messages[0]?.timestamp || now,
      lastActivity: now,
      status: determineStatus(leadData, messages),
    };

    setInteractions((prev) => [newInteraction, ...prev]);
  };

  const updateInteraction = (
    sessionId: string,
    messages: Message[],
    leadData: LeadData
  ) => {
    setInteractions((prev) =>
      prev.map((interaction) =>
        interaction.sessionId === sessionId
          ? {
              ...interaction,
              messages,
              leadData,
              lastActivity: new Date(),
              status: determineStatus(leadData, messages),
            }
          : interaction
      )
    );
  };

  return (
    <ChatbotContext.Provider
      value={{
        interactions,
        addInteraction,
        updateInteraction,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}