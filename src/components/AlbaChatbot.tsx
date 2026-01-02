import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Calendar, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import albaAvatar from "@/assets/alba-avatar.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/alba-chat`;

const AlbaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato diretamente pelo email leone@albatross.consulting" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleScheduleClick = () => {
    setIsOpen(false);
    const element = document.getElementById("agendamento");
    if (element) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height + 150 : 150;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: "smooth",
      });
    }
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering for bold and links
    const parts = content.split(/(\*\*[^*]+\*\*|\[CTA:AGENDAR\]|\[CTA:EMAIL\])/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part === "[CTA:AGENDAR]") {
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="mt-2 mr-2 gap-2 bg-primary/10 border-primary/30 hover:bg-primary/20"
            onClick={handleScheduleClick}
          >
            <Calendar className="w-4 h-4" />
            Agendar Conversa
          </Button>
        );
      }
      if (part === "[CTA:EMAIL]") {
        return (
          <a
            key={index}
            href="mailto:leone@albatross.consulting"
            className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 text-sm rounded-md bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Enviar Email
          </a>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-0 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
          "bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary/50",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Abrir chat"
      >
        <img 
          src={albaAvatar} 
          alt="Alba - Assistente Virtual" 
          className="w-16 h-16 rounded-full object-cover"
        />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-100px)]",
          "bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50",
          "flex flex-col overflow-hidden transition-all duration-300",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
          <div className="relative">
            <img 
              src={albaAvatar} 
              alt="Alba" 
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Alba</h3>
            <p className="text-xs text-muted-foreground">Assistente Albatross Consulting</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <img 
                src={albaAvatar} 
                alt="Alba" 
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/30"
              />
              <h4 className="font-medium text-foreground mb-2">Olá! Eu sou a Alba 👋</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Assistente virtual da Albatross Consulting. Como posso ajudar você hoje?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Quais serviços vocês oferecem?",
                  "Quero saber sobre M&A",
                  "Quem é Marco Leone?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <img 
                  src={albaAvatar} 
                  alt="Alba" 
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                {message.role === "assistant" 
                  ? renderMessageContent(message.content)
                  : message.content
                }
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-2 justify-start">
              <img 
                src={albaAvatar} 
                alt="Alba" 
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-border/50 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs gap-1.5"
            onClick={handleScheduleClick}
          >
            <Calendar className="w-3.5 h-3.5" />
            Agendar
          </Button>
          <a href="mailto:leone@albatross.consulting" className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email
            </Button>
          </a>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2.5 rounded-full bg-muted border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="rounded-full h-10 w-10"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlbaChatbot;
