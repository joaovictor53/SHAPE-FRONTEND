"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, X, Bot, User, Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";

export function Chatbot() {
  const [isOpen, setIsOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false)
  );
  const [initialMsg, setInitialMsg] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault("")
  );

  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/ai",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMsgSent = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && initialMsg && !initialMsgSent.current) {
      initialMsgSent.current = true;
      sendMessage({ text: initialMsg });
      setInitialMsg(null);
    }

    if (!isOpen) {
      initialMsgSent.current = false;
    }
  }, [isOpen, initialMsg, sendMessage, setInitialMsg]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-background animate-in slide-in-from-bottom-full duration-300">
      <div className="flex items-center justify-between border-b border-border bg-background px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-semibold text-foreground">
              Fit.ai Assistant
            </span>
            <span className="text-xs text-muted-foreground">
              {isLoading ? "Digitando..." : "Online"}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-muted-foreground"
          onClick={() => setIsOpen(false)}
        >
          <X className="size-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <div className="flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 mt-20">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="size-8 text-primary" />
              </div>
              <p
                className="text-center text-sm text-muted-foreground"
                style={{ maxWidth: "280px" }}
              >
                Olá! Sou seu treinador virtual. Como posso te ajudar hoje?
              </p>
              <div className="mt-4 flex w-full flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-muted-foreground h-auto p-3"
                  onClick={() =>
                    sendMessage({ text: "Monte meu plano de treino" })
                  }
                >
                  Monte meu plano de treino
                </Button>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.role === "user" ? (
                    <User className="size-4 shrink-0" />
                  ) : (
                    <Bot className="size-4 shrink-0" />
                  )}
                </div>
                <div
                  className={`flex max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none"
                  }`}
                >
                  {m.role === "user" ? (
                    <div>{m.content}</div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert wrap-break-word">
                      <Streamdown content={m.content} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {status === "submitted" && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bot className="size-4 shrink-0" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-muted px-4 py-3 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Pensando...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 p-4 backdrop-blur-md">
        <form
          className="relative flex items-center rounded-full border border-border bg-background px-4 py-2"
          onSubmit={handleSubmit}
        >
          <input
            className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="size-8 rounded-full bg-primary"
          >
            <Send className="size-4 text-primary-foreground" />
          </Button>
        </form>
      </div>
    </div>
  );
}
