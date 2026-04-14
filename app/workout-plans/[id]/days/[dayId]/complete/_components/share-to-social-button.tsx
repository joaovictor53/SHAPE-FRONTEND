"use client";

import { useTransition } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareToSocialButton({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleShare() {
    startTransition(async () => {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(`${text}\n${url}`);
    });
  }

  return (
    <Button
      onClick={handleShare}
      disabled={isPending}
      className="h-14 w-full rounded-full bg-background text-foreground shadow-sm hover:bg-background/90"
    >
      <Share2 className="size-4" />
      Compartilhar
    </Button>
  );
}

