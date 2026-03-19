import { useState } from "react";

interface UpgradeCard {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  cost: number;
  currency: "credits" | "cores";
  unlocked: boolean;
  installed: boolean;
  statChange: string;
  description: string;
  iconCol: number;
  iconRow: number;
}

const UPGRADES: UpgradeCard[] = [
  {
    id: "shield-gen",
    name: "SHIELD GENERATOR",
    tier: 2,
    cost: 1200,
    currency: "credits",
    unlocked: true,
    installed: false,
    statChange: "+15% SHIELD REGEN",
    description: "Enhances regeneration rate of energy shields.",
    iconCol: 0,
    iconRow: 0,
  },
  {
    id: "engine-boost",
    name: "ENGINE BOOST",
    tier: 1,
    cost: 800,
    currency: "credits",
    unlocked: true,
    installed: true,
    statChange: "+20% DRIVE SPEED",
    description: "Overclocked drive system for rapid repositioning.",
    iconCol: 1,
    iconRow: 0,
  },
  {
    id: "targeting",
    name: "TARGETING ARRAY",
    tier: 3,
    cost: 2400,
    currency: "cores",
    unlocked: false,
    installed: false,
    statChange: "+30% LOCK SPEED",
    description: "Advanced multi-target acquisition system.",
    iconCol: 2,
    iconRow: 0,
  },
  {
    id: "armor",
    name: "ARMOR PLATING",
    tier: 1,
    cost: 600,
    currency: "credits",
    unlocked: true,
    installed: true,
    statChange: "+25% HULL RESIST",
    description: "Reinforced composite hull panels.",
    iconCol: 0,
    iconRow: 1,
  },
  {
    id: "reactor",
    name: "QUANTUM REACTOR",
    tier: 3,
    cost: 3200,
    currency: "cores",
    unlocked: false,
    installed: false,
    statChange: "+40% POWER OUTPUT",
    description: "Quantum-threaded power core for maximum yield.",
    iconCol: 1,
    iconRow: 1,
  },
  {
    id: "stealth",
    name: "STEALTH MODULE",
    tier: 2,
    cost: 1800,
    currency: "credits",
    unlocked: false,
    installed: false,
    statChange: "-60% RADAR SIG",
    description: "Low-emission hull coating for reduced detection.",
    iconCol: 2,
    iconRow: 1,
  },
];

const TIER_COLORS: Record<number, string> = {
  1: "#00ff80",
  2: "#00c8ff",
  3: "#ff9900",
};

export default function UpgradesPanel() {
  const [installed, setInstalled] = useState<Set<string>>(
    new Set(UPGRADES.filter((u) => u.installed).map((u) => u.id)),
  );

  const handleInstall = (id: string) => {
    setInstalled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      style={{
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch" as unknown as undefined,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,200,255,0.1)",
          paddingBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.18em",
            color: "rgba(0,200,255,0.7)",
            fontWeight: 700,
          }}
        >
          UPGRADES & MODULES
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: "#00c8ff",
              letterSpacing: "0.1em",
            }}
          >
            ◈ 4,200
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: "#ff9900",
              letterSpacing: "0.1em",
            }}
          >
            ⬡ 12 CORES
          </span>
        </div>
      </div>

      {/* Cards */}
      {UPGRADES.map((upgrade) => {
        const isInstalled = installed.has(upgrade.id);
        const tierColor = TIER_COLORS[upgrade.tier] ?? "#00c8ff";
        const bgX = upgrade.iconCol * 100;
        const bgY = upgrade.iconRow * 100;

        return (
          <div
            key={upgrade.id}
            style={{
              background: isInstalled
                ? "rgba(0,30,20,0.6)"
                : upgrade.unlocked
                  ? "rgba(0,8,22,0.8)"
                  : "rgba(0,5,15,0.7)",
              border: `1px solid ${
                isInstalled
                  ? "rgba(0,255,128,0.25)"
                  : upgrade.unlocked
                    ? "rgba(0,200,255,0.15)"
                    : "rgba(0,80,100,0.2)"
              }`,
              borderRadius: 6,
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              opacity: upgrade.unlocked ? 1 : 0.65,
            }}
          >
            {/* Top row: icon + name + tier + stat */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  backgroundImage:
                    "url('/assets/generated/upgrade-icons-sheet.dim_480x320.png')",
                  backgroundSize: "300% 200%",
                  backgroundPosition: `${bgX}% ${bgY}%`,
                  backgroundRepeat: "no-repeat",
                  flexShrink: 0,
                  opacity: upgrade.unlocked ? 1 : 0.4,
                  borderRadius: 3,
                  border: `1px solid ${tierColor}22`,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: upgrade.unlocked
                        ? "rgba(0,220,255,0.9)"
                        : "rgba(0,120,150,0.7)",
                    }}
                  >
                    {upgrade.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 7,
                      fontWeight: 700,
                      color: tierColor,
                      background: `${tierColor}18`,
                      border: `1px solid ${tierColor}44`,
                      borderRadius: 2,
                      padding: "1px 4px",
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                    }}
                  >
                    T{upgrade.tier}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 8,
                    color: "#00ff80",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                  }}
                >
                  {upgrade.statChange}
                </span>
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: "rgba(0,180,220,0.45)",
                letterSpacing: "0.06em",
                lineHeight: 1.4,
              }}
            >
              {upgrade.description}
            </div>

            {/* Bottom row: cost + action button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 8,
                  color:
                    upgrade.currency === "credits"
                      ? "rgba(0,200,255,0.6)"
                      : "rgba(255,153,0,0.7)",
                  letterSpacing: "0.1em",
                }}
              >
                {!upgrade.unlocked && "🔒 "}
                {upgrade.cost.toLocaleString()}{" "}
                {upgrade.currency === "credits" ? "CR" : "CORES"}
              </div>

              <button
                type="button"
                disabled={!upgrade.unlocked}
                onClick={() => upgrade.unlocked && handleInstall(upgrade.id)}
                style={{
                  fontFamily: "monospace",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  padding: "5px 12px",
                  minHeight: 32,
                  borderRadius: 3,
                  border: `1px solid ${
                    isInstalled
                      ? "rgba(0,255,128,0.4)"
                      : upgrade.unlocked
                        ? "rgba(0,200,255,0.4)"
                        : "rgba(0,80,100,0.3)"
                  }`,
                  background: isInstalled
                    ? "rgba(0,40,20,0.8)"
                    : upgrade.unlocked
                      ? "rgba(0,20,50,0.8)"
                      : "rgba(0,10,20,0.6)",
                  color: isInstalled
                    ? "#00ff80"
                    : upgrade.unlocked
                      ? "#00c8ff"
                      : "rgba(0,100,130,0.5)",
                  cursor: upgrade.unlocked ? "pointer" : "not-allowed",
                  WebkitTapHighlightColor: "transparent",
                  outline: "none",
                }}
              >
                {isInstalled
                  ? "✓ EQUIPPED"
                  : upgrade.unlocked
                    ? "INSTALL"
                    : "LOCKED"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
