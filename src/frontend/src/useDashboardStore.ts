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
  level: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
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
    level: "CRITICAL",
    title: "HULL BREACH DETECTED",
    message:
      "Micro-fracture event on deck 7 — section 14-C reporting atmospheric loss. Emergency bulkheads engaged. Repair drones dispatched.",
    timestamp: "04:14:02",
    acknowledged: false,
  },
  {
    id: "a2",
    level: "WARNING",
    title: "GRAVITATIONAL ANOMALY",
    message:
      "CLASS II gravitational distortion at grid 14-C. Drift trajectory calculated. Course correction recommended within 12 minutes.",
    timestamp: "04:12:38",
    acknowledged: false,
  },
  {
    id: "a3",
    level: "WARNING",
    title: "SHIELD EMITTER FAULT",
    message:
      "Emitter #3 flux instability — resonance drift at 0.4% above nominal. Backup emitter online. Monitor for further degradation.",
    timestamp: "04:09:11",
    acknowledged: false,
  },
  {
    id: "a4",
    level: "INFO",
    title: "JUMP DRIVE COOLDOWN",
    message:
      "Jump drive cooldown active. Next available jump window in T-MINUS 00:08:32. Standby mode engaged. All nav systems nominal.",
    timestamp: "04:07:55",
    acknowledged: true,
  },
  {
    id: "a5",
    level: "WARNING",
    title: "SENSOR ARRAY DEGRADED",
    message:
      "Long-range sensor array operating at 73% capacity. Solar interference from ALPHA-7 primary. Estimated restoration: 00:04:10.",
    timestamp: "04:06:30",
    acknowledged: false,
  },
  {
    id: "a6",
    level: "INFO",
    title: "AUTOMATED SCAN COMPLETE",
    message:
      "Scheduled sector sweep finished. 14 nodes catalogued, 2 flagged for follow-up. No hostile contacts detected within range.",
    timestamp: "04:04:19",
    acknowledged: true,
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
