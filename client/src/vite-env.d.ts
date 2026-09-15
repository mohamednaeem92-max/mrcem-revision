/// <reference types="vite/client" />

declare module "virtual:question-bank" {
  export const inlineQuestionBank: unknown[] | null;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}
