import { useState } from "react";
import { TER_DATA, SIM_DATA } from "./data/terData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart2,
  Shield,
  Target,
  AlertTriangle,
  ChevronRight,
  Info,
  Zap,
  Award,
  CheckCircle,
  Quote,
  Users,
  BookOpen,
  Brain,
  Building2,
  GraduationCap,
  BarChart3,
  Cpu,
} from "lucide-react";

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  teal: "#14B8A6",
  red: "#EF4444",
  amber: "#F59E0B",
  blue: "#3B82F6",
  green: "#22C55E",
  purple: "#A855F7",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1E293B",
  slate900: "#0F172A",
  bg: "#0B1220",
  card: "#111827",
  border: "#1E293B",
  text: "#E2E8F0",
  muted: "#64748B",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number, dec = 0) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

const fmtPrice = (n: number) => `$${fmt(n, 2)}`;

// ── Logo SVG ──────────────────────────────────────────────────────────────────
function StockPulseLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="StockPulse"
    >
      {/* Circuit board base */}
      <rect width="32" height="32" rx="6" fill={C.teal} fillOpacity="0.15" />
      {/* Grid dots */}
      {[8, 16, 24].map((x) =>
        [8, 16, 24].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill={C.teal} fillOpacity="0.4" />
        ))
      )}
      {/* Pulse line */}
      <polyline
        points="4,16 8,16 10,10 13,22 16,14 19,18 22,16 28,16"
        stroke={C.teal}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Circuit traces */}
      <line x1="8" y1="8" x2="8" y2="24" stroke={C.teal} strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="24" y1="8" x2="24" y2="24" stroke={C.teal} strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
  );
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color = C.teal, width = 80, height = 28 }: any) {
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const pts = data.map((v: number, i: number) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - mn) / (mx - mn)) * height;
    return `${x},${y}`;
  });
  const path = `M${pts.join("L")}`;
  const area = `${path}L${width},${height}L0,${height}Z`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkGrad)" />
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  title,
  value,
  sub,
  color = C.text,
  badge,
  sparkData,
  icon,
}: any) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-2"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        minWidth: 0,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium tracking-wider uppercase"
          style={{ color: C.muted }}
        >
          {title}
        </span>
        {icon && <span style={{ color: C.muted }}>{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span
          className="text-xl font-bold tabular"
          style={{ color, lineHeight: 1 }}
        >
          {value}
        </span>
        {sparkData && (
          <Sparkline
            data={sparkData}
            color={
              sparkData[sparkData.length - 1] > sparkData[0] ? C.teal : C.red
            }
          />
        )}
      </div>
      {sub && (
        <div className="flex items-center gap-1">
          {badge && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background:
                  badge === "Buy"
                    ? "rgba(34,197,94,0.15)"
                    : badge === "amber"
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(20,184,166,0.12)",
                color:
                  badge === "Buy"
                    ? C.green
                    : badge === "amber"
                    ? C.amber
                    : C.teal,
              }}
            >
              {badge}
            </span>
          )}
          <span className="text-xs" style={{ color: C.muted }}>
            {sub}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Section Wrapper ───────────────────────────────────────────────────────────
function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-baseline gap-3 mb-4">
        <h2
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: C.teal }}
        >
          {title}
        </h2>
        {subtitle && (
          <span className="text-xs" style={{ color: C.muted }}>
            {subtitle}
          </span>
        )}
        <div className="flex-1 h-px" style={{ background: C.border }} />
      </div>
      {children}
    </section>
  );
}

