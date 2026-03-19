import { create } from "zustand";

export type DashboardTab =
  | "command"
  | "navigation"
  | "weapons"
  | "shields"
  | "scanner"
  | "engineering"
  | "missions"
  | "alerts"
  | "logs";

export interface ShipStatus {
  name: string;
  sector: string;
  threat: "NOMINAL" | "ELEVATED" | "CRITICAL";
  hull: number;
  power: number;
  shields: number;
  speed: number;
}

export interface Alert {
  id: string;
  level: "WARN" | "CRITICAL" | "INFO";
  message: string;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  category: "SYS" | "SCAN" | "COMBAT" | "NAV";
}

interface DashboardStore {
  dashboardOpen: boolean;
  activeDashboardTab: DashboardTab;
  shipStatus: ShipStatus;
  alerts: Alert[];
  logs: LogEntry[];
  openDashboard: (tab?: DashboardTab) => void;
  closeDashboard: () => void;
  setTab: (tab: DashboardTab) => void;
  dismissAlert: (id: string) => void;
  addLog: (msg: string, category?: LogEntry["category"]) => void;
}

const MOCK_SHIP: ShipStatus = {
  name: "ISV PHANTOM WRAITH",
  sector: "ALPHA-7",
  threat: "ELEVATED",
  hull: 78,
  power: 84,
  shields: 61,
  speed: 0.42,
};

const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    level: "WARN",
    message:
      "Anomaly detected at grid 14-C — CLASS II gravitational distortion",
    timestamp: "04:12:38",
  },
  {
    id: "a2",
    level: "WARN",
    message: "Shield emitter #3 flux instability — resonance drift 0.4%",
    timestamp: "04:09:11",
  },
  {
    id: "a3",
    level: "INFO",
    message: "Jump drive cooldown active — T-MINUS 00:08:32 to window",
    timestamp: "04:07:55",
  },
];

const MOCK_LOGS: LogEntry[] = [
  {
    id: "l1",
    timestamp: "04:12:44",
    message: "Node NEXUS-7 locked — signal acquired",
    category: "SCAN",
  },
  {
    id: "l2",
    timestamp: "04:11:22",
    message: "Scan sweep complete — 14 nodes catalogued",
    category: "SCAN",
  },
  {
    id: "l3",
    timestamp: "04:09:18",
    message: "Shield emitter fault logged — monitoring",
    category: "SYS",
  },
  {
    id: "l4",
    timestamp: "04:07:01",
    message: "Jump drive charge initiated",
    category: "NAV",
  },
  {
    id: "l5",
    timestamp: "04:03:55",
    message: "Sector ALPHA-7 entered — threat ELEVATED",
    category: "NAV",
  },
  {
    id: "l6",
    timestamp: "04:00:00",
    message: "System boot complete — all subsystems nominal",
    category: "SYS",
  },
];

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardOpen: false,
  activeDashboardTab: "command",
  shipStatus: MOCK_SHIP,
  alerts: MOCK_ALERTS,
  logs: MOCK_LOGS,

  openDashboard: (tab) =>
    set((s) => ({
      dashboardOpen: true,
      activeDashboardTab: tab ?? s.activeDashboardTab,
    })),

  closeDashboard: () => set({ dashboardOpen: false }),

  setTab: (tab) => set({ activeDashboardTab: tab }),

  dismissAlert: (id) =>
    set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),

  addLog: (msg, category = "SYS") =>
    set((s) => ({
      logs: [
        {
          id: `l${Date.now()}`,
          timestamp: new Date().toTimeString().slice(0, 8),
          message: msg,
          category,
        },
        ...s.logs,
      ].slice(0, 50),
    })),
}));
