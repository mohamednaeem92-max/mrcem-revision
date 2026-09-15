import { useCallback, useEffect, useState } from "react";

type OfflineState = {
  online: boolean;
  offlineReady: boolean;
  installed: boolean;
  canInstall: boolean;
  iosHint: boolean;
  install: () => Promise<void>;
};

function isStandaloneDisplay() {
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function useOfflineApp(): OfflineState {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installed, setInstalled] = useState(() => isStandaloneDisplay());
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.ready.then(() => setOfflineReady(true)).catch(() => undefined);
    }
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
    };
  }, []);

  const install = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    setInstallEvent(null);
  }, [installEvent]);

  return {
    online,
    offlineReady,
    installed,
    canInstall: Boolean(installEvent) && !installed,
    iosHint: isIosDevice() && !installed,
    install,
  };
}