// ── Kronos Forecast Chart ─────────────────────────────────────────────────────
function KronosForecastChart() {
  const [show, setShow] = useState({ bear: true, base: true, bull: true });

  // Build chart data: historical (left) + forecast (right)
  const histPoints = TER_DATA.historical_prices;
  const simLen = SIM_DATA.base.p50.length; // 51 points

  // Create date labels
  const today = new Date();
  const histData = histPoints.map((price, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (histPoints.length - i) * 1);
    return {
      idx: i,
      date: `Day ${i + 1}`,
      historical: price,
      zone: "hist",
    };
  });

  const forecastData = SIM_DATA.base.p50.map((_, i) => {
    const weekIdx = i;
    return {
      idx: histPoints.length + i,
      date: `W${i + 1}`,
      zone: "forecast",
      // Bear bands
      bearP10: show.bear ? SIM_DATA.bear.p10[weekIdx] : null,
      bearP25: show.bear ? SIM_DATA.bear.p25[weekIdx] : null,
      bearP50: show.bear ? SIM_DATA.bear.p50[weekIdx] : null,
      bearP75: show.bear ? SIM_DATA.bear.p75[weekIdx] : null,
      bearP90: show.bear ? SIM_DATA.bear.p90[weekIdx] : null,
      // Base bands
      baseP10: show.base ? SIM_DATA.base.p10[weekIdx] : null,
      baseP25: show.base ? SIM_DATA.base.p25[weekIdx] : null,
      baseP50: show.base ? SIM_DATA.base.p50[weekIdx] : null,
      baseP75: show.base ? SIM_DATA.base.p75[weekIdx] : null,
      baseP90: show.base ? SIM_DATA.base.p90[weekIdx] : null,
      // Bull bands
      bullP10: show.bull ? SIM_DATA.bull.p10[weekIdx] : null,
      bullP25: show.bull ? SIM_DATA.bull.p25[weekIdx] : null,
      bullP50: show.bull ? SIM_DATA.bull.p50[weekIdx] : null,
      bullP75: show.bull ? SIM_DATA.bull.p75[weekIdx] : null,
      bullP90: show.bull ? SIM_DATA.bull.p90[weekIdx] : null,
    };
  });

  // Combine: use last hist point as bridge
  const bridge = {
    idx: histPoints.length - 1,
    date: "Now",
    historical: histPoints[histPoints.length - 1],
    zone: "bridge",
    bearP50: histPoints[histPoints.length - 1],
    baseP50: histPoints[histPoints.length - 1],
    bullP50: histPoints[histPoints.length - 1],
    bearP10: histPoints[histPoints.length - 1],
    bearP90: histPoints[histPoints.length - 1],
    bearP25: histPoints[histPoints.length - 1],
    bearP75: histPoints[histPoints.length - 1],
    baseP10: histPoints[histPoints.length - 1],
    baseP90: histPoints[histPoints.length - 1],
    baseP25: histPoints[histPoints.length - 1],
    baseP75: histPoints[histPoints.length - 1],
    bullP10: histPoints[histPoints.length - 1],
    bullP90: histPoints[histPoints.length - 1],
    bullP25: histPoints[histPoints.length - 1],
    bullP75: histPoints[histPoints.length - 1],
  };

  // For historical section, use every 2nd point for performance
  const histSampled = histData.filter((_, i) => i % 2 === 0);
  const combined = [...histSampled, bridge, ...forecastData];

  const togBtn = (key: keyof typeof show, label: string, color: string) => (
    <button
      onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
      className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all"
      style={{
        background: show[key] ? `${color}20` : "transparent",
        border: `1px solid ${show[key] ? color : C.border}`,
        color: show[key] ? color : C.muted,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: show[key] ? color : C.muted }}
      />
      {label}
    </button>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div
        className="rounded-lg p-3 text-xs space-y-1"
        style={{
          background: "#1a2640",
          border: `1px solid ${C.border}`,
          minWidth: 160,
        }}
      >
        <p className="font-semibold" style={{ color: C.text }}>
          {label}
        </p>
        {d?.historical && (
          <p style={{ color: C.teal }}>
            Price: {fmtPrice(d.historical)}
          </p>
        )}
        {d?.bearP50 && (
          <p style={{ color: C.red }}>Bear: {fmtPrice(d.bearP50)}</p>
        )}
        {d?.baseP50 && (
          <p style={{ color: C.blue }}>Base: {fmtPrice(d.baseP50)}</p>
        )}
        {d?.bullP50 && (
          <p style={{ color: C.green }}>Bull: {fmtPrice(d.bullP50)}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-semibold" style={{ color: C.text }}>
            12-Month Kronos AI Forecast
          </h3>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            Monte Carlo simulation · 30 paths per scenario · AAAI 2026 Kronos
            Foundation Model
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {togBtn("bear", `Bear $${SIM_DATA.scenario_endpoints.bear_median.toFixed(0)}`, C.red)}
          {togBtn("base", `Base $${SIM_DATA.scenario_endpoints.base_median.toFixed(0)}`, C.blue)}
          {togBtn("bull", `Bull $${SIM_DATA.scenario_endpoints.bull_median.toFixed(0)}`, C.green)}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <AreaChart
          data={combined}
          margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
        >
          <defs>
            {/* Bear gradient */}
            <linearGradient id="bearGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.red} stopOpacity={0.25} />
              <stop offset="95%" stopColor={C.red} stopOpacity={0.03} />
            </linearGradient>
            {/* Base gradient */}
            <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.blue} stopOpacity={0.2} />
              <stop offset="95%" stopColor={C.blue} stopOpacity={0.03} />
            </linearGradient>
            {/* Bull gradient */}
            <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.green} stopOpacity={0.2} />
              <stop offset="95%" stopColor={C.green} stopOpacity={0.03} />
            </linearGradient>
            {/* Historical gradient */}
            <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.teal} stopOpacity={0.3} />
              <stop offset="95%" stopColor={C.teal} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={C.border}
            opacity={0.4}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: C.muted, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={9}
          />
          <YAxis
            tick={{ fill: C.muted, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(v) => `$${v}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Historical price */}
          <Area
            type="monotone"
            dataKey="historical"
            stroke={C.teal}
            strokeWidth={2}
            fill="url(#histGrad)"
            dot={false}
            connectNulls={false}
          />

          {/* Bull outer band (rendered first = bottom layer) */}
          <Area
            type="monotone"
            dataKey="bullP90"
            stroke={C.green}
            strokeWidth={0.5}
            strokeOpacity={0.4}
            fill={C.green}
            fillOpacity={0.08}
            dot={false}
            connectNulls
          />
          {/* Bull inner band */}
          <Area
            type="monotone"
            dataKey="bullP75"
            stroke="none"
            fill={C.green}
            fillOpacity={0.12}
            dot={false}
            connectNulls
          />
          {/* Bull median */}
          <Line
            type="monotone"
            dataKey="bullP50"
            stroke={C.green}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="bullP25"
            stroke="none"
            fill={C.bg}
            fillOpacity={0.15}
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="bullP10"
            stroke={C.green}
            strokeWidth={0.5}
            strokeOpacity={0.3}
            fill={C.bg}
            fillOpacity={0.1}
            dot={false}
            connectNulls
          />

          {/* Base band (middle layer) */}
          <Area
            type="monotone"
            dataKey="baseP90"
            stroke={C.blue}
            strokeWidth={0.5}
            strokeOpacity={0.4}
            fill={C.blue}
            fillOpacity={0.1}
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="baseP75"
            stroke="none"
            fill={C.blue}
            fillOpacity={0.1}
            dot={false}
            connectNulls
          />
          {/* Base median */}
          <Line
            type="monotone"
            dataKey="baseP50"
            stroke={C.blue}
            strokeWidth={2.5}
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="baseP25"
            stroke="none"
            fill={C.bg}
            fillOpacity={0.08}
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="baseP10"
            stroke={C.blue}
            strokeWidth={0.5}
            strokeOpacity={0.3}
            fill={C.bg}
            fillOpacity={0.05}
            dot={false}
            connectNulls
          />

          {/* Bear bands (top layer — most visible) */}
          <Area
            type="monotone"
            dataKey="bearP90"
            stroke={C.red}
            strokeWidth={0.5}
            strokeOpacity={0.5}
            fill={C.red}
            fillOpacity={0.08}
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="bearP75"
            stroke="none"
            fill={C.red}
            fillOpacity={0.08}
            dot={false}
            connectNulls
          />
          {/* Bear median */}
          <Line
            type="monotone"
            dataKey="bearP50"
            stroke={C.red}
            strokeWidth={2}
            dot={false}
            connectNulls
            strokeDasharray="5 3"
          />
          <Area
            type="monotone"
            dataKey="bearP25"
            stroke="none"
            fill={C.red}
            fillOpacity={0.03}
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="bearP10"
            stroke={C.red}
            strokeWidth={0.5}
            strokeOpacity={0.3}
            fill="none"
            dot={false}
            connectNulls
          />

          {/* Now reference line */}
          <ReferenceLine
            x="Now"
            stroke={C.amber}
            strokeDasharray="4 2"
            strokeWidth={1.5}
            label={{
              value: "Today",
              position: "insideTopLeft",
              fill: C.amber,
              fontSize: 10,
            }}
          />
          {/* Current price */}
          <ReferenceLine
            y={358.29}
            stroke={C.teal}
            strokeDasharray="2 4"
            strokeWidth={1}
            label={{
              value: "$358.29",
              position: "insideTopRight",
              fill: C.teal,
              fontSize: 9,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 justify-end">
        <span className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
          <span className="w-6 h-px inline-block" style={{ background: C.teal, height: 2 }} />
          Historical Price
        </span>
        {show.bear && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: C.red }}>
            <span className="w-6 inline-block" style={{ borderTop: `2px dashed ${C.red}` }} />
            Bear (p10–p90)
          </span>
        )}
        {show.base && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: C.blue }}>
            <span className="w-6 h-0.5 inline-block" style={{ background: C.blue }} />
            Base (p10–p90)
          </span>
        )}
        {show.bull && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: C.green }}>
            <span className="w-6 h-0.5 inline-block" style={{ background: C.green }} />
            Bull (p10–p90)
          </span>
        )}
      </div>
    </div>
  );
}

// ── Thermometer ───────────────────────────────────────────────────────────────
function PriceThermometer() {
  const bearTarget = 220;
  const bullTarget = 520;
  const current = TER_DATA.price;
  const pct = ((current - bearTarget) / (bullTarget - bearTarget)) * 100;

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs mb-1" style={{ color: C.muted }}>
        <span style={{ color: C.red }}>Bear $220</span>
        <span style={{ color: C.text }}>Current ${current}</span>
        <span style={{ color: C.green }}>Bull $520</span>
      </div>
      <div
        className="relative h-3 rounded-full overflow-hidden"
        style={{ background: `linear-gradient(to right, ${C.red}, ${C.amber}, ${C.green})` }}
      >
        <div
          className="absolute top-0 w-0.5 h-full"
          style={{ left: `${pct}%`, background: "white", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
        <span>Downside −38.6%</span>
        <span style={{ color: C.teal, fontWeight: 600 }}>
          {pct.toFixed(0)}th percentile of range
        </span>
        <span>Upside +45.2%</span>
      </div>
    </div>
  );
}

// ── Segment Revenue Chart ─────────────────────────────────────────────────────
function SegmentChart() {
  const segs = [
    {
      name: "Semi Test",
      revenue: 883.5,
      growth: 57.6,
      margin: 33.7,
      color: C.teal,
      note: "Core engine",
    },
    {
      name: "Robotics",
      revenue: 89.4,
      growth: -9.1,
      margin: -29.1,
      color: C.amber,
      note: "Hidden option",
    },
    {
      name: "Product Test",
      revenue: 110.5,
      growth: 17.7,
      margin: 18.6,
      color: C.purple,
      note: "Stable base",
    },
  ];

  const donutData = segs.map((s) => ({ name: s.name, value: s.revenue, color: s.color }));

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (value < 100) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600">
        ${value}M
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut */}
      <div
        className="rounded-xl p-5"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: C.text }}>
          Revenue Mix (FY2025 Q4)
        </h3>
        <p className="text-xs mb-4" style={{ color: C.muted }}>
          Total $1,083.4M · Semi Test dominates at 81.6%
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
            >
              {donutData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              formatter={(value) => (
                <span style={{ color: C.muted, fontSize: 11 }}>{value}</span>
              )}
            />
            <Tooltip
              formatter={(v: any) => [`$${v}M`, ""]}
              contentStyle={{ background: "#1a2640", border: `1px solid ${C.border}`, fontSize: 12 }}
              labelStyle={{ color: C.text }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar + metrics */}
      <div
        className="rounded-xl p-5"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: C.text }}>
          Segment YoY Growth & Margins
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={segs} barSize={32} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} opacity={0.4} />
            <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              formatter={(v: any) => [`${v}%`, "Growth"]}
              contentStyle={{ background: "#1a2640", border: `1px solid ${C.border}`, fontSize: 12 }}
            />
            <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
              {segs.map((s, i) => (
                <Cell key={i} fill={s.growth < 0 ? C.red : s.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="space-y-2 mt-4">
          {segs.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-xs flex-1" style={{ color: C.text }}>
                {s.name}
              </span>
              <span
                className="text-xs tabular px-1.5 py-0.5 rounded"
                style={{
                  background: s.growth < 0 ? "rgba(239,68,68,0.1)" : "rgba(20,184,166,0.1)",
                  color: s.growth < 0 ? C.red : C.teal,
                }}
              >
                {s.growth > 0 ? "+" : ""}
                {s.growth}% YoY
              </span>
              <span
                className="text-xs tabular px-1.5 py-0.5 rounded"
                style={{
                  background: s.margin < 0 ? "rgba(239,68,68,0.08)" : "rgba(20,184,166,0.08)",
                  color: s.margin < 0 ? C.red : C.muted,
                }}
              >
                {s.margin > 0 ? "+" : ""}
                {s.margin}% EBT
              </span>
              <span className="text-xs italic" style={{ color: C.muted }}>
                {s.note}
              </span>
            </div>
          ))}
        </div>
        <div
          className="mt-4 p-3 rounded-lg text-xs"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: `1px solid rgba(245,158,11,0.25)`,
            color: C.amber,
          }}
        >
          <strong>Hidden Option:</strong> Robotics losing $26M/qtr but strategically positioned for NVIDIA-powered Cognitive Cobots. Market implies <em>negative</em> value today.
        </div>
      </div>
    </div>
  );
}

// ── Scenario Table ─────────────────────────────────────────────────────────────
function ScenarioTable() {
  const s = TER_DATA.scenarios;
  const cols = [
    { key: "bear" as const, label: "Bear Case", color: C.red, bg: "rgba(239,68,68,0.06)" },
    { key: "base" as const, label: "Base Case", color: C.blue, bg: "rgba(59,130,246,0.06)" },
    { key: "bull" as const, label: "Bull Case", color: C.green, bg: "rgba(34,197,94,0.06)" },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.border}` }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: C.card }}>
            <th
              className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: C.muted, width: "20%" }}
            >
              Metric
            </th>
            {cols.map((c) => (
              <th
                key={c.key}
                className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider"
                style={{ background: c.bg, color: c.color }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            {
              label: "12M Target Price",
              render: (k: keyof typeof s) => (
                <span className="text-base font-bold tabular" style={{ color: { bear: C.red, base: C.blue, bull: C.green }[k] }}>
                  ${s[k].target}
                </span>
              ),
            },
            {
              label: "Upside / Downside",
              render: (k: keyof typeof s) => (
                <span
                  className="inline-flex items-center gap-1 tabular font-semibold"
                  style={{ color: s[k].upside < 0 ? C.red : C.green }}
                >
                  {s[k].upside > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {s[k].upside > 0 ? "+" : ""}{s[k].upside}%
                </span>
              ),
            },
            {
              label: "P/E Exit Multiple",
              render: (k: keyof typeof s) => (
                <span className="tabular font-medium" style={{ color: C.text }}>
                  {s[k].pe_exit}x
                </span>
              ),
            },
            {
              label: "Revenue 2027E",
              render: (k: keyof typeof s) => (
                <span className="tabular" style={{ color: C.text }}>
                  ${(s[k].revenue_2027 / 1000).toFixed(1)}B
                </span>
              ),
            },
            {
              label: "Key Assumptions",
              render: (k: keyof typeof s) => (
                <ul className="text-left space-y-1">
                  {s[k].assumptions.map((a, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: C.muted }}>
                      <span style={{ color: { bear: C.red, base: C.blue, bull: C.green }[k], marginTop: 2 }}>›</span>
                      {a}
                    </li>
                  ))}
                </ul>
              ),
            },
          ].map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderTop: `1px solid ${C.border}`,
                background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}
            >
              <td className="px-4 py-3 text-xs font-medium" style={{ color: C.muted }}>
                {row.label}
              </td>
              {cols.map((c) => (
                <td
                  key={c.key}
                  className="px-4 py-3 text-center"
                  style={{ background: ri > 0 ? "transparent" : c.bg }}
                >
                  {row.render(c.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Financial Tables ──────────────────────────────────────────────────────────
function FinancialTables() {
  const [tab, setTab] = useState<"income" | "cashflow">("income");
  const f = TER_DATA.financials;
  const cf = TER_DATA.cash_flow;

  const years = ["FY2023", "FY2024", "FY2025"];

  const growthArrow = (curr: number, prev: number) => {
    const pct = ((curr - prev) / Math.abs(prev)) * 100;
    const up = pct > 0;
    return (
      <span
        className="inline-flex items-center gap-0.5 text-xs ml-1"
        style={{ color: up ? C.teal : C.red }}
      >
        {up ? "▲" : "▼"} {Math.abs(pct).toFixed(0)}%
      </span>
    );
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${C.border}` }}
    >
      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: C.border, background: C.card }}
      >
        {(["income", "cashflow"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{
              color: tab === t ? C.teal : C.muted,
              borderBottom: tab === t ? `2px solid ${C.teal}` : "2px solid transparent",
              background: "transparent",
            }}
          >
            {t === "income" ? "Income Statement" : "Cash Flow"}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: C.card }}>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted, width: "35%" }}>
              Metric (USD M)
            </th>
            {years.map((y) => (
              <th key={y} className="px-4 py-2 text-center text-xs font-bold" style={{ color: C.text }}>
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
            {(tab === "income"
            ? [
                { label: "Revenue", vals: [f.fy2023.revenue, f.fy2024.revenue, f.fy2025.revenue], bold: true },
                { label: "Gross Profit", vals: [f.fy2023.gross_profit, f.fy2024.gross_profit, f.fy2025.gross_profit] },
                { label: "Gross Margin", vals: [f.fy2023.gross_margin, f.fy2024.gross_margin, f.fy2025.gross_margin], suffix: "%" },
                { label: "Operating Income", vals: [f.fy2023.operating_income, f.fy2024.operating_income, f.fy2025.operating_income] },
                { label: "Op Margin", vals: [f.fy2023.op_margin, f.fy2024.op_margin, f.fy2025.op_margin], suffix: "%" },
                { label: "Net Income", vals: [f.fy2023.net_income, f.fy2024.net_income, f.fy2025.net_income] },
                { label: "EPS (diluted)", vals: [f.fy2023.eps, f.fy2024.eps, f.fy2025.eps], prefix: "$", dec: 2 },
              ] as Array<{label:string;vals:number[];bold?:boolean;highlight?:boolean;suffix?:string;prefix?:string;dec?:number}>
            : [
                { label: "Operating CF", vals: [cf.fy2023.operating, cf.fy2024.operating, cf.fy2025.operating], bold: true },
                { label: "Capital Expenditure", vals: [cf.fy2023.capex, cf.fy2024.capex, cf.fy2025.capex] },
                { label: "Free Cash Flow", vals: [cf.fy2023.fcf, cf.fy2024.fcf, cf.fy2025.fcf], highlight: true },
                { label: "FCF Margin", vals: [
                    ((cf.fy2023.fcf / f.fy2023.revenue) * 100),
                    ((cf.fy2024.fcf / f.fy2024.revenue) * 100),
                    ((cf.fy2025.fcf / f.fy2025.revenue) * 100),
                  ], suffix: "%" },
              ] as Array<{label:string;vals:number[];bold?:boolean;highlight?:boolean;suffix?:string;prefix?:string;dec?:number}>
          ).map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderTop: `1px solid ${C.border}`,
                background: (row as any).highlight ? "rgba(20,184,166,0.04)" : ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}
            >
              <td
                className="px-4 py-2.5 text-xs"
                style={{
                  color: (row as any).bold ? C.text : C.muted,
                  fontWeight: (row as any).bold ? 600 : 400,
                }}
              >
                {row.label}
              </td>
              {row.vals.map((v, vi) => {
                const prev = vi > 0 ? row.vals[vi - 1] : null;
                const isNeg = v < 0;
                return (
                  <td key={vi} className="px-4 py-2.5 text-center text-xs tabular" style={{ color: (row as any).highlight ? C.teal : isNeg ? C.red : C.text }}>
                    {(row as any).prefix || ""}{Math.abs(v).toFixed((row as any).dec ?? 0)}{(row as any).suffix || ""}
                    {prev !== null && !((row as any).suffix === "%") && growthArrow(v, prev)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Peer Comparison ────────────────────────────────────────────────────────────
function PeerComparison() {
  const peers = [
    {
      ...TER_DATA.peers[0],
      ticker: "KLAC",
      isTer: false,
    },
    { ...TER_DATA.peers[1], isTer: false },
    { ...TER_DATA.peers[2], isTer: false },
    { ...TER_DATA.peers[3], isTer: false },
    { ...TER_DATA.peers[4], isTer: false },
    {
      ticker: "TER",
      name: "Teradyne",
      price: TER_DATA.price,
      pe: TER_DATA.pe,
      revenue_growth: 13.1,
      gross_margin: 58.3,
      market_cap: TER_DATA.marketCap,
      isTer: true,
    },
  ].sort((a, b) => b.revenue_growth - a.revenue_growth);

  const scatterData = peers.map((p) => ({
    name: p.ticker,
    x: p.revenue_growth,
    y: p.pe,
    isTer: p.isTer,
  }));

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={payload.isTer ? 8 : 5}
          fill={payload.isTer ? C.teal : C.slate600}
          stroke={payload.isTer ? "white" : "none"}
          strokeWidth={1.5}
          opacity={0.9}
        />
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fill={payload.isTer ? C.teal : C.muted}
          fontSize="10"
          fontWeight={payload.isTer ? 700 : 400}
        >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${C.border}` }}
      >
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: C.card }}>
              {["Ticker", "Company", "Price", "P/E", "Rev Gth", "Gross Mgn", "Mkt Cap"].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider" style={{ color: C.muted }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {peers.map((p) => (
              <tr
                key={p.ticker}
                style={{
                  borderTop: `1px solid ${C.border}`,
                  background: p.isTer ? "rgba(20,184,166,0.08)" : "transparent",
                }}
              >
                <td className="px-3 py-2 font-bold tabular" style={{ color: p.isTer ? C.teal : C.text }}>
                  {p.ticker}
                  {p.isTer && (
                    <span className="ml-1 text-xs px-1 py-0.5 rounded" style={{ background: "rgba(20,184,166,0.2)", color: C.teal }}>
                      ←
                    </span>
                  )}
                </td>
                <td className="px-3 py-2" style={{ color: C.muted }}>{p.name}</td>
                <td className="px-3 py-2 tabular" style={{ color: C.text }}>${p.price.toFixed(2)}</td>
                <td
                  className="px-3 py-2 tabular font-medium"
                  style={{ color: p.pe > 60 ? C.amber : C.text }}
                >
                  {p.pe}x
                </td>
                <td
                  className="px-3 py-2 tabular"
                  style={{ color: p.revenue_growth > 30 ? C.teal : C.text }}
                >
                  +{p.revenue_growth}%
                </td>
                <td className="px-3 py-2 tabular" style={{ color: C.text }}>
                  {p.gross_margin}%
                </td>
                <td className="px-3 py-2 tabular" style={{ color: C.muted }}>
                  ${p.market_cap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scatter */}
      <div
        className="rounded-xl p-5"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: C.text }}>
          P/E vs Revenue Growth
        </h3>
        <p className="text-xs mb-4" style={{ color: C.muted }}>
          TER: premium multiple reflects AI test exposure + robotics optionality
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} opacity={0.4} />
            <XAxis
              dataKey="x"
              type="number"
              name="Revenue Growth"
              tick={{ fill: C.muted, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              label={{ value: "Revenue Growth %", position: "insideBottom", offset: -10, fill: C.muted, fontSize: 10 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              dataKey="y"
              type="number"
              name="P/E"
              tick={{ fill: C.muted, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}x`}
              width={40}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: C.border }}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded p-2 text-xs" style={{ background: "#1a2640", border: `1px solid ${C.border}` }}>
                    <p style={{ color: d.isTer ? C.teal : C.text, fontWeight: 600 }}>{d.name}</p>
                    <p style={{ color: C.muted }}>P/E: {d.y}x</p>
                    <p style={{ color: C.muted }}>Rev Growth: +{d.x}%</p>
                  </div>
                );
              }}
            />
            <Scatter data={scatterData} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Model Council Consensus ───────────────────────────────────────────────────
function ModelCouncilConsensus() {
  const agreements = [
    "AI drove 60%+ of Q4 revenue, 70%+ expected Q1",
    "ATE TAM growing to $12-14B; TER targets $6B revenue, $9.50-$11 EPS",
    "103x TTM P/E is extreme, stock above analyst targets",
    "Robotics lost ~$99M in FY2025, still a drag",
    "Semi test duopoly with Advantest (~80% combined share) = strong moat",
    "Compute became largest SoC component (50%, up from 10% in 2023)",
    "Revenue mix shift from mobile to AI compute de-risks the business",
  ];

  const modelViews = [
    {
      model: "Claude Opus",
      color: "#F97316",
      robotics: "Break-even late 2027/early 2028. Not a 2026 earnings catalyst. 400 employees cut (24%).",
      valuation: "$245-$293 (SOTP)",
      framework: "Semi test at 30-35x FY2026 EPS + robotics at 2-3x revenue",
      unique: [
        "IST/SLT is the hidden growth engine — grew >50% in FY2025",
        "Customer concentration risk: 19% from one specifying customer",
        "Stock is 440%+ above its 52-week low",
      ],
    },
    {
      model: "GPT-5.4",
      color: "#22D3EE",
      robotics: "Partnership strategy (Honeywell, ADI, Siemens) is the path. Higher-value solutions through strong partners.",
      valuation: "Expensive but normalizing",
      framework: "Forward P/E of 50x on FY2026, 33x on FY2027",
      unique: [
        "UR AI Trainer launched with Scale AI at GTC 2026",
        "MiR1200 pallet jack + MC600 mobile cobot new products",
        "Q2 2025 goodwill impairment test triggered (no impairment)",
      ],
    },
    {
      model: "Gemini 3.1 Pro",
      color: "#818CF8",
      robotics: "Amazon \"Vulcan\" using UR limbs could be worth $400M+. E-commerce ramp expected to triple in FY2026.",
      valuation: "DCF fair value ~$172",
      framework: "Simply Wall St suggests 72% overvaluation; SOTP needed",
      unique: [
        "Amazon \"Vulcan\" deal: 80% of 14B manually stowed items",
        "$405M in recurring software/services revenue",
        "75,000+ UR installed base with 120+ training hubs",
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div
        className="rounded-xl p-6"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-start gap-4 mb-5">
          <div
            className="p-2.5 rounded-lg"
            style={{ background: "rgba(168,85,247,0.12)" }}
          >
            <Brain size={20} style={{ color: C.purple }} />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: C.text }}>
              AI Model Council: 3 Frontier Models Independently Analyzed TER
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              {modelViews.map((m) => (
                <span
                  key={m.model}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: `${m.color}15`, color: m.color, border: `1px solid ${m.color}30` }}
                >
                  {m.model}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Agreement Table */}
        <div className="mb-6">
          <h4
            className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: C.green }}
          >
            <CheckCircle size={12} />
            Full Agreement — All 3 Models Converge ({agreements.length} Findings)
          </h4>
          <div className="space-y-2">
            {agreements.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2.5 rounded-lg"
                style={{ background: "rgba(34,197,94,0.05)", border: `1px solid rgba(34,197,94,0.1)` }}
              >
                <CheckCircle size={14} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
                <span className="text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>
                  {a}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Robotics Timeline Comparison */}
        <div className="mb-6">
          <h4
            className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: C.amber }}
          >
            <AlertTriangle size={12} />
            Key Disagreement — Robotics Profitability Timeline
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {modelViews.map((m) => (
              <div
                key={m.model}
                className="rounded-lg p-4"
                style={{ background: `${m.color}08`, border: `1px solid ${m.color}20` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: m.color }}
                  />
                  <span className="text-xs font-bold" style={{ color: m.color }}>
                    {m.model}
                  </span>
                </div>
                <p className="text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>
                  {m.robotics}
                </p>
                <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${m.color}15` }}>
                  <p className="text-xs" style={{ color: C.muted }}>
                    <span className="font-semibold" style={{ color: C.text }}>Valuation:</span>{" "}
                    {m.valuation}
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>
                    {m.framework}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Insights */}
        <div>
          <h4
            className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: C.teal }}
          >
            <Zap size={12} />
            Unique Insights — Only One Model Found
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {modelViews.map((m) => (
              <div key={m.model} className="space-y-2">
                <span
                  className="text-xs font-bold inline-flex items-center gap-1.5 px-2 py-0.5 rounded"
                  style={{ background: `${m.color}15`, color: m.color }}
                >
                  {m.model}
                </span>
                {m.unique.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs"
                    style={{ color: C.muted }}
                  >
                    <ChevronRight size={10} style={{ color: m.color, flexShrink: 0, marginTop: 3 }} />
                    <span style={{ lineHeight: 1.6 }}>{u}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Management Quotes ─────────────────────────────────────────────────────────
function ManagementQuotes() {
  const quotes = [
    {
      text: "AI demand drove more than 60% of Q4 revenue... upwards of 70% in Q1 2026",
      author: "Greg Smith",
      title: "CEO, Teradyne",
      context: "Q4 2025 Earnings Call",
    },
    {
      text: "We are in play for a share of merchant GPU",
      author: "Greg Smith",
      title: "CEO, Teradyne",
      context: "Q4 2025 Earnings Call",
    },
    {
      text: "Compute revenue grew 90% year over year... now the largest component of SoC revenue",
      author: "Greg Smith",
      title: "CEO, Teradyne",
      context: "Q4 2025 Earnings Call",
    },
    {
      text: "We foresee a future where the ATE TAM will be $12B-$14B... Teradyne will deliver nearly 2x revenue and 2.5x EPS",
      author: "Greg Smith",
      title: "CEO, Teradyne",
      context: "Q4 2025 Earnings Call",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quotes.map((q, i) => (
        <div
          key={i}
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #111827 0%, #0B1220 100%)",
            border: `1px solid ${C.border}`,
          }}
        >
          {/* Large decorative quote mark */}
          <div
            className="absolute top-3 left-4 text-5xl font-serif leading-none select-none"
            style={{ color: C.teal, opacity: 0.12 }}
          >
            \u201C
          </div>
          <div className="relative z-10">
            <p
              className="text-sm font-medium italic"
              style={{ color: C.text, lineHeight: 1.7, paddingLeft: 12 }}
            >
              "{q.text}"
            </p>
            <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(20,184,166,0.15)", color: C.teal }}
              >
                {q.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: C.text }}>
                  {q.author}
                </p>
                <p className="text-xs" style={{ color: C.muted }}>
                  {q.title} · {q.context}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Insider & Institutional Activity ──────────────────────────────────────────
function InsiderInstitutional() {
  const insiderTransactions = [
    { type: "Tax Withholding", count: 48, note: "Routine F-INKIND on vesting" },
    { type: "Equity Award", name: "Michelle Turner (New CFO)", shares: "20,300", value: "$1.86M", color: C.teal },
    { type: "Sale", name: "Mercedes Johnson", shares: "625", value: "$195K", price: "$312.20", color: C.amber },
  ];

  const institutions = [
    { name: "Vanguard", shares: "20.3M", value: "$3.93B", change: -5.2, color: C.red },
    { name: "BlackRock", shares: "15.4M", value: "$2.98B", change: 5.3, color: C.teal, highlight: true },
    { name: "State Street", shares: "7.1M", value: "$1.37B", change: 0.9, color: C.teal },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Insider Activity */}
      <div
        className="rounded-xl p-5"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} style={{ color: C.teal }} />
          <h3 className="text-sm font-semibold" style={{ color: C.text }}>
            Insider Activity
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(100,116,139,0.15)", color: C.muted }}>
            Last 6 Months
          </span>
        </div>

        <div className="space-y-3">
          {/* Summary stat */}
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ background: "rgba(100,116,139,0.06)", border: `1px solid ${C.border}` }}
          >
            <span className="text-xs" style={{ color: C.muted }}>Total Transactions</span>
            <span className="text-sm font-bold tabular" style={{ color: C.text }}>50</span>
          </div>

          {insiderTransactions.map((t, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{ background: "rgba(100,116,139,0.04)", border: `1px solid ${C.border}` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: t.color ? `${t.color}15` : "rgba(100,116,139,0.1)",
                    color: t.color || C.muted,
                  }}
                >
                  {t.type}
                </span>
                {t.value && (
                  <span className="text-xs font-bold tabular" style={{ color: C.text }}>
                    {t.value}
                  </span>
                )}
              </div>
              {t.name && (
                <p className="text-xs mt-1" style={{ color: C.muted }}>
                  {t.name}{t.shares && ` · ${t.shares} shares`}{t.price && ` @ ${t.price}`}
                </p>
              )}
              {t.count && (
                <p className="text-xs mt-1" style={{ color: C.muted }}>
                  {t.count} transactions · {t.note}
                </p>
              )}
            </div>
          ))}

          {/* Verdict */}
          <div
            className="p-3 rounded-lg text-xs flex items-start gap-2"
            style={{ background: "rgba(59,130,246,0.06)", border: `1px solid rgba(59,130,246,0.15)`, color: C.blue }}
          >
            <Shield size={12} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              <strong>Verdict: Neutral</strong> — No panic selling, new CFO aligned with $1.86M equity
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Holders */}
      <div
        className="rounded-xl p-5"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={14} style={{ color: C.teal }} />
          <h3 className="text-sm font-semibold" style={{ color: C.text }}>
            Top Institutional Holders
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(100,116,139,0.15)", color: C.muted }}>
            1,100 Institutions
          </span>
        </div>

        <div className="space-y-3">
          {institutions.map((inst, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{
                background: inst.highlight ? "rgba(20,184,166,0.06)" : "rgba(100,116,139,0.04)",
                border: `1px solid ${inst.highlight ? "rgba(20,184,166,0.2)" : C.border}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold" style={{ color: inst.highlight ? C.teal : C.text }}>
                    {inst.name}
                  </span>
                  {inst.highlight && (
                    <span
                      className="ml-2 text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(20,184,166,0.15)", color: C.teal }}
                    >
                      Accumulating
                    </span>
                  )}
                </div>
                <span
                  className="text-xs font-bold tabular flex items-center gap-1"
                  style={{ color: inst.change > 0 ? C.teal : C.red }}
                >
                  {inst.change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {inst.change > 0 ? "+" : ""}{inst.change}% QoQ
                </span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs tabular" style={{ color: C.muted }}>
                  {inst.shares} shares
                </span>
                <span className="text-xs tabular" style={{ color: C.muted }}>
                  {inst.value}
                </span>
              </div>
            </div>
          ))}

          {/* Verdict */}
          <div
            className="p-3 rounded-lg text-xs flex items-start gap-2"
            style={{ background: "rgba(20,184,166,0.06)", border: `1px solid rgba(20,184,166,0.15)`, color: C.teal }}
          >
            <TrendingUp size={12} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              <strong>Signal: BlackRock accumulating (+5.3% QoQ)</strong> while Vanguard rebalanced. Net positive for institutional conviction.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Academic & Market Research ────────────────────────────────────────────────
function AcademicResearch() {
  const academicSources = [
    {
      finding: "Cobot market share projected to grow from 3% to 34% of all robot sales",
      source: "Kakade et al., 2023",
      type: "Peer-Reviewed",
    },
    {
      finding: "Cobot ROI: 1 year 9 months in engine assembly applications",
      source: "Martin et al., 2025",
      type: "Case Study",
    },
    {
      finding: "75,000+ UR installed base creates ecosystem lock-in with 120+ global training hubs",
      source: "Industry Analysis",
      type: "Market Intel",
    },
    {
      finding: "Programming complexity for non-technical operators remains key adoption barrier",
      source: "Scite.ai Synthesis",
      type: "Research Gap",
    },
  ];

  const marketData = [
    { metric: "Global Cobot Market", from: "$475M (2020)", to: "$8B (2030)", cagr: "33%", highlight: true },
    { metric: "Cobot End-Effector Market", from: "$898M (2021)", to: "$2.7B (2030)", cagr: "13%", highlight: false },
    { metric: "Indoor Robots Market", from: "—", to: "$50.5B (2026)", cagr: "—", highlight: false },
  ];

  const industries = [
    { name: "Electronics", pct: 34, color: C.teal },
    { name: "Automotive", pct: 16, color: C.blue },
    { name: "Material Handling", pct: 14, color: C.purple },
    { name: "Other", pct: 36, color: C.slate600 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Academic Sources */}
      <div
        className="rounded-xl p-5"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={14} style={{ color: C.purple }} />
          <h3 className="text-sm font-semibold" style={{ color: C.text }}>
            Scite.ai Academic Sources
          </h3>
        </div>

        <div className="space-y-3">
          {academicSources.map((s, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{ background: "rgba(168,85,247,0.04)", border: `1px solid rgba(168,85,247,0.12)` }}
            >
              <div className="flex items-start gap-2">
                <BookOpen size={12} style={{ color: C.purple, flexShrink: 0, marginTop: 3 }} />
                <div>
                  <p className="text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>
                    "{s.finding}"
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-medium" style={{ color: C.purple }}>
                      {s.source}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(168,85,247,0.1)", color: C.purple }}
                    >
                      {s.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statista Market Data */}
      <div
        className="rounded-xl p-5"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={14} style={{ color: C.teal }} />
          <h3 className="text-sm font-semibold" style={{ color: C.text }}>
            Statista Market Data
          </h3>
        </div>

        <div className="space-y-3 mb-5">
          {marketData.map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{
                background: m.highlight ? "rgba(20,184,166,0.06)" : "rgba(100,116,139,0.04)",
                border: `1px solid ${m.highlight ? "rgba(20,184,166,0.15)" : C.border}`,
              }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: m.highlight ? C.teal : C.text }}>
                {m.metric}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs tabular" style={{ color: C.muted }}>{m.from}</span>
                <ChevronRight size={10} style={{ color: C.muted }} />
                <span className="text-xs tabular font-semibold" style={{ color: C.text }}>{m.to}</span>
                {m.cagr !== "—" && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-bold"
                    style={{ background: "rgba(20,184,166,0.12)", color: C.teal }}
                  >
                    {m.cagr} CAGR
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Industry Breakdown */}
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
          Top Industries for Cobots
        </h4>
        <div className="space-y-2">
          {industries.map((ind) => (
            <div key={ind.name} className="flex items-center gap-3">
              <span className="text-xs w-24 flex-shrink-0" style={{ color: C.muted }}>
                {ind.name}
              </span>
              <div className="flex-1 h-5 rounded overflow-hidden" style={{ background: C.border }}>
                <div
                  className="h-full rounded flex items-center pl-2"
                  style={{ width: `${ind.pct}%`, background: `${ind.color}40` }}
                >
                  <span className="text-xs font-bold tabular" style={{ color: ind.color }}>
                    {ind.pct}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const priceChange = TER_DATA.price - TER_DATA.historical_prices[TER_DATA.historical_prices.length - 2];
  const priceChangePct = (priceChange / TER_DATA.historical_prices[TER_DATA.historical_prices.length - 2]) * 100;
  const isPositive = priceChange > 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: C.bg, color: C.text }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 px-6 py-3 flex items-center gap-4 flex-wrap"
        style={{
          background: "rgba(11,18,32,0.95)",
          borderBottom: `1px solid ${C.border}`,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <StockPulseLogo size={28} />
          <span className="font-bold text-sm tracking-tight" style={{ color: C.text }}>
            StockPulse
          </span>
        </div>

        <div className="h-4 w-px" style={{ background: C.border }} />

        {/* Ticker */}
        <div className="flex items-center gap-3">
          <span
            className="font-bold text-base tracking-widest px-2 py-0.5 rounded"
            style={{ background: "rgba(20,184,166,0.15)", color: C.teal }}
          >
            TER
          </span>
          <span className="text-sm" style={{ color: C.muted }}>
            Teradyne, Inc.
          </span>
        </div>

        <div className="h-4 w-px" style={{ background: C.border }} />

        {/* Price */}
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-bold tabular glow-teal"
            style={{ color: C.teal }}
          >
            {fmtPrice(TER_DATA.price)}
          </span>
          <span
            className="flex items-center gap-1 text-sm font-semibold tabular px-2 py-0.5 rounded"
            style={{
              background: isPositive ? "rgba(20,184,166,0.12)" : "rgba(239,68,68,0.12)",
              color: isPositive ? C.teal : C.red,
            }}
          >
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)} ({isPositive ? "+" : ""}
            {priceChangePct.toFixed(2)}%)
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Kronos badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(168,85,247,0.12)",
              border: `1px solid rgba(168,85,247,0.3)`,
              color: C.purple,
            }}
          >
            <Zap size={11} />
            Powered by Kronos AI
          </div>
          {/* Competition badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: `1px solid rgba(245,158,11,0.25)`,
              color: C.amber,
            }}
          >
            <Award size={11} />
            Stock Pitch Competition
          </div>
          {/* GitHub link */}
          <a
            href="https://github.com/lovinta/stockpulse-ter-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.08)", color: C.muted }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Source Code
          </a>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-screen-2xl mx-auto px-6 py-8">

        {/* Section 1: KPI Cards */}
        <Section title="Key Metrics" subtitle="As of latest close">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <KpiCard
              title="Price"
              value="$358.29"
              sub="52W: $86.94–$358.69"
              color={C.teal}
              sparkData={TER_DATA.historical_prices}
            />
            <KpiCard
              title="Market Cap"
              value="$56.0B"
              sub="Fully diluted"
              color={C.text}
              icon={<BarChart2 size={14} />}
            />
            <KpiCard
              title="P/E Ratio"
              value="103.0x"
              sub="Above peer avg (40x)"
              color={C.amber}
              badge="amber"
            />
            <KpiCard
              title="Revenue Growth"
              value="+13.1%"
              sub="FY2025 YoY"
              color={C.teal}
            />
            <KpiCard
              title="Free Cash Flow"
              value="$450M"
              sub="FY2025 (14.1% margin)"
              color={C.teal}
            />
            <KpiCard
              title="Analyst Consensus"
              value="Buy"
              sub="60% Bullish · 12 analysts"
              color={C.green}
              badge="Buy"
            />
          </div>
        </Section>

        {/* Section 2: Kronos Forecast */}
        <Section
          title="Kronos AI Price Forecast"
          subtitle="Monte Carlo · 30 paths/scenario · AAAI 2026"
        >
          <KronosForecastChart />
        </Section>

        {/* Section 3: Investment Thesis */}
        <Section title="Investment Thesis" subtitle="The Gatekeeper of Silicon and Steel">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main thesis card */}
            <div
              className="lg:col-span-3 rounded-xl p-6"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "rgba(20,184,166,0.1)" }}
                >
                  <Target size={18} style={{ color: C.teal }} />
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: C.text }}>
                    {TER_DATA.thesis.headline}
                  </h3>
                  <p className="text-sm mt-1.5 max-w-3xl" style={{ color: C.muted, lineHeight: 1.7 }}>
                    {TER_DATA.thesis.summary}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Catalysts */}
                <div>
                  <h4
                    className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
                    style={{ color: C.teal }}
                  >
                    <TrendingUp size={12} />
                    Catalysts
                  </h4>
                  <ul className="space-y-2.5">
                    {TER_DATA.thesis.catalysts.map((c, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-base">{c.icon}</span>
                        <span className="text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>
                          {c.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div>
                  <h4
                    className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
                    style={{ color: C.red }}
                  >
                    <AlertTriangle size={12} />
                    Key Risks
                  </h4>
                  <ul className="space-y-2.5">
                    {TER_DATA.thesis.risks.map((r, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-base">{r.icon}</span>
                        <span className="text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>
                          {r.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Thermometer */}
              <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <h4
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: C.muted }}
                >
                  Price vs. Scenario Range
                </h4>
                <PriceThermometer />
              </div>
            </div>
          </div>
        </Section>

        {/* Section 4: Model Council Consensus */}
        <Section title="Model Council Consensus" subtitle="3 Frontier Models · Independent Analysis">
          <ModelCouncilConsensus />
        </Section>

        {/* Section 5: Management Quotes */}
        <Section title="Management Quotes" subtitle="Q4 2025 Earnings Call · CEO Greg Smith">
          <ManagementQuotes />
        </Section>

        {/* Section 6: Segment Revenue */}
        <Section title="Segment Analysis" subtitle="Q4 FY2025 · $1,083.4M Total">
          <SegmentChart />
        </Section>

        {/* Section 5: Scenario Table */}
        <Section title="Scenario Analysis" subtitle="Bear / Base / Bull · 12-Month Targets">
          <ScenarioTable />
        </Section>

        {/* Section 8: Financial Tables */}
        <Section title="Financial Summary" subtitle="FY2023–FY2025 · USD Millions">
          <FinancialTables />
        </Section>

        {/* Section 9: Insider & Institutional Activity */}
        <Section title="Insider & Institutional Activity" subtitle="Last 6 Months · Ownership Intelligence">
          <InsiderInstitutional />
        </Section>

        {/* Section 10: Peer Comparison */}
        <Section title="Peer Comparison" subtitle="Semiconductor Test & Adjacent Equipment">
          <PeerComparison />
        </Section>

        {/* Section 11: Academic & Market Research */}
        <Section title="Academic & Market Research" subtitle="Scite.ai · Statista · Cobot Industry Data">
          <AcademicResearch />
        </Section>

        {/* Section 12: Methodology & Disclosures */}
        <section
          className="mt-8 rounded-xl p-6"
          style={{
            background: "rgba(20,184,166,0.03)",
            border: `1px solid rgba(20,184,166,0.12)`,
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <Info size={14} style={{ color: C.teal, marginTop: 1 }} />
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.teal }}>
              Methodology & Disclosures
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs" style={{ color: C.muted }}>
            <div>
              <p className="font-semibold mb-1" style={{ color: C.text }}>Kronos Foundation Model</p>
              <p>Price forecasts generated using Kronos Foundation Model (AAAI 2026). Monte Carlo simulation with 30 paths per scenario, 252 trading-day horizon, 5-day sampling interval.</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: C.text }}>Data Sources</p>
              <p>Financial data sourced from Perplexity Finance. Peer data as of latest available. Segment data from Teradyne Q4 FY2025 earnings.</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: C.text }}>Competition Disclaimer</p>
              <p>Prepared for Stock Pitch Competition judged by Philippe Laffont (Coatue), Dan Loeb (Third Point), Ken Hao (Silver Lake), and David Tepper (Appaloosa). Not investment advice.</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: C.text }}>Risk Disclosure</p>
              <p>Past performance does not guarantee future results. All scenario targets are probabilistic and subject to material uncertainty. Investors should conduct independent due diligence.</p>
            </div>
          </div>
        </section>

        {/* Section 13: Perplexity Computer Features Used */}
        <section
          className="mt-6 rounded-xl p-6"
          style={{
            background: "rgba(168,85,247,0.03)",
            border: `1px solid rgba(168,85,247,0.12)`,
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <Cpu size={14} style={{ color: C.purple, marginTop: 1 }} />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.purple }}>
                Perplexity Computer Features Used
              </h3>
              <p className="text-xs mt-1" style={{ color: C.muted }}>
                22 integrated capabilities powered this analysis
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Web Search", icon: "\uD83C\uDF10" },
              { label: "Finance Quotes", icon: "\uD83D\uDCB0" },
              { label: "Financials", icon: "\uD83D\uDCC8" },
              { label: "Segments", icon: "\uD83E\uDDE9" },
              { label: "Estimates", icon: "\uD83C\uDFAF" },
              { label: "Analyst Research", icon: "\uD83D\uDD0D" },
              { label: "Earnings Transcripts", icon: "\uD83C\uDFA4" },
              { label: "Insider Transactions", icon: "\uD83D\uDC65" },
              { label: "Institutional Holders", icon: "\uD83C\uDFE6" },
              { label: "Politician Holdings", icon: "\uD83C\uDFDB\uFE0F" },
              { label: "Scite.ai Academic", icon: "\uD83C\uDF93" },
              { label: "Statista Market Data", icon: "\uD83D\uDCCA" },
              { label: "Model Council (3 Models)", icon: "\uD83E\uDDE0" },
              { label: "Website Building", icon: "\uD83C\uDF10" },
              { label: "PPTX Generation", icon: "\uD83D\uDCBB" },
              { label: "Video Editing", icon: "\uD83C\uDFA5" },
              { label: "GitHub Deployment", icon: "\uD83D\uDCE6" },
              { label: "Cron Monitoring", icon: "\u23F0" },
              { label: "Ticker Sentiment", icon: "\uD83D\uDCCA" },
              { label: "Custom Skill Creation", icon: "\uD83E\uDDE9" },
              { label: "Subagent Orchestration", icon: "\u2699\uFE0F" },
            ].map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(168,85,247,0.08)",
                  border: `1px solid rgba(168,85,247,0.18)`,
                  color: C.purple,
                }}
              >
                <span>{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 pb-8 flex items-center justify-between text-xs" style={{ color: C.muted }}>
          <div className="flex items-center gap-2">
            <StockPulseLogo size={16} />
            <span>StockPulse · Powered by Kronos AI · 22 Perplexity Computer Capabilities</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/TER_Executive_Summary.pdf" target="_blank" className="underline" style={{color: C.teal}}>📄 Executive Summary</a>
            <a href="https://github.com/lovinta/stockpulse-ter-dashboard" target="_blank" className="underline" style={{color: C.muted}}>GitHub</a>
            <span>TER · Teradyne, Inc. · NASDAQ · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
