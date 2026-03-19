/**
 * useAlertsStore — Full alert resolution system
 * Persisted: tci_alerts_v1
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCreditsStore } from "../credits/useCreditsStore";
import { useStoryStore } from "../story/useStoryStore";
import { useTacticalLogStore } from "../tacticalLog/useTacticalLogStore";

export type AlertSeverity = "normal" | "critical";
export type AlertStatus = "active" | "resolved" | "failed" | "dismissed";

export interface AlertResponse {
  id: string;
  label: string;
  creditCost: number;
  consequence: string;
  systemEffects: {
    oxygen?: number;
    hull?: number;
    power?: number;
    credits?: number;
  };
  successMessage: string;
}

export interface ActiveAlert {
  id: string;
  type: string;
  title: string;
  affectedSystem: string;
  severity: AlertSeverity;
  description: string;
  durationMs: number;
  startedAt: number;
  status: AlertStatus;
  responses: AlertResponse[];
  resolvedWith?: string;
  creditsReward: number;
}

export interface AlertTemplate {
  type: string;
  title: string;
  affectedSystem: string;
  severity: AlertSeverity;
  description: string;
  durationMs: number;
  creditsReward: number;
  responses: AlertResponse[];
}

export const ALERT_TEMPLATES: AlertTemplate[] = [
  {
    type: "oxygen_leak",
    title: "OXYGEN LEAK DETECTED",
    affectedSystem: "Life Support",
    severity: "critical",
    description:
      "Hull micro-fracture venting breathable atmosphere. Immediate action required.",
    durationMs: 90000,
    creditsReward: 150,
    responses: [
      {
        id: "seal_free",
        label: "Emergency Seal",
        creditCost: 0,
        consequence: "Leak partially sealed. Oxygen stabilizing.",
        systemEffects: { oxygen: 15 },
        successMessage: "Emergency seal applied. Oxygen levels recovering.",
      },
      {
        id: "reroute_50",
        label: "Reroute Life Support",
        creditCost: 50,
        consequence: "Full reroute. Oxygen restored, power cost.",
        systemEffects: { oxygen: 30, power: -10 },
        successMessage: "Life support rerouted. Full recovery initiated.",
      },
      {
        id: "ignore",
        label: "Ignore",
        creditCost: 0,
        consequence: "Oxygen continues venting. Critical risk.",
        systemEffects: { oxygen: -20 },
        successMessage: "Alert dismissed. Oxygen continues to drop.",
      },
    ],
  },
  {
    type: "recycler_malfunction",
    title: "RECYCLER MALFUNCTION",
    affectedSystem: "Life Support",
    severity: "normal",
    description:
      "Atmospheric recycler efficiency at 12%. CO2 scrubbing compromised.",
    durationMs: 120000,
    creditsReward: 100,
    responses: [
      {
        id: "manual_repair",
        label: "Manual Repair",
        creditCost: 0,
        consequence: "Recycler patched. Oxygen slowly recovering.",
        systemEffects: { oxygen: 20 },
        successMessage: "Manual repair complete. Recycler nominal.",
      },
      {
        id: "spend_credits_80",
        label: "Full Rebuild (80 CR)",
        creditCost: 80,
        consequence: "Recycler fully rebuilt. Optimal performance.",
        systemEffects: { oxygen: 35 },
        successMessage:
          "Recycler rebuilt. Atmospheric processing at full capacity.",
      },
      {
        id: "bypass",
        label: "Bypass System",
        creditCost: 0,
        consequence: "Recycler bypassed. Minor oxygen loss, power boost.",
        systemEffects: { oxygen: -5, power: 10 },
        successMessage: "Recycler bypassed. Power rerouted.",
      },
    ],
  },
  {
    type: "shield_overload",
    title: "SHIELD OVERLOAD",
    affectedSystem: "Shields",
    severity: "critical",
    description:
      "Shield matrix drawing 340% rated capacity. Overload imminent.",
    durationMs: 60000,
    creditsReward: 200,
    responses: [
      {
        id: "vent_power",
        label: "Vent Excess Power",
        creditCost: 0,
        consequence: "Overpressure vented. Minor hull stress.",
        systemEffects: { hull: -5, power: -15 },
        successMessage: "Power vented safely. Shield matrix stable.",
      },
      {
        id: "emergency_shutdown",
        label: "Emergency Shutdown (100 CR)",
        creditCost: 100,
        consequence: "Controlled shutdown. Hull protected.",
        systemEffects: { hull: 10 },
        successMessage: "Emergency shutdown executed. Hull integrity restored.",
      },
      {
        id: "let_burn",
        label: "Let It Burn",
        creditCost: 0,
        consequence: "Shield detonates. Major hull damage.",
        systemEffects: { hull: -20 },
        successMessage: "Shield overloaded. Hull damage sustained.",
      },
    ],
  },
  {
    type: "radar_outage",
    title: "RADAR SYSTEM OUTAGE",
    affectedSystem: "Sensors",
    severity: "normal",
    description: "Primary sensor array offline. Threat detection compromised.",
    durationMs: 150000,
    creditsReward: 75,
    responses: [
      {
        id: "reboot",
        label: "Reboot Sensors",
        creditCost: 0,
        consequence: "Sensors rebooting. Minor power draw.",
        systemEffects: { power: -5 },
        successMessage: "Sensor array rebooted. Threat detection restored.",
      },
      {
        id: "reroute_power_60",
        label: "Reroute Power (60 CR)",
        creditCost: 60,
        consequence: "Power rerouted. Sensors at full sensitivity.",
        systemEffects: { power: -20 },
        successMessage: "Power rerouted. Full sensor capability restored.",
      },
      {
        id: "backup",
        label: "Run on Backup",
        creditCost: 0,
        consequence: "Backup sensors online. Reduced capability.",
        systemEffects: {},
        successMessage: "Backup radar active. Limited detection range.",
      },
    ],
  },
  {
    type: "power_conduit",
    title: "POWER CONDUIT INSTABILITY",
    affectedSystem: "Engineering",
    severity: "normal",
    description:
      "Conduit 7-C showing plasma arc discharges. Power fluctuating.",
    durationMs: 180000,
    creditsReward: 50,
    responses: [
      {
        id: "stabilize",
        label: "Stabilize Conduit",
        creditCost: 0,
        consequence: "Conduit stabilized. Power output steady.",
        systemEffects: { power: 10 },
        successMessage: "Conduit 7-C stabilized. Power grid nominal.",
      },
      {
        id: "replace_120",
        label: "Replace Conduit (120 CR)",
        creditCost: 120,
        consequence: "New conduit installed. Maximum power output.",
        systemEffects: { power: 25 },
        successMessage: "Conduit replaced. Power output at maximum.",
      },
    ],
  },
  {
    type: "anomaly_contamination",
    title: "ANOMALY CONTAMINATION",
    affectedSystem: "Hull Sensors",
    severity: "critical",
    description:
      "Unknown energy signature corrupting hull sensor array. Source: unknown.",
    durationMs: 75000,
    creditsReward: 250,
    responses: [
      {
        id: "purge",
        label: "Purge Systems",
        creditCost: 0,
        consequence: "Purge complete. Minor collateral damage.",
        systemEffects: { hull: -10, oxygen: -5 },
        successMessage: "System purge complete. Anomaly cleared.",
      },
      {
        id: "deep_scan_150",
        label: "Deep Scan Protocol (150 CR)",
        creditCost: 150,
        consequence: "Anomaly analyzed and neutralized. Hull improved.",
        systemEffects: { hull: 5 },
        successMessage:
          "Deep scan complete. Anomaly neutralized. Data recorded.",
      },
    ],
  },
];

interface AlertsStoreState {
  alerts: ActiveAlert[];
  triggerAlert: (templateType: string) => void;
  resolveAlert: (alertId: string, responseId: string) => void;
  dismissAlert: (alertId: string) => void;
  tickAlerts: () => void;
  getActiveAlerts: () => ActiveAlert[];
  getCriticalAlerts: () => ActiveAlert[];
}

export const useAlertsStore = create<AlertsStoreState>()(
  persist(
    (set, get) => ({
      alerts: [],

      triggerAlert: (templateType) => {
        const template = ALERT_TEMPLATES.find((t) => t.type === templateType);
        if (!template) return;
        // Don't duplicate active alerts of same type
        const existing = get().alerts.find(
          (a) => a.type === templateType && a.status === "active",
        );
        if (existing) return;

        const alert: ActiveAlert = {
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: template.type,
          title: template.title,
          affectedSystem: template.affectedSystem,
          severity: template.severity,
          description: template.description,
          durationMs: template.durationMs,
          startedAt: Date.now(),
          status: "active",
          responses: template.responses,
          creditsReward: template.creditsReward,
        };

        set((s) => ({ alerts: [alert, ...s.alerts] }));

        useTacticalLogStore.getState().addEntry({
          type: "alert",
          message: `⚠ ${template.severity === "critical" ? "[CRITICAL] " : ""}${template.title} — ${template.affectedSystem}`,
        });
      },

      resolveAlert: (alertId, responseId) => {
        const alert = get().alerts.find((a) => a.id === alertId);
        if (!alert || alert.status !== "active") return;

        const response = alert.responses.find((r) => r.id === responseId);
        if (!response) return;

        // Handle credit cost
        if (response.creditCost > 0) {
          const ok = useCreditsStore
            .getState()
            .spend(response.creditCost, `Alert: ${alert.title}`);
          if (!ok) return; // insufficient credits
        }

        // Apply system effects
        const fx = response.systemEffects;
        const story = useStoryStore.getState();
        const nextOxygen = Math.max(
          0,
          Math.min(100, story.oxygenLevel + (fx.oxygen ?? 0)),
        );
        const nextHull = Math.max(
          0,
          Math.min(100, story.hullIntegrity + (fx.hull ?? 0)),
        );
        const nextPower = Math.max(
          0,
          Math.min(100, story.powerLevel + (fx.power ?? 0)),
        );
        useStoryStore.setState({
          oxygenLevel: nextOxygen,
          hullIntegrity: nextHull,
          powerLevel: nextPower,
        });

        // Award credits reward
        useCreditsStore
          .getState()
          .earn(alert.creditsReward, `Alert Resolved: ${alert.title}`);

        // Update alert status
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === alertId
              ? {
                  ...a,
                  status: "resolved" as AlertStatus,
                  resolvedWith: responseId,
                }
              : a,
          ),
        }));

        useTacticalLogStore.getState().addEntry({
          type: "repair",
          message: `✓ ALERT RESOLVED: ${alert.title} — ${response.successMessage}`,
        });
      },

      dismissAlert: (alertId) => {
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === alertId ? { ...a, status: "dismissed" as AlertStatus } : a,
          ),
        }));
      },

      tickAlerts: () => {
        const now = Date.now();
        let anyFailed = false;
        const updated = get().alerts.map((a) => {
          if (a.status !== "active") return a;
          if (now - a.startedAt > a.durationMs) {
            anyFailed = true;
            // Apply negative consequence for life support failures
            if (
              a.affectedSystem === "Life Support" ||
              a.type === "oxygen_leak" ||
              a.type === "recycler_malfunction"
            ) {
              const story = useStoryStore.getState();
              useStoryStore.setState({
                oxygenLevel: Math.max(0, story.oxygenLevel - 10),
              });
            }
            useTacticalLogStore.getState().addEntry({
              type: "alert",
              message: `✗ ALERT FAILED: ${a.title} — Consequences applied.`,
            });
            return { ...a, status: "failed" as AlertStatus };
          }
          return a;
        });
        if (anyFailed) set({ alerts: updated });
      },

      getActiveAlerts: () => get().alerts.filter((a) => a.status === "active"),

      getCriticalAlerts: () =>
        get().alerts.filter(
          (a) => a.severity === "critical" && a.status === "active",
        ),
    }),
    {
      name: "tci_alerts_v1",
      partialize: (s) => ({ alerts: s.alerts }),
    },
  ),
);
