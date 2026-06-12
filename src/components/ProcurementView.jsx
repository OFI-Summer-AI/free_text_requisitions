import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Legend,
} from 'recharts';
import {
  Bookmark, RefreshCw, Settings2, Bell, Download,
  TrendingDown, ChevronDown, LayoutGrid, ArrowUpDown,
  MoreVertical, Info,
} from 'lucide-react';
import { cn } from '../lib/utils';

// ── Colour palette ─────────────────────────────────────────────
const G = {
  gold:      '#C9A227',
  goldLight: '#E2C96A',
  goldPale:  '#F7F0D0',
  goldDark:  '#A8841F',
  black:     '#0A0A0A',
  dark:      '#1A1A1A',
  charcoal:  '#333333',
  mid:       '#787878',
  light:     '#D0D0D0',
  offWhite:  '#FAFAF8',
  white:     '#FFFFFF',
  border:    '#E8E8E8',
  borderWarm:'#EDE6D0',
  red:       '#DC2626',
};

// ── Static data ────────────────────────────────────────────────
const timelineData = [
  { m: '2024-05', orders: 4200, ftRate: 82 },
  { m: '2024-06', orders: 5800, ftRate: 91 },
  { m: '2024-07', orders: 4600, ftRate: 85 },
  { m: '2024-08', orders: 4900, ftRate: 88 },
  { m: '2024-09', orders: 5100, ftRate: 90 },
  { m: '2024-10', orders: 5400, ftRate: 92 },
  { m: '2024-11', orders: 4800, ftRate: 89 },
  { m: '2024-12', orders: 4300, ftRate: 84 },
  { m: '2025-01', orders: 5200, ftRate: 91 },
  { m: '2025-02', orders: 5700, ftRate: 93 },
  { m: '2025-03', orders: 5500, ftRate: 92 },
  { m: '2025-04', orders: 4900, ftRate: 88 },
  { m: '2025-05', orders: 5300, ftRate: 90 },
  { m: '2025-06', orders: 5600, ftRate: 93 },
  { m: '2025-07', orders: 5100, ftRate: 89 },
  { m: '2025-08', orders: 4800, ftRate: 87 },
  { m: '2025-09', orders: 5400, ftRate: 91 },
  { m: '2025-10', orders: 5900, ftRate: 94 },
  { m: '2025-11', orders: 5700, ftRate: 93 },
  { m: '2025-12', orders: 5200, ftRate: 90 },
  { m: '2026-01', orders: 5600, ftRate: 92 },
  { m: '2026-02', orders: 6100, ftRate: 95 },
  { m: '2026-03', orders: 5800, ftRate: 93 },
  { m: '2026-04', orders: 3900, ftRate: 88 },
];

const classificationData = [
  { name: 'Free-text orders',      freeText: 92600, material: 0 },
  { name: 'Contract-Based Orders', freeText: 0,     material: 42000 },
];

const plantData = [
  { name: 'ADM – IMEC Administratie', value: 20.36, color: G.gold },
  { name: 'FI01 – IMEC FINLAND',      value: 20.36, color: G.goldLight },
  { name: 'Z001 – IMEC VZW',          value: 20.36, color: G.mid },
  { name: 'IM – IMEC 1',              value: 20.36, color: G.light },
  { name: 'Others (6)',               value: 18.55, color: G.border },
];

const metricsData = [
  { material: '–',                ftRate: '99.85%', ftEur: '811M',  orders: '101K',  net: '1.67B',  alert: true },
  { material: 'CH-400412-0 - HT…', ftRate: '0.00%', ftEur: '0',     orders: '535',   net: '294K',   alert: false },
  { material: 'CH-100010-6 - 2-p…',ftRate: '0.00%', ftEur: '0',     orders: '502',   net: '340K',   alert: false },
  { material: 'CH-000010-6 - 2-p…',ftRate: '0.00%', ftEur: '0',     orders: '487',   net: '109K',   alert: false },
  { material: 'CH-400055-0 - RE…', ftRate: '0.00%', ftEur: '0',     orders: '486',   net: '328K',   alert: false },
  { material: 'CH-400071-0 - EK…', ftRate: '0.00%', ftEur: '0',     orders: '451',   net: '956K',   alert: false },
  { material: 'CH-801120-0 - Mic…',ftRate: '0.00%', ftEur: '0',     orders: '438',   net: '834K',   alert: false },
  { material: 'CH-400046-0 - De…', ftRate: '0.00%', ftEur: '0',     orders: '416',   net: '90.7K',  alert: false },
  { material: 'CH-000030-8 - A…',  ftRate: '0.00%', ftEur: '0',     orders: '326',   net: '305K',   alert: false },
];

const TABS = ['Overview', 'P2P', 'Free Text', 'Cycle Time'];

// ── Tooltip styles ─────────────────────────────────────────────
const tipStyle = {
  fontSize: 11,
  borderRadius: 6,
  border: `1px solid ${G.borderWarm}`,
  background: G.white,
  color: G.dark,
};

