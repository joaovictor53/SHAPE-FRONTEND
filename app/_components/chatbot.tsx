"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTED_MESSAGES = ["Monte meu plano de treino"];

export function Chatbot() {
  const [isOpen, setIsOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [initialMsg, setInitialMsg] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/ai",
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSentRef = useRef(false);

  useEffect(() => {
    if (
      isOpen &&
      initialMsg &&
      !initialMessageSentRef.current
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: initialMsg });
      setInitialMsg(null);
    }
  }, [
    isOpen,
    initialMsg,
    sendMessage,
    setInitialMsg,
  ]);

  useEffect(() => {
    if (!isOpen) {
      initialMessageSentRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    setInitialMsg(null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div
      className="fixed inset-0 z-60"
    >
      <div
        className="absolute inset-0 bg-foreground/30"
        onClick={handleClose}
      />

      <div className="absolute inset-x-4 bottom-4 top-40 flex flex-col">
        <div className="flex flex-1 flex-col overflow-hidden rounded-[20px] bg-background">
          <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full bg-primary/8 border border-primary/8 p-3">
                <Sparkles className="size-[18px] text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-heading text-base font-semibold text-foreground">
                  Coach AI
                </span>
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-online" />
                  <span className="font-heading text-xs text-primary">Online</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="size-6 text-foreground" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pb-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "assistant"
                    ? "flex flex-col items-start pl-5 pr-[60px] pt-5"
                    : "flex flex-col items-end pl-[60px] pr-5 pt-5"
                }
              >
                <div
                  className={
                    message.role === "assistant"
                      ? "rounded-xl bg-secondary p-3"
                      : "rounded-xl bg-primary p-3"
                  }
                >
                  {message.role === "assistant" ? (
                    <div className="font-heading text-sm leading-relaxed text-foreground">
                      {message.parts.map((part, index) =>
                        part.type === "text" ? (
                          <Streamdown key={index}>{part.text}</Streamdown>
                        ) : null,
                      )}
                    </div>
                  ) : (
                    <p className="font-heading text-sm leading-relaxed text-primary-foreground">
                      {message.parts
                        .filter((part) => part.type === "text")
                        .map(
                          (part) =>
                            (part as { type: "text"; text: string }).text,
                        )
                        .join("")}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex shrink-0 flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex gap-2.5 overflow-x-auto px-5">
                {SUGGESTED_MESSAGES.map((suggestion) => (
                  <Button
                    key={suggestion}
                    onClick={() => handleSuggestion(suggestion)}
                    variant="secondary"
                    className="whitespace-nowrap rounded-full bg-primary/10 px-4 py-2 font-heading text-sm text-foreground"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}

            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-border p-5"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem"
                className="rounded-full border-border bg-secondary px-4 py-3 font-heading text-sm text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
                className="size-[42px] shrink-0 rounded-full"
              >
                <ArrowUp className="size-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
