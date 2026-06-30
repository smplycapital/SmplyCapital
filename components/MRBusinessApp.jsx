import { useState, useEffect, useRef } from "react";

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://qrcpeskqkoyacnmjuxni.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyY3Blc2txa295YWNubWp1eG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzYxNTcsImV4cCI6MjA1ODE1MjE1N30.sVbbBqB1lnRMPYgbbHxDfkjkZMr_jz-jNOYLEYYRNi4";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0A0A0F",
  surface: "#12121A",
  surfaceHigh: "#1A1A26",
  border: "#ffffff14",
  borderHover: "#ffffff2a",
  purple: "#8B5CF6",
  purpleDim: "#8B5CF620",
  purpleGlow: "#8B5CF640",
  blue: "#60A5FA",
  orange: "#F59E0B",
  red: "#F43F5E",
  green: "#10B981",
  gold: "#FBBF24",
  white: "#FFFFFF",
  muted: "#A1A1AA",
  dimmer: "#71717A",
};

const CATEGORY_CONFIG = {
  restaurant: { icon: "🍝", label: "Restaurant", color: "#F43F5E" },
  cafe: { icon: "☕", label: "Cafe", color: "#92400E" },
  bar: { icon: "🍸", label: "Bar", color: "#A855F7" },
  retail: { icon: "🛍️", label: "Retail", color: "#60A5FA" },
  service: { icon: "💼", label: "Service", color: "#10B981" },
  entertainment: { icon: "🎬", label: "Entertainment", color: "#F59E0B" },
  other: { icon: "📍", label: "Business", color: "#A1A1AA" },
};

const PARTNER_TIER_CONFIG = {
  basic: { label: "Partner", color: "#A1A1AA", glow: "#A1A1AA30" },
  featured: { label: "Featured Partner", color: "#60A5FA", glow: "#60A5FA40" },
  premium: { label: "Premium Partner", color: "#FBBF24", glow: "#FBBF2450" },
};

// ── Supabase helpers ─────────────────────────────────────────────────────────
async function sb(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...options.headers,
    },
  });
  return res.json().catch(() => null);
}

async function sbRpc(fn, params) {
  return sb(`/rest/v1/rpc/${fn}`, { method: "POST", body: JSON.stringify(params) });
}

// ── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.white};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }

  .mr-app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    background: ${COLORS.bg};
    overflow: hidden;
  }

  /* ── Nav ── */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: rgba(18,18,26,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid ${COLORS.border};
    display: flex;
    padding: 12px 0 20px;
    z-index: 100;
  }
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    opacity: 0.45;
    transition: opacity 0.2s, transform 0.2s;
    background: none;
    border: none;
    color: ${COLORS.white};
  }
  .nav-item:hover { opacity: 0.7; }
  .nav-item.active { opacity: 1; }
  .nav-icon { font-size: 22px; line-height: 1; }
  .nav-label { font-size: 10px; font-weight: 500; letter-spacing: 0.5px; color: ${COLORS.muted}; }
  .nav-item.active .nav-label { color: ${COLORS.purple}; }

  .screen { padding: 0 0 90px; min-height: 100vh; }

  .screen-header {
    padding: 52px 20px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .screen-title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
  .screen-subtitle { font-size: 13px; color: ${COLORS.muted}; margin-top: 2px; }

  /* ── AR Camera Screen ── */
  .ar-viewport {
    position: relative;
    width: 100%;
    height: 100vh;
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 50%, #0a0a0f 100%);
    overflow: hidden;
  }

  .ar-street-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: linear-gradient(180deg, #2b3a55 0%, #4a5a78 38%, #6b7691 52%, #8b95a8 58%, #2a2a30 58.5%, #232328 100%);
  }

  .street-sun-glow {
    position: absolute;
    top: -60px; right: 10%;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, #ffe8b830 0%, transparent 70%);
  }
  .street-cloud {
    position: absolute;
    background: #ffffff14;
    border-radius: 50px;
    filter: blur(1px);
  }

  .street-skyline {
    position: absolute;
    left: 0; right: 0;
    bottom: 41%;
    height: 70px;
    display: flex;
    align-items: flex-end;
    opacity: 0.5;
  }
  .skyline-bldg {
    background: #1a1f2e;
    flex-shrink: 0;
  }

  .street-buildings {
    position: absolute;
    left: 0; right: 0;
    bottom: 41%;
    height: 220px;
    display: flex;
    align-items: flex-end;
  }

  .storefront {
    position: relative;
    height: 100%;
    flex-shrink: 0;
    border-right: 1px solid #00000040;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .storefront-upper {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(var(--win-cols, 2), 1fr);
    gap: 6px;
    padding: 10px 8px;
  }

  .storefront-window {
    background: #ffd98a22;
    border: 1px solid #ffffff12;
    border-radius: 2px;
  }
  .storefront-window.lit { background: #ffd98a4a; box-shadow: 0 0 12px #ffd98a30; }

  .storefront-awning {
    height: 22px;
    margin: 0 -1px;
    position: relative;
    clip-path: polygon(0 0, 100% 0, 94% 100%, 6% 100%);
  }

  .storefront-front {
    height: 70px;
    background: #14141c;
    border-top: 2px solid #00000060;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .storefront-door {
    width: 30%;
    height: 100%;
    background: #0a0a10;
    border: 1px solid #ffffff10;
    margin: 0 auto;
  }

  .storefront-sign {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
    white-space: nowrap;
    color: #ffffffcc;
    text-shadow: 0 1px 3px #00000080;
  }

  .street-sidewalk {
    position: absolute;
    left: 0; right: 0;
    bottom: 0;
    height: 41%;
    background: linear-gradient(180deg, #34343c 0%, #232328 100%);
  }

  .sidewalk-perspective-lines {
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(90deg, #ffffff08 0px, #ffffff08 1px, transparent 1px, transparent 13%);
    opacity: 0.5;
  }

  .sidewalk-curb {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: #4a4a52;
  }

  .street-lamp {
    position: absolute;
    bottom: 41%;
    width: 3px;
    background: #1c1c22;
  }
  .street-lamp::before {
    content: '';
    position: absolute;
    top: -8px; left: -5px;
    width: 13px; height: 13px;
    border-radius: 50%;
    background: #ffe8b8;
    box-shadow: 0 0 16px 4px #ffe8b860;
  }

  .street-tree {
    position: absolute;
    bottom: 41%;
    font-size: 30px;
    filter: drop-shadow(0 4px 6px #00000050) brightness(0.8);
  }

  .street-pedestrian {
    position: absolute;
    bottom: 41%;
    font-size: 22px;
    filter: drop-shadow(0 3px 4px #00000060) brightness(0.7);
    opacity: 0.85;
  }

  .ar-camera-feed {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .ar-viewport-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, #00000050 100%);
    pointer-events: none;
    z-index: 8;
  }

  .ar-permission-banner {
    position: absolute;
    top: 110px;
    left: 16px;
    right: 16px;
    z-index: 19;
    background: ${COLORS.purpleDim};
    border: 1px solid ${COLORS.purple}40;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 12.5px;
    color: ${COLORS.white};
    text-align: center;
    backdrop-filter: blur(8px);
    cursor: pointer;
  }

  .ar-empty-sweep {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 12;
    background: #00000070;
    backdrop-filter: blur(8px);
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 16px 24px;
    font-size: 13px;
    color: ${COLORS.muted};
    text-align: center;
    max-width: 260px;
  }

  .ar-chrome-header {
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 20;
    background: linear-gradient(180deg, #000000b0 0%, #00000090 70%, transparent 100%);
    padding-bottom: 14px;
  }

  .ar-topbar {
    padding: 52px 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ar-mode-badge {
    background: ${COLORS.purpleDim};
    border: 1px solid ${COLORS.purple}50;
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    color: ${COLORS.purple};
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ar-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${COLORS.purple};
    animation: arBlink 1.5s ease-in-out infinite;
  }
  @keyframes arBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

  .ar-count-badge {
    background: #00000060;
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    color: ${COLORS.white};
  }

  .ar-business-marker {
    position: absolute;
    transform: translate(-50%, -100%);
    z-index: 10;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s;
  }
  .ar-business-marker:hover { transform: translate(-50%, -100%) scale(1.05); }

  .ar-marker-pin {
    background: rgba(18,18,26,0.92);
    backdrop-filter: blur(12px);
    border: 1.5px solid var(--accent-color, ${COLORS.purple});
    border-radius: 14px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 20px #00000060, 0 0 24px var(--accent-glow, ${COLORS.purpleGlow});
    white-space: nowrap;
    max-width: 220px;
  }

  .ar-marker-icon { font-size: 18px; }
  .ar-marker-info { display: flex; flex-direction: column; min-width: 0; }
  .ar-marker-name {
    font-size: 13px; font-weight: 600;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ar-marker-meta { font-size: 10px; color: ${COLORS.muted}; display: flex; align-items: center; gap: 4px; }

  .ar-marker-stalk {
    width: 1.5px;
    height: 24px;
    background: linear-gradient(180deg, var(--accent-color, ${COLORS.purple}), transparent);
  }
  .ar-marker-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent-color, ${COLORS.purple});
    box-shadow: 0 0 10px var(--accent-color, ${COLORS.purple});
    margin-top: -1px;
  }

  .ar-deal-flag {
    position: absolute;
    top: -8px;
    right: -8px;
    background: ${COLORS.gold};
    color: #1a1a0a;
    border-radius: 8px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    box-shadow: 0 2px 8px #00000060;
  }

  .ar-bottom-sheet-hint {
    position: absolute;
    bottom: 110px;
    left: 50%;
    transform: translateX(-50%);
    background: #00000070;
    backdrop-filter: blur(8px);
    border: 1px solid ${COLORS.border};
    border-radius: 24px;
    padding: 10px 18px;
    font-size: 12px;
    color: ${COLORS.muted};
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 15;
  }

  .ar-crosshair {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border: 1.5px solid #ffffff25;
    border-radius: 50%;
    pointer-events: none;
    z-index: 5;
  }
  .ar-crosshair::before, .ar-crosshair::after {
    content: '';
    position: absolute;
    background: #ffffff35;
  }
  .ar-crosshair::before { width: 1px; height: 12px; top: -16px; left: 50%; transform: translateX(-50%); }
  .ar-crosshair::after { width: 12px; height: 1px; left: -16px; top: 50%; transform: translateY(-50%); }

  /* ── Filter pills ── */
  .filter-row {
    display: flex;
    gap: 8px;
    padding: 0 20px 16px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .filter-row::-webkit-scrollbar { display: none; }

  .filter-pill {
    flex-shrink: 0;
    background: ${COLORS.surfaceHigh};
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    color: ${COLORS.muted};
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  .filter-pill.active {
    background: ${COLORS.purple};
    border-color: ${COLORS.purple};
    color: white;
  }

  /* ── Business Card Popup ── */
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .overlay-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
  }
  .overlay-sheet {
    position: relative;
    z-index: 1;
    background: ${COLORS.surface};
    border-radius: 24px 24px 0 0;
    border: 1px solid ${COLORS.border};
    border-bottom: none;
    padding: 8px 0 32px;
    max-height: 88vh;
    overflow-y: auto;
  }
  .sheet-handle {
    width: 36px; height: 4px;
    background: ${COLORS.border};
    border-radius: 2px;
    margin: 12px auto 8px;
  }

  .biz-card-header {
    padding: 16px 24px 0;
  }

  .biz-card-banner {
    height: 100px;
    border-radius: 16px;
    margin: 0 24px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    position: relative;
    overflow: hidden;
  }

  .partner-ribbon {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--tier-color, ${COLORS.gold});
    color: #1a1a0a;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .biz-card-title-row {
    padding: 0 24px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 6px;
  }

  .biz-card-name { font-size: 21px; font-weight: 700; line-height: 1.25; }
  .biz-card-category {
    font-size: 13px;
    color: ${COLORS.muted};
    margin-top: 2px;
  }

  .rating-pill {
    flex-shrink: 0;
    background: ${COLORS.surfaceHigh};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 6px 10px;
    text-align: center;
    min-width: 56px;
  }
  .rating-stars { font-size: 13px; color: ${COLORS.gold}; font-weight: 700; }
  .rating-count { font-size: 10px; color: ${COLORS.dimmer}; margin-top: 1px; }

  .biz-card-address {
    padding: 0 24px;
    font-size: 13px;
    color: ${COLORS.muted};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .biz-status-row {
    padding: 0 24px;
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .status-chip {
    font-size: 12px;
    font-weight: 600;
    padding: 5px 11px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .status-chip.open { color: ${COLORS.green}; background: ${COLORS.green}18; }
  .status-chip.closed { color: ${COLORS.red}; background: ${COLORS.red}18; }
  .status-chip.price { color: ${COLORS.muted}; background: ${COLORS.surfaceHigh}; }
  .status-chip.distance { color: ${COLORS.blue}; background: ${COLORS.blue}18; }

  .biz-description {
    padding: 0 24px;
    font-size: 14px;
    line-height: 1.6;
    color: #D1D5DB;
    margin-bottom: 20px;
  }

  /* ── Deal cards ── */
  .deals-section { padding: 0 24px; margin-bottom: 20px; }
  .deals-section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: ${COLORS.gold};
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .deal-card {
    background: linear-gradient(135deg, ${COLORS.gold}12, ${COLORS.surfaceHigh});
    border: 1px solid ${COLORS.gold}35;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
  }
  .deal-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: ${COLORS.gold};
  }

  .deal-top-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }
  .deal-title { font-size: 14px; font-weight: 700; color: ${COLORS.white}; }
  .deal-value-badge {
    background: ${COLORS.gold};
    color: #1a1a0a;
    font-size: 13px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .deal-desc { font-size: 12.5px; color: ${COLORS.muted}; margin-top: 6px; line-height: 1.5; }
  .deal-terms { font-size: 11px; color: ${COLORS.dimmer}; margin-top: 8px; font-style: italic; }
  .deal-expiry { font-size: 11px; color: ${COLORS.orange}; margin-top: 8px; font-weight: 500; }

  .no-deals-note {
    padding: 14px 16px;
    background: ${COLORS.surfaceHigh};
    border: 1px dashed ${COLORS.border};
    border-radius: 14px;
    font-size: 13px;
    color: ${COLORS.dimmer};
    text-align: center;
  }

  /* ── Hours table ── */
  .hours-section { padding: 0 24px; margin-bottom: 20px; }
  .hours-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding: 6px 0;
    border-bottom: 1px solid ${COLORS.border};
  }
  .hours-row:last-child { border-bottom: none; }
  .hours-day { color: ${COLORS.muted}; }
  .hours-day.today { color: ${COLORS.white}; font-weight: 600; }
  .hours-time { color: ${COLORS.white}; }

  /* ── Action buttons ── */
  .biz-actions {
    padding: 0 24px;
    display: flex;
    gap: 10px;
  }

  .btn-primary {
    flex: 1;
    padding: 15px;
    background: ${COLORS.purple};
    border: none;
    border-radius: 14px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary:hover { background: #7C3AED; }
  .btn-primary.gold { background: ${COLORS.gold}; color: #1a1a0a; }
  .btn-primary.gold:hover { background: #F0B429; }

  .btn-icon-square {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: ${COLORS.surfaceHigh};
    border: 1px solid ${COLORS.border};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-icon-square:hover { border-color: ${COLORS.borderHover}; }

  /* ── List/Map Screen ── */
  .biz-list-card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }
  .biz-list-card:hover { border-color: ${COLORS.borderHover}; transform: translateY(-2px); }
  .biz-list-card.is-partner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--tier-color, ${COLORS.gold});
  }

  .biz-list-icon {
    width: 52px; height: 52px;
    border-radius: 12px;
    background: ${COLORS.surfaceHigh};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .biz-list-content { flex: 1; min-width: 0; }
  .biz-list-top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .biz-list-name { font-size: 14.5px; font-weight: 600; }
  .biz-list-category { font-size: 12px; color: ${COLORS.muted}; margin-top: 1px; }
  .biz-list-meta-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; flex-wrap: wrap; }

  .mini-rating { font-size: 12px; color: ${COLORS.gold}; font-weight: 600; display: flex; align-items: center; gap: 3px; }
  .mini-distance { font-size: 12px; color: ${COLORS.dimmer}; }
  .deal-tag {
    font-size: 11px;
    font-weight: 700;
    color: #1a1a0a;
    background: ${COLORS.gold};
    padding: 2px 8px;
    border-radius: 6px;
  }

  .cards-list { display: flex; flex-direction: column; gap: 10px; padding: 0 20px; }
  .section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: ${COLORS.dimmer};
    padding: 0 20px; margin-bottom: 12px;
  }

  .map-placeholder {
    background: ${COLORS.surfaceHigh};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    margin: 0 20px 24px;
    height: 220px;
    position: relative;
    overflow: hidden;
  }
  .map-pin {
    position: absolute;
    transform: translate(-50%, -100%);
    font-size: 22px;
    cursor: pointer;
    filter: drop-shadow(0 2px 4px #00000080);
  }
  .map-pin.partner { filter: drop-shadow(0 0 8px ${COLORS.gold}); }
  .map-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(${COLORS.border} 1px, transparent 1px),
      linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.5;
  }
  .map-user-dot {
    position: absolute;
    width: 12px; height: 12px;
    background: ${COLORS.blue};
    border: 2px solid white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 6px ${COLORS.blue}30;
  }

  /* ── BD pipeline screen ── */
  .bd-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 0 20px 20px; }
  .bd-stat-box {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 14px;
    text-align: center;
  }
  .bd-stat-value { font-size: 22px; font-weight: 700; }
  .bd-stat-label { font-size: 11px; color: ${COLORS.muted}; margin-top: 3px; }

  .pipeline-row {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .pipeline-stage-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 4px 9px;
    border-radius: 7px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
  }

  .loading-center {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 20px; gap: 16px; color: ${COLORS.muted}; font-size: 14px;
  }
  .spinner {
    width: 32px; height: 32px;
    border: 2px solid ${COLORS.border};
    border-top-color: ${COLORS.purple};
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    padding: 60px 32px; text-align: center; gap: 12px;
  }
  .empty-icon { font-size: 48px; opacity: 0.5; }
  .empty-title { font-size: 18px; font-weight: 600; }
  .empty-desc { font-size: 14px; color: ${COLORS.muted}; line-height: 1.6; }

  .toast {
    position: fixed;
    top: 60px; left: 50%;
    transform: translateX(-50%) translateY(-80px);
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 12px 20px;
    display: flex; align-items: center; gap: 10px;
    z-index: 500;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 8px 32px #00000060;
    white-space: nowrap;
  }
  .toast.show { transform: translateX(-50%) translateY(0); }
`;

// ── Geo / bearing math ────────────────────────────────────────────────────────
function toRad(deg) { return (deg * Math.PI) / 180; }
function toDeg(rad) { return (rad * 180) / Math.PI; }

function calculateBearing(lat1, lng1, lat2, lng2) {
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lng2 - lng1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function relativeBearing(deviceHeading, targetBearing) {
  let diff = targetBearing - deviceHeading;
  diff = ((diff + 180) % 360 + 360) % 360 - 180;
  return diff;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function categoryConfig(cat) {
  return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.other;
}

function getTodayHours(hours) {
  if (!hours) return null;
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = days[new Date().getDay()];
  return hours[today] || null;
}

function isOpenNow(hours) {
  const todayHours = getTodayHours(hours);
  if (!todayHours || todayHours === "closed") return false;
  return true;
}

function formatDistance(meters) {
  if (meters == null) return "";
  if (meters < 100) return "Right here";
  const ft = Math.round(meters * 3.281);
  if (ft < 1000) return `${ft} ft`;
  return `${(meters / 1000).toFixed(1)} km`;
}

const DAY_LABELS = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
};
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return (
    <div className={`toast ${show ? "show" : ""}`}>
      <span>📍</span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{message}</span>
    </div>
  );
}

// ── Business Card Popup ──────────────────────────────────────────────────────
function BusinessCardPopup({ business, deals, onClose, onSave, isSaved }) {
  const cat = categoryConfig(business.category);
  const tier = PARTNER_TIER_CONFIG[business.partner_tier];
  const open = isOpenNow(business.opening_hours);
  const todayKey = DAY_ORDER[(new Date().getDay() + 6) % 7];

  return (
    <div className="overlay">
      <div className="overlay-backdrop" onClick={onClose} />
      <div className="overlay-sheet">
        <div className="sheet-handle" />

        <div
          className="biz-card-banner"
          style={{
            background: `linear-gradient(135deg, ${business.brand_color || cat.color}30, ${COLORS.surfaceHigh})`,
            border: `1px solid ${(business.brand_color || cat.color)}30`,
          }}
        >
          {cat.icon}
          {business.is_partner && tier && (
            <div className="partner-ribbon" style={{ "--tier-color": tier.color }}>
              ⭐ {tier.label}
            </div>
          )}
        </div>

        <div className="biz-card-title-row">
          <div>
            <div className="biz-card-name">{business.name}</div>
            <div className="biz-card-category">
              {cat.label}{business.subcategory ? ` · ${business.subcategory}` : ""}
            </div>
          </div>
          {business.google_rating && (
            <div className="rating-pill">
              <div className="rating-stars">★ {business.google_rating}</div>
              <div className="rating-count">
                {business.google_rating_count?.toLocaleString() || 0} reviews
              </div>
            </div>
          )}
        </div>

        <div className="biz-card-address">
          📍 {business.address || "Address unavailable"}
        </div>

        <div className="biz-status-row">
          <span className={`status-chip ${open ? "open" : "closed"}`}>
            {open ? "● Open now" : "● Closed"}
          </span>
          {business.google_price_level != null && (
            <span className="status-chip price">
              {"$".repeat(business.google_price_level + 1) || "$"}
            </span>
          )}
          {business.distance_meters != null && (
            <span className="status-chip distance">
              📏 {formatDistance(business.distance_meters)}
            </span>
          )}
        </div>

        {business.custom_description && (
          <p className="biz-description">{business.custom_description}</p>
        )}

        <div className="deals-section">
          <div className="deals-section-label">🏷️ Deals &amp; Promos</div>
          {deals && deals.length > 0 ? (
            deals.map(deal => (
              <div key={deal.id} className="deal-card">
                <div className="deal-top-row">
                  <div className="deal-title">{deal.title}</div>
                  <div className="deal-value-badge">{deal.discount_value}</div>
                </div>
                {deal.description && <div className="deal-desc">{deal.description}</div>}
                {deal.terms && <div className="deal-terms">{deal.terms}</div>}
                {deal.ends_at && (
                  <div className="deal-expiry">
                    Ends{" "}
                    {new Date(deal.ends_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-deals-note">
              No active deals right now — check back soon!
            </div>
          )}
        </div>

        {business.opening_hours && Object.keys(business.opening_hours).length > 0 && (
          <div className="hours-section">
            <div className="deals-section-label" style={{ color: COLORS.muted }}>
              🕐 Hours
            </div>
            {DAY_ORDER.map(day => (
              <div key={day} className="hours-row">
                <span className={`hours-day ${day === todayKey ? "today" : ""}`}>
                  {DAY_LABELS[day]}
                </span>
                <span className="hours-time">
                  {business.opening_hours[day] === "closed"
                    ? "Closed"
                    : business.opening_hours[day] || "—"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="biz-actions">
          <button
            className={`btn-primary ${deals?.length ? "gold" : ""}`}
            onClick={() => onSave(business)}
          >
            {isSaved ? "✓ Saved" : deals?.length ? "🏷️ Claim Deal" : "📌 Save Business"}
          </button>
          <div className="btn-icon-square" title="Directions">🧭</div>
          <div className="btn-icon-square" title="Call">📞</div>
        </div>
      </div>
    </div>
  );
}

// ── Procedural Street Scene ───────────────────────────────────────────────────
const BUILDING_PALETTE = ["#3a3438", "#34343e", "#3e3636", "#363a40", "#3a3a32"];
const AWNING_PALETTE = ["#8B5CF6", "#C0392B", "#2E7D5B", "#92400E", "#1E5A8A", "#7C3AED"];

function StreetScene() {
  const buildings = [
    { width: 78, signLabel: "DELI", winCols: 2, winRows: 2, hasAwning: true },
    { width: 64, signLabel: "", winCols: 1, winRows: 3, hasAwning: false },
    { width: 90, signLabel: "CAFÉ", winCols: 2, winRows: 2, hasAwning: true },
    { width: 70, signLabel: "", winCols: 2, winRows: 3, hasAwning: false },
    { width: 84, signLabel: "SALON", winCols: 2, winRows: 2, hasAwning: true },
    { width: 60, signLabel: "", winCols: 1, winRows: 2, hasAwning: false },
    { width: 96, signLabel: "MARKET", winCols: 3, winRows: 2, hasAwning: true },
    { width: 72, signLabel: "", winCols: 2, winRows: 3, hasAwning: false },
    { width: 80, signLabel: "BAKERY", winCols: 2, winRows: 2, hasAwning: true },
  ];

  const skylineBuildings = Array.from({ length: 14 }).map((_, i) => ({
    width: 18 + (i % 4) * 8,
    height: 20 + ((i * 13) % 50),
  }));

  return (
    <>
      <div className="street-sun-glow" />
      <div className="street-cloud" style={{ width: 90, height: 24, top: 40, left: "15%", opacity: 0.5 }} />
      <div className="street-cloud" style={{ width: 60, height: 18, top: 70, left: "55%", opacity: 0.3 }} />

      <div className="street-skyline">
        {skylineBuildings.map((b, i) => (
          <div key={i} className="skyline-bldg" style={{ width: b.width, height: b.height }} />
        ))}
      </div>

      <div className="street-buildings">
        {buildings.map((b, i) => {
          const bldgColor = BUILDING_PALETTE[i % BUILDING_PALETTE.length];
          const awningColor = AWNING_PALETTE[i % AWNING_PALETTE.length];
          const totalWindows = b.winCols * b.winRows;
          return (
            <div key={i} className="storefront" style={{ width: b.width, background: bldgColor }}>
              {b.hasAwning && (
                <div style={{ position: "relative" }}>
                  {b.signLabel && <div className="storefront-sign">{b.signLabel}</div>}
                </div>
              )}
              <div
                className="storefront-upper"
                style={{
                  "--win-cols": b.winCols,
                  gridTemplateRows: `repeat(${b.winRows}, 1fr)`,
                }}
              >
                {Array.from({ length: totalWindows }).map((_, w) => (
                  <div
                    key={w}
                    className={`storefront-window ${(i + w) % 3 !== 0 ? "lit" : ""}`}
                  />
                ))}
              </div>
              {b.hasAwning && (
                <div className="storefront-awning" style={{ background: awningColor }} />
              )}
              <div className="storefront-front">
                <div className="storefront-door" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="street-tree" style={{ left: "8%" }}>🌳</div>
      <div className="street-lamp" style={{ left: "28%", height: 60 }} />
      <div className="street-pedestrian" style={{ left: "40%" }}>🚶</div>
      <div className="street-tree" style={{ left: "62%" }}>🌳</div>
      <div className="street-lamp" style={{ left: "80%", height: 60 }} />
      <div className="street-pedestrian" style={{ left: "70%" }}>🚶‍♀️</div>

      <div className="street-sidewalk">
        <div className="sidewalk-curb" />
        <div className="sidewalk-perspective-lines" />
      </div>
    </>
  );
}

// ── Screen 1: AR View ────────────────────────────────────────────────────────
const AR_FOV_DEGREES = 70;

function ARScreen({
  businesses,
  loading,
  onSelectBusiness,
  categoryFilter,
  setCategoryFilter,
  userLocation,
}) {
  const categories = ["all", "restaurant", "cafe", "bar", "retail", "service", "entertainment"];
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [heading, setHeading] = useState(0);
  const [compassActive, setCompassActive] = useState(false);
  const [needsCompassPermission, setNeedsCompassPermission] = useState(false);

  const filtered =
    categoryFilter === "all"
      ? businesses
      : businesses.filter(b => b.category === categoryFilter);

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (e) {
        setCameraError(e.name === "NotAllowedError" ? "denied" : "unavailable");
      }
    }
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  useEffect(() => {
    function handleOrientation(e) {
      let h = null;
      if (e.webkitCompassHeading != null) {
        h = e.webkitCompassHeading;
      } else if (e.absolute && e.alpha != null) {
        h = 360 - e.alpha;
      }
      if (h != null) {
        setHeading(h);
        setCompassActive(true);
      }
    }

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      setNeedsCompassPermission(true);
    } else {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  async function requestCompassPermission() {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === "granted") {
        setNeedsCompassPermission(false);
        window.addEventListener(
          "deviceorientation",
          e => {
            const h =
              e.webkitCompassHeading != null ? e.webkitCompassHeading : 360 - (e.alpha || 0);
            setHeading(h);
            setCompassActive(true);
          },
          true
        );
      }
    } catch {
      setNeedsCompassPermission(false);
    }
  }

  const positioned = filtered
    .map(b => {
      if (!userLocation)
        return { ...b, bearing: null, screenX: null, distance_m: b.distance_meters };
      const bearing = calculateBearing(
        userLocation.lat, userLocation.lng, b.location_lat, b.location_lng
      );
      const distance_m = calculateDistance(
        userLocation.lat, userLocation.lng, b.location_lat, b.location_lng
      );
      const rel = relativeBearing(heading, bearing);
      const inView = Math.abs(rel) <= AR_FOV_DEGREES / 2 + 10;
      const screenX = 50 + (rel / (AR_FOV_DEGREES / 2)) * 50;
      return { ...b, bearing, distance_m, rel, inView, screenX };
    })
    .filter(b => (userLocation ? b.inView : true));

  function fallbackPosition(index, total) {
    const spread = Math.min(total, 6);
    const slot = index % spread;
    const xPct = 10 + (slot / Math.max(spread - 1, 1)) * 80;
    const yPct = 44 + (index % 3) * 5;
    return { left: `${xPct}%`, top: `${yPct}%` };
  }

  function depthPosition(b) {
    const d = b.distance_m ?? 500;
    const yPct = Math.min(56, Math.max(40, 56 - (d / 2000) * 16));
    const scale = Math.min(1.05, Math.max(0.75, 1.05 - (d / 3000) * 0.3));
    return {
      left: `${Math.min(96, Math.max(4, b.screenX))}%`,
      top: `${yPct}%`,
      transform: `translate(-50%, -100%) scale(${scale})`,
    };
  }

  const showLiveMode = cameraActive && !cameraError;

  return (
    <div className="ar-viewport">
      {showLiveMode ? (
        <video ref={videoRef} autoPlay playsInline muted className="ar-camera-feed" />
      ) : (
        <div className="ar-street-bg">
          <StreetScene />
        </div>
      )}
      <div className="ar-viewport-vignette" />
      <div className="ar-crosshair" />

      <div className="ar-chrome-header">
        <div className="ar-topbar">
          <div className="ar-mode-badge">
            <span className="ar-dot" />
            {showLiveMode ? "AR LIVE" : "PREVIEW MODE"}
          </div>
          <div className="ar-count-badge">{positioned.length} nearby</div>
        </div>

        <div className="filter-row" style={{ padding: "14px 20px 0" }}>
          {categories.map(c => (
            <div
              key={c}
              className={`filter-pill ${categoryFilter === c ? "active" : ""}`}
              onClick={() => setCategoryFilter(c)}
              style={{
                background: categoryFilter === c ? COLORS.purple : "#00000060",
                backdropFilter: "blur(8px)",
              }}
            >
              {c === "all" ? "🌐" : categoryConfig(c).icon}{" "}
              {c === "all" ? "All" : categoryConfig(c).label}
            </div>
          ))}
        </div>
      </div>

      {needsCompassPermission && (
        <div className="ar-permission-banner" onClick={requestCompassPermission}>
          🧭 Tap to enable compass for live AR positioning
        </div>
      )}

      {cameraError && (
        <div
          className="ar-permission-banner"
          style={{ background: COLORS.red + "20", borderColor: COLORS.red + "40" }}
        >
          {cameraError === "denied"
            ? "📵 Camera access denied — showing preview mode"
            : "📵 Camera unavailable — showing preview mode"}
        </div>
      )}

      {!userLocation && !loading && (
        <div
          className="ar-permission-banner"
          style={{ top: needsCompassPermission || cameraError ? 150 : 110 }}
        >
          📍 Location unavailable — markers shown in preview layout
        </div>
      )}

      {loading ? (
        <div
          className="loading-center"
          style={{ position: "absolute", inset: 0, justifyContent: "center" }}
        >
          <div className="spinner" />
          Scanning surroundings...
        </div>
      ) : (
        positioned.slice(0, 10).map((b, i) => {
          const cat = categoryConfig(b.category);
          const tier = PARTNER_TIER_CONFIG[b.partner_tier];
          const accentColor = b.is_partner ? tier?.color || COLORS.gold : cat.color;
          const pos =
            userLocation && compassActive ? depthPosition(b) : fallbackPosition(i, positioned.length);
          return (
            <div
              key={b.id}
              className="ar-business-marker"
              style={pos}
              onClick={() => onSelectBusiness(b)}
            >
              <div
                className="ar-marker-pin"
                style={{ "--accent-color": accentColor, "--accent-glow": accentColor + "40" }}
              >
                {b.has_active_deal && <div className="ar-deal-flag">%</div>}
                <span className="ar-marker-icon">{cat.icon}</span>
                <div className="ar-marker-info">
                  <span className="ar-marker-name">{b.name}</span>
                  <span className="ar-marker-meta">
                    {b.google_rating ? `★ ${b.google_rating}` : cat.label}
                    {b.distance_m != null ? ` · ${formatDistance(b.distance_m)}` : ""}
                  </span>
                </div>
              </div>
              <div
                className="ar-marker-stalk"
                style={{ "--accent-color": accentColor }}
              />
              <div
                className="ar-marker-dot"
                style={{ "--accent-color": accentColor }}
              />
            </div>
          );
        })
      )}

      {!loading && positioned.length === 0 && userLocation && (
        <div className="ar-empty-sweep">
          🧭 Turn around — no partnered businesses in this direction yet
        </div>
      )}

      {!loading && positioned.length > 0 && (
        <div className="ar-bottom-sheet-hint">
          👆 Tap a card to see details &amp; deals
        </div>
      )}
    </div>
  );
}

// ── Screen 2: Nearby List + Map ───────────────────────────────────────────────
function NearbyScreen({ businesses, loading, onSelectBusiness, categoryFilter, setCategoryFilter }) {
  const categories = ["all", "restaurant", "cafe", "bar", "retail", "service", "entertainment"];
  const filtered =
    categoryFilter === "all" ? businesses : businesses.filter(b => b.category === categoryFilter);
  const partners = filtered.filter(b => b.is_partner);
  const others = filtered.filter(b => !b.is_partner);

  function mapPos(b, idx) {
    const seed = (b.location_lat * 1000 + b.location_lng * 1000 + idx) % 100;
    return { left: `${15 + (seed % 70)}%`, top: `${15 + ((seed * 3) % 65)}%` };
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-title">Nearby</div>
          <div className="screen-subtitle">
            {loading ? "Finding businesses..." : `${filtered.length} places around you`}
          </div>
        </div>
      </div>

      <div className="filter-row">
        {categories.map(c => (
          <div
            key={c}
            className={`filter-pill ${categoryFilter === c ? "active" : ""}`}
            onClick={() => setCategoryFilter(c)}
          >
            {c === "all" ? "🌐" : categoryConfig(c).icon}{" "}
            {c === "all" ? "All" : categoryConfig(c).label}
          </div>
        ))}
      </div>

      <div className="map-placeholder">
        <div className="map-grid-bg" />
        <div className="map-user-dot" style={{ left: "50%", top: "50%" }} />
        {filtered.map((b, i) => (
          <div
            key={b.id}
            className={`map-pin ${b.is_partner ? "partner" : ""}`}
            style={mapPos(b, i)}
            onClick={() => onSelectBusiness(b)}
            title={b.name}
          >
            {categoryConfig(b.category).icon}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
          Loading nearby businesses...
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No businesses found</div>
          <div className="empty-desc">Try a different category or check back soon.</div>
        </div>
      ) : (
        <>
          {partners.length > 0 && (
            <>
              <div className="section-label">⭐ FEATURED PARTNERS</div>
              <div className="cards-list" style={{ marginBottom: 24 }}>
                {partners.map(b => (
                  <BizListCard key={b.id} b={b} onSelect={onSelectBusiness} />
                ))}
              </div>
            </>
          )}
          <div className="section-label">ALL NEARBY</div>
          <div className="cards-list">
            {others.map(b => (
              <BizListCard key={b.id} b={b} onSelect={onSelectBusiness} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BizListCard({ b, onSelect }) {
  const cat = categoryConfig(b.category);
  const tier = PARTNER_TIER_CONFIG[b.partner_tier];
  return (
    <div
      className={`biz-list-card ${b.is_partner ? "is-partner" : ""}`}
      style={{ "--tier-color": tier?.color }}
      onClick={() => onSelect(b)}
    >
      <div
        className="biz-list-icon"
        style={{ background: (b.brand_color || cat.color) + "20" }}
      >
        {cat.icon}
      </div>
      <div className="biz-list-content">
        <div className="biz-list-top-row">
          <div>
            <div className="biz-list-name">{b.name}</div>
            <div className="biz-list-category">
              {cat.label}{b.subcategory ? ` · ${b.subcategory}` : ""}
            </div>
          </div>
        </div>
        <div className="biz-list-meta-row">
          {b.google_rating && <span className="mini-rating">★ {b.google_rating}</span>}
          {b.distance_meters != null && (
            <span className="mini-distance">{formatDistance(b.distance_meters)}</span>
          )}
          {b.has_active_deal && <span className="deal-tag">DEAL</span>}
        </div>
      </div>
    </div>
  );
}

// ── Screen 3: BD Pipeline ────────────────────────────────────────────────────
function BDPipelineScreen({ businesses }) {
  const partners = businesses.filter(b => b.is_partner);
  const prospects = businesses.filter(b => !b.is_partner);

  const stageColors = {
    prospect: { bg: "#A1A1AA20", color: "#A1A1AA" },
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <div>
          <div className="screen-title">Partnerships</div>
          <div className="screen-subtitle">BD pipeline overview</div>
        </div>
      </div>

      <div className="bd-stat-row">
        <div className="bd-stat-box">
          <div className="bd-stat-value" style={{ color: COLORS.gold }}>{partners.length}</div>
          <div className="bd-stat-label">Signed Partners</div>
        </div>
        <div className="bd-stat-box">
          <div className="bd-stat-value" style={{ color: COLORS.blue }}>{prospects.length}</div>
          <div className="bd-stat-label">Prospects</div>
        </div>
        <div className="bd-stat-box">
          <div className="bd-stat-value" style={{ color: COLORS.green }}>
            {Math.round((partners.length / Math.max(businesses.length, 1)) * 100)}%
          </div>
          <div className="bd-stat-label">Conversion</div>
        </div>
      </div>

      <div className="section-label">✅ LIVE PARTNERS</div>
      <div className="cards-list" style={{ marginBottom: 24 }}>
        {partners.map(b => {
          const tier = PARTNER_TIER_CONFIG[b.partner_tier];
          return (
            <div key={b.id} className="pipeline-row">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                  {categoryConfig(b.category).label}{" "}
                  {b.has_active_deal ? "· Active deal running" : "· No active deal"}
                </div>
              </div>
              <div
                className="pipeline-stage-badge"
                style={{
                  background: tier?.glow || "#FBBF2430",
                  color: tier?.color || COLORS.gold,
                }}
              >
                {tier?.label || "Partner"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-label">🎯 OUTREACH TARGETS</div>
      <div className="cards-list">
        {prospects.map(b => (
          <div key={b.id} className="pipeline-row">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                {categoryConfig(b.category).label} · ★ {b.google_rating || "—"} (
                {b.google_rating_count || 0} reviews)
              </div>
            </div>
            <div
              className="pipeline-stage-badge"
              style={{ background: stageColors.prospect.bg, color: stageColors.prospect.color }}
            >
              Prospect
            </div>
          </div>
        ))}
        {prospects.length === 0 && (
          <div className="empty-state" style={{ padding: "20px 32px" }}>
            <div className="empty-desc">All nearby businesses are already partners 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nav icons ────────────────────────────────────────────────────────────────
const icons = {
  ar: active => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={active ? COLORS.purple : COLORS.muted} strokeWidth="2">
      <path d="M21 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  nearby: active => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={active ? COLORS.purple : COLORS.muted} strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  bd: active => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke={active ? COLORS.purple : COLORS.muted} strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

// ── Main App ─────────────────────────────────────────────────────────────────
export default function MRBusinessApp() {
  const [screen, setScreen] = useState("ar");
  const [businesses, setBusinesses] = useState([]);
  const [dealsByBusiness, setDealsByBusiness] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [savedIds, setSavedIds] = useState(new Set());
  const [toast, setToast] = useState({ show: false, message: "" });
  const [userLocation, setUserLocation] = useState(null);

  function showToast(msg) {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: msg }), 2800);
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const nearby = await sbRpc("find_nearby_businesses", {
          user_lat: 40.7484,
          user_lng: -73.9857,
          radius_meters: 50000,
          category_filter: null,
          limit_count: 30,
        });
        if (Array.isArray(nearby)) {
          setBusinesses(nearby);
          const partnerIds = nearby.filter(b => b.is_partner).map(b => b.id);
          if (partnerIds.length > 0) {
            const dealsData = await sb(
              `/rest/v1/mr_deals?business_id=in.(${partnerIds.join(",")})&is_active=eq.true`
            );
            if (Array.isArray(dealsData)) {
              const grouped = {};
              dealsData.forEach(d => {
                if (!grouped[d.business_id]) grouped[d.business_id] = [];
                grouped[d.business_id].push(d);
              });
              setDealsByBusiness(grouped);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        const nearby = await sbRpc("find_nearby_businesses", {
          user_lat: lat,
          user_lng: lng,
          radius_meters: 50000,
          category_filter: null,
          limit_count: 30,
        });
        if (Array.isArray(nearby) && nearby.length > 0) setBusinesses(nearby);
      },
      () => {}
    );
  }, []);

  function handleSave(business) {
    setSavedIds(s => new Set([...s, business.id]));
    const hasDeals = (dealsByBusiness[business.id] || []).length > 0;
    showToast(hasDeals ? `Deal claimed at ${business.name}!` : `Saved ${business.name}`);
    setSelectedBusiness(null);
  }

  return (
    <>
      <style>{css}</style>
      <div className="mr-app">
        <Toast message={toast.message} show={toast.show} />

        {screen === "ar" && (
          <ARScreen
            businesses={businesses}
            loading={loading}
            onSelectBusiness={setSelectedBusiness}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            userLocation={userLocation}
          />
        )}
        {screen === "nearby" && (
          <NearbyScreen
            businesses={businesses}
            loading={loading}
            onSelectBusiness={setSelectedBusiness}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        )}
        {screen === "bd" && <BDPipelineScreen businesses={businesses} />}

        {selectedBusiness && (
          <BusinessCardPopup
            business={selectedBusiness}
            deals={dealsByBusiness[selectedBusiness.id] || []}
            onClose={() => setSelectedBusiness(null)}
            onSave={handleSave}
            isSaved={savedIds.has(selectedBusiness.id)}
          />
        )}

        <nav className="bottom-nav">
          {[
            { id: "ar", label: "AR View" },
            { id: "nearby", label: "Nearby" },
            { id: "bd", label: "Partners" },
          ].map(({ id, label }) => (
            <button
              key={id}
              className={`nav-item ${screen === id ? "active" : ""}`}
              onClick={() => setScreen(id)}
            >
              <span className="nav-icon">{icons[id](screen === id)}</span>
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
