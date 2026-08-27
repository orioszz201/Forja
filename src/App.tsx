import { useCallback, useState } from "react";
import Discovery, { BuildScreen } from "./components/Discovery";
import Storefront from "./components/Storefront";
import type { AppConfig } from "./lib/types";

const STORAGE_KEY = "forja-config-v1";

function loadConfig(): AppConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as AppConfig;
    if (!c.archetypeId || !c.businessName) return null;
    return c;
  } catch {
    return null;
  }
}

type Phase = "discover" | "building" | "store";

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(() => loadConfig());
  const [phase, setPhase] = useState<Phase>(() => (loadConfig() ? "store" : "discover"));

  const launch = useCallback((c: AppConfig) => {
    setConfig(c);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {
      /* noop */
    }
    setPhase("building");
  }, []);

  const done = useCallback(() => setPhase("store"), []);
  const edit = useCallback(() => setPhase("discover"), []);

  if (phase === "building" && config) {
    return <BuildScreen name={config.businessName} onDone={done} />;
  }
  if (phase === "store" && config) {
    return <Storefront key={config.createdAt} config={config} onEdit={edit} />;
  }
  return <Discovery initial={config} onLaunch={launch} />;
}
