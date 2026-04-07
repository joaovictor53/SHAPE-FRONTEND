"use client";

import { useEffect } from "react";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export function ChatAutoOpen() {
  const [, setIsOpen] = useQueryState("chat_open", parseAsBoolean.withDefault(false));
  const [, setInitialMsg] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

  useEffect(() => {
    setIsOpen(true);
    setInitialMsg("Monte meu plano de treino");
  }, [setIsOpen, setInitialMsg]);

  return null;
}