// ── Pie label ──────────────────────────────────────────────────
const RADIAN = Math.PI / 180;
function PieOuterLabel({ cx, cy, midAngle, outerRadius, name, value }) {
  const r   = outerRadius + 28;
  const x   = cx + r * Math.cos(-midAngle * RADIAN);
  const y   = cy + r * Math.sin(-midAngle * RADIAN);
  const anchor = x > cx ? 'start' : 'end';
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="central"
      fontSize={9} fill={G.charcoal} fontFamily="Segoe UI, sans-serif">
      {`${value}% ${name}`}
    </text>
  );
}

// ── Card shell ─────────────────────────────────────────────────
function Card({ className, children }) {
  return (
    <div className={cn('bg-white border border-[#E8E8E8] rounded-sm', className)}>
      {children}
    </div>
  );
}

// ── Section title (matches Celonis small label style) ──────────
function SectionTitle({ children, sub }) {
  return (
    <div className="px-4 pt-3 pb-1">
      <p className="text-[12px] font-semibold text-[#0A0A0A]">{children}</p>
      {sub && <p className="text-[10px] text-[#787878] mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function ProcurementView() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#0A0A0A]">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="flex items-center justify-between px-5 h-10">
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-semibold text-[#0A0A0A]">Procurement View</span>
            <div className="flex items-center gap-2 text-[#787878]">
              <Bookmark size={14} />
              <RefreshCw size={14} />
              <Settings2 size={14} />
              <LayoutGrid size={14} />
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#787878]">
            <span className="text-xs font-medium text-[#C9A227] border border-[#C9A227] rounded-full px-2 py-0.5">100%</span>
            <Bell size={15} />
            <Download size={15} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-[#E8E8E8]">
          {TABS.map((t) => (
            <button
              key={t}
              className={cn(
                'px-5 h-9 text-[12px] border-b-2 transition-colors',
                t === 'Free Text'
                  ? 'border-[#C9A227] text-[#0A0A0A] font-semibold'
                  : 'border-transparent text-[#787878] hover:text-[#0A0A0A]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="bg-white border-b border-[#E8E8E8] flex divide-x divide-[#E8E8E8]">
        {/* IMEC logo block */}
        <div className="flex items-center justify-center px-8 py-4 min-w-[130px]">
          <span className="text-[22px] font-black tracking-[-1px] text-[#0A0A0A]">
            ™<span className="ml-1 font-black">imec</span>
          </span>
        </div>

        {/* KPI 1 */}
        <div className="flex-1 px-6 py-4">
          <div className="flex items-center gap-1 text-[10px] text-[#787878] mb-1">
            FreeText order rate <Info size={10} />
          </div>
          <p className="text-[28px] font-bold text-[#0A0A0A] leading-none">69.51%</p>
          <p className="text-[11px] text-[#DC2626] flex items-center gap-1 mt-1">
            <TrendingDown size={11} /> -0.05 pp
          </p>
        </div>

        {/* KPI 2 */}
        <div className="flex-1 px-6 py-4">
          <p className="text-[10px] text-[#787878] mb-1">PO Items w/ Free Text Requisitions</p>
          <p className="text-[28px] font-bold text-[#0A0A0A] leading-none">92.6K</p>
        </div>

        {/* KPI 3 */}
        <div className="flex-1 px-6 py-4">
          <div className="flex items-center gap-1 text-[10px] text-[#787878] mb-1">
            FreeText order [EUR] <Info size={10} />
          </div>
          <p className="text-[28px] font-bold text-[#0A0A0A] leading-none">811M</p>
        </div>

        {/* KPI 4 */}
        <div className="flex-1 px-6 py-4">
          <div className="flex items-center gap-1 text-[10px] text-[#787878] mb-1">
            FreeText Order rate [%EUR] <Info size={10} />
          </div>
          <p className="text-[28px] font-bold text-[#0A0A0A] leading-none">91.1%</p>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="p-3 grid grid-cols-12 gap-3">

        {/* Row 1 — Left: Development over Time */}
        <Card className="col-span-7">
          <div className="flex items-start justify-between px-4 pt-3 pb-0">
            <div>
              <p className="text-[12px] font-semibold text-[#0A0A0A]">Development over Time</p>
              <div className="flex items-center gap-4 mt-1 text-[10px] text-[#787878]">
                <span className="flex items-center gap-1">↑ Order items</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 border border-[#E8E8E8] rounded px-3 py-1 text-[11px] text-[#333333] hover:bg-[#FAFAF8]">
              Month <ChevronDown size={11} />
            </button>
          </div>

          {/* FreeText order rate label top-right */}
          <div className="text-right px-4 text-[10px] text-[#787878]">FreeText order rate ↑</div>

          <div className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={timelineData} margin={{ top: 4, right: 16, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis
                  dataKey="m"
                  tick={{ fontSize: 8, fill: '#787878' }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={40}
                />
                <YAxis
                  yAxisId="l"
                  tick={{ fontSize: 9, fill: '#787878' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  width={35}
                />
                <YAxis
                  yAxisId="r"
                  orientation="right"
                  tick={{ fontSize: 9, fill: '#787878' }}
                  domain={[0, 100]}
                  unit="%"
                  width={38}
                />
                <Tooltip contentStyle={tipStyle} />
                <Bar
                  yAxisId="l" dataKey="orders" fill={G.goldLight}
                  radius={[2, 2, 0, 0]} name="Order items" maxBarSize={18}
                />
                <Line
                  yAxisId="r" type="monotone" dataKey="ftRate"
                  stroke={G.black} strokeWidth={1.5}
                  dot={{ r: 3, fill: G.black, strokeWidth: 0 }}
                  name="FreeText order rate"
                />
              </ComposedChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-[10px] text-[#787878] -mt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 inline-block rounded-sm" style={{ background: G.goldLight }} />
                Order items
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 inline-block" style={{ background: G.black }} />
                FreeText order rate
              </span>
            </div>
            <p className="text-center text-[10px] text-[#787878] mt-1">Month →</p>
          </div>
        </Card>

        {/* Row 1 — Right: Classification */}
        <Card className="col-span-5">
          <SectionTitle
            children="Free-Text Classification by Order Items"
            sub="↑ FreeText order Classfication"
          />
          <div className="px-3 pb-3">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={classificationData}
                layout="vertical"
                margin={{ top: 8, right: 20, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F0F0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 9, fill: '#787878' }}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={145}
                  tick={{ fontSize: 10, fill: '#333333' }}
                />
                <Tooltip
                  contentStyle={tipStyle}
                  formatter={(v) => v > 0 ? v.toLocaleString() : ''}
                />
                <Bar dataKey="freeText" stackId="a" fill={G.gold}      name="Free-text orders"   radius={[0, 3, 3, 0]} />
                <Bar dataKey="material" stackId="a" fill={G.light}     name="Orders with material" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex items-center justify-center gap-5 text-[10px] text-[#787878] -mt-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 inline-block rounded-sm" style={{ background: G.gold }} />
                Free-text orders
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 inline-block rounded-sm" style={{ background: G.light }} />
                Orders with material
              </span>
            </div>
            <p className="text-right text-[10px] text-[#787878] mt-2">Order Items →</p>
          </div>
        </Card>

        {/* Row 2 — Left: Plant donut */}
        <Card className="col-span-7">
          <SectionTitle children="Free-Text Orders by Plant" />
          <div className="flex items-center justify-center pb-4">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={plantData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={110}
                  dataKey="value"
                  labelLine={{ stroke: G.mid, strokeWidth: 0.8 }}
                  label={PieOuterLabel}
                >
                  {plantData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={tipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Row 2 — Right: Metrics table */}
        <Card className="col-span-5">
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#E8E8E8]">
            <p className="text-[12px] font-semibold text-[#0A0A0A]">Key Metrics by Dimension</p>
            <div className="flex items-center gap-2">
              <button className="border border-[#E8E8E8] rounded p-1 hover:bg-[#FAFAF8]">
                <LayoutGrid size={12} className="text-[#787878]" />
              </button>
              <button className="flex items-center gap-1 border border-[#E8E8E8] rounded px-2 py-1 text-[10px] text-[#333333] hover:bg-[#FAFAF8]">
                Material <ChevronDown size={10} />
              </button>
              <button className="border border-[#E8E8E8] rounded p-1 hover:bg-[#FAFAF8]">
                <Download size={12} className="text-[#787878]" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAF8]">
                  {[
                    ['Material', 'w-[28%]'],
                    ['FreeText order rate', 'w-[18%] text-right'],
                    ['FreeText order [EUR]', 'w-[16%] text-right'],
                    ['Order items', 'w-[14%] text-right'],
                    ['Net order value [EUR]', 'w-[16%] text-right'],
                    ['', 'w-[8%]'],
                  ].map(([h, cls]) => (
                    <th key={h} className={cn('px-3 py-2 font-semibold text-[#333333] text-left whitespace-nowrap', cls)}>
                      <span className="flex items-center gap-1">
                        {h}
                        {h && <ArrowUpDown size={9} className="text-[#A8A8A8]" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metricsData.map((row, i) => (
                  <tr
                    key={row.material + i}
                    className={cn(
                      'border-b border-[#F0F0F0] hover:bg-[#FDFCF7] transition-colors',
                      i % 2 === 0 ? '' : 'bg-[#FAFAF8]'
                    )}
                  >
                    <td className="px-3 py-1.5 font-mono text-[10px] text-[#333333] whitespace-nowrap">{row.material}</td>
                    <td className="px-3 py-1.5 text-right">
                      {row.alert
                        ? <span className="bg-[#DC2626] text-white text-[10px] font-semibold rounded px-1.5 py-0.5">{row.ftRate}</span>
                        : <span className="text-[#333333]">{row.ftRate}</span>
                      }
                    </td>
                    <td className="px-3 py-1.5 text-right text-[#333333]">{row.ftEur}</td>
                    <td className="px-3 py-1.5 text-right text-[#333333]">{row.orders}</td>
                    <td className="px-3 py-1.5 text-right text-[#333333]">{row.net}</td>
                    <td className="px-3 py-1.5 text-center">
                      <button className="text-[#A8A8A8] hover:text-[#333333]">
                        <MoreVertical size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}
