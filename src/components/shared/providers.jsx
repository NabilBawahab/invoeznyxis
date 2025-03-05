"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

export function Providers({ children }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
}
