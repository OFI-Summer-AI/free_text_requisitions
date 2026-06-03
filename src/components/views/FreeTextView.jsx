import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart,
} from 'recharts';
import {
  BarChart2, TrendingDown, ChevronDown,
  LayoutGrid, Download, ArrowUpDown, MoreVertical, Info,
} from 'lucide-react';
import { C } from '../../lib/colors';

// ── Data ──────────────────────────────────────────────────────
const timelineData = [
  { m: '2024-05', orders: 4200, ftRate: 82 }, { m: '2024-06', orders: 5800, ftRate: 91 },
  { m: '2024-07', orders: 4600, ftRate: 85 }, { m: '2024-08', orders: 4900, ftRate: 88 },
  { m: '2024-09', orders: 5100, ftRate: 90 }, { m: '2024-10', orders: 5400, ftRate: 92 },
  { m: '2024-11', orders: 4800, ftRate: 89 }, { m: '2024-12', orders: 4300, ftRate: 84 },
  { m: '2025-01', orders: 5200, ftRate: 91 }, { m: '2025-02', orders: 5700, ftRate: 93 },
  { m: '2025-03', orders: 5500, ftRate: 92 }, { m: '2025-04', orders: 4900, ftRate: 88 },
  { m: '2025-05', orders: 5300, ftRate: 90 }, { m: '2025-06', orders: 5600, ftRate: 93 },
  { m: '2025-07', orders: 5100, ftRate: 89 }, { m: '2025-08', orders: 4800, ftRate: 87 },
  { m: '2025-09', orders: 5400, ftRate: 91 }, { m: '2025-10', orders: 5900, ftRate: 94 },
  { m: '2025-11', orders: 5700, ftRate: 93 }, { m: '2025-12', orders: 5200, ftRate: 90 },
  { m: '2026-01', orders: 5600, ftRate: 92 }, { m: '2026-02', orders: 6100, ftRate: 95 },
  { m: '2026-03', orders: 5800, ftRate: 93 }, { m: '2026-04', orders: 3900, ftRate: 88 },
];

const classData = [
  { name: 'Free-text orders',      ft: 92600, mat: 0     },
  { name: 'Contract-Based Orders', ft: 0,     mat: 41800 },
];

const plantData = [
  { name: 'ADM – IMEC Administratie', value: 20.36, color: C.gold    },
  { name: 'FI01 – IMEC FINLAND',      value: 20.36, color: '#B8963A' },
  { name: 'Z001 – IMEC VZW',          value: 20.36, color: '#555555' },
  { name: 'IM – IMEC 1',              value: 20.36, color: '#333333' },
  { name: 'Others (6)',               value: 18.55, color: '#222222' },
];

const ftrVsContract = [
  { name: 'FT Orders',      value: 69.5 },
  { name: 'Contract Based', value: 30.5 },
];

const orderVsRequest = [
  { name: 'Order Items', value: 92600 },
  { name: 'FT Requests', value: 78400 },
];

const metrics = [
  { mat: '–',                    rate: '99.85%', eur: '811M', orders: '101K', net: '1.67B', alert: true  },
  { mat: 'CH-400412-0 - HT…',    rate: '0.00%',  eur: '0',   orders: '535',  net: '294K',  alert: false },
  { mat: 'CH-100010-6 - 2-p…',   rate: '0.00%',  eur: '0',   orders: '502',  net: '340K',  alert: false },
  { mat: 'CH-000010-6 - 2-p…',   rate: '0.00%',  eur: '0',   orders: '487',  net: '109K',  alert: false },
  { mat: 'CH-400055-0 - RE…',    rate: '0.00%',  eur: '0',   orders: '486',  net: '328K',  alert: false },
  { mat: 'CH-400071-0 - EK…',    rate: '0.00%',  eur: '0',   orders: '451',  net: '956K',  alert: false },
  { mat: 'CH-801120-0 - Mic…',   rate: '0.00%',  eur: '0',   orders: '438',  net: '834K',  alert: false },
  { mat: 'CH-400046-0 - De…',    rate: '0.00%',  eur: '0',   orders: '416',  net: '90.7K', alert: false },
  { mat: 'CH-000030-8 - A…',     rate: '0.00%',  eur: '0',   orders: '326',  net: '305K',  alert: false },
];

// ── Helpers ───────────────────────────────────────────────────
const R = Math.PI / 180;
function OuterLabel({ cx, cy, midAngle, outerRadius, name, value }) {
  const r = outerRadius + 28;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central" fontSize={9} fill={C.textSec}>
      {`${value}% ${name}`}
    </text>
  );
}

function ChartLegend({ items }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 10, color: C.textSec, marginTop: 10 }}>
      {items.map(({ color, label, dashed }) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {dashed
            ? <span style={{ width: 18, height: 2, background: color, display: 'inline-block', borderTop: `2px dashed ${color}` }} />
            : <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: 'inline-block' }} />
          }
          {label}
        </span>
      ))}
    </div>
  );
}

// ── View ──────────────────────────────────────────────────────
export default function FreeTextView() {
  return (
    <div>

      {/* ════════════════════════════════════════════════════
          TOP — KPI strip  (IMEC logo + 4 metrics in a row)
          ════════════════════════════════════════════════════ */}
      <div style={{
        background: C.surface,
        border: `1px solid ${C.goldRing}`,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'stretch',
        marginBottom: 14,
        overflow: 'hidden',
        boxShadow: `0 0 20px rgba(204,162,62,0.08)`,
      }}>
        {/* KPI 1 */}
        <div style={{ flex: 1, padding: '14px 22px', borderRight: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.textSec, marginBottom: 4 }}>
            FreeText order rate <Info size={10} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.textPri, letterSpacing: '-1px', lineHeight: 1 }}>
            69.51%
          </div>
          <div style={{ fontSize: 11, color: C.red, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <TrendingDown size={11} /> -0.05 pp
          </div>
        </div>

        {/* KPI 2 */}
        <div style={{ flex: 1, padding: '14px 22px', borderRight: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.textSec, marginBottom: 4 }}>
            PO Items w/ Free Text Requisitions
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.textPri, letterSpacing: '-1px', lineHeight: 1 }}>
            92.6K
          </div>
        </div>

        {/* KPI 3 */}
        <div style={{ flex: 1, padding: '14px 22px', borderRight: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.textSec, marginBottom: 4 }}>
            FreeText order [EUR] <Info size={10} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.textPri, letterSpacing: '-1px', lineHeight: 1 }}>
            811M
          </div>
        </div>

        {/* KPI 4 */}
        <div style={{ flex: 1, padding: '14px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.textSec, marginBottom: 4 }}>
            FreeText Order rate [%EUR] <Info size={10} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.textPri, letterSpacing: '-1px', lineHeight: 1 }}>
            91.1%
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MIDDLE ROW 1 — Development over Time + Classification
          ════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '58% 1fr', gap: 12, marginBottom: 12 }}>

        {/* Development over Time */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Development over Time</h3>
                <p className="chart-section__subtitle">↑ Order items &nbsp;·&nbsp; FreeText order rate ↑</p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ gap: 6, fontSize: 12 }}>
              Month <ChevronDown size={11} />
            </button>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={timelineData} margin={{ top: 4, right: 16, left: 0, bottom: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 8, fill: C.textSec }} angle={-45} textAnchor="end" interval={0} height={46} />
                <YAxis yAxisId="l" tick={{ fontSize: 9, fill: C.textSec }} tickFormatter={v => `${v / 1000}K`} width={32} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 9, fill: C.textSec }} domain={[0, 100]} unit="%" width={36} />
                <Tooltip contentStyle={C.tip} />
                <Bar yAxisId="l" dataKey="orders" fill={C.gold} fillOpacity={0.8} radius={[2, 2, 0, 0]} maxBarSize={16} name="Order items" />
                <Line yAxisId="r" type="monotone" dataKey="ftRate" stroke={C.textPri} strokeWidth={1.5}
                  dot={{ r: 2.5, fill: C.textPri, strokeWidth: 0 }} name="FreeText order rate" />
              </ComposedChart>
            </ResponsiveContainer>
            <ChartLegend items={[
              { color: C.gold,    label: 'Order items' },
              { color: C.textPri, label: 'FreeText order rate' },
            ]} />
            <p style={{ textAlign: 'center', fontSize: 10, color: C.textSec, marginTop: 4 }}>Month →</p>
          </div>
        </div>

        {/* Free-Text Classification */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Free-Text Classification by Order Items</h3>
                <p className="chart-section__subtitle">↑ FreeText order Classfication</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={classData} layout="vertical" margin={{ top: 12, right: 20, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={C.grid} />
                <XAxis type="number" tick={{ fontSize: 9, fill: C.textSec }}
                  tickFormatter={v => v >= 1000 ? `${v / 1000}K` : v} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10, fill: C.textPri }} />
                <Tooltip contentStyle={C.tip} formatter={v => v > 0 ? v.toLocaleString() : ''} />
                <Bar dataKey="ft"  stackId="a" fill={C.gold}   name="Free-text orders"     radius={[0, 3, 3, 0]} />
                <Bar dataKey="mat" stackId="a" fill={C.border} name="Orders with material"  radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ChartLegend items={[
              { color: C.gold,   label: 'Free-text orders' },
              { color: C.border, label: 'Orders with material' },
            ]} />
            <p style={{ textAlign: 'right', fontSize: 10, color: C.textSec, marginTop: 4 }}>Order Items →</p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MIDDLE ROW 2 — Plant donut + FTR comparisons
          ════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '58% 1fr', gap: 12, marginBottom: 12 }}>

        {/* FT Orders by Plant */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Free-Text Orders by Plant</h3>
                <p className="chart-section__subtitle">Plant share breakdown</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body" style={{ display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={plantData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={108}
                  dataKey="value"
                  labelLine={{ stroke: C.border, strokeWidth: 0.8 }}
                  label={OuterLabel}
                >
                  {plantData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} contentStyle={C.tip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FTR Orders vs Contract + Order Items vs FT Requests stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* FTR Orders vs Contract Based */}
          <div className="chart-section" style={{ flex: 1 }}>
            <div className="chart-section__header">
              <div className="chart-section__title-group">
                <div className="chart-section__icon"><BarChart2 size={16} /></div>
                <div>
                  <h3 className="chart-section__title" style={{ fontSize: 12 }}>FTR Orders vs Contract Based</h3>
                </div>
              </div>
            </div>
            <div className="chart-section__body">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={ftrVsContract} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.textSec }} />
                  <YAxis tick={{ fontSize: 9, fill: C.textSec }} unit="%" domain={[0, 100]} width={32} />
                  <Tooltip contentStyle={C.tip} formatter={v => `${v}%`} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48} name="Share %">
                    {ftrVsContract.map((_, i) => <Cell key={i} fill={i === 0 ? C.gold : C.border} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Items vs FT Requests */}
          <div className="chart-section" style={{ flex: 1 }}>
            <div className="chart-section__header">
              <div className="chart-section__title-group">
                <div className="chart-section__icon"><BarChart2 size={16} /></div>
                <div>
                  <h3 className="chart-section__title" style={{ fontSize: 12 }}>Order Items vs FT Requests</h3>
                </div>
              </div>
            </div>
            <div className="chart-section__body">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={orderVsRequest} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.textSec }} />
                  <YAxis tick={{ fontSize: 9, fill: C.textSec }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} width={32} />
                  <Tooltip contentStyle={C.tip} formatter={v => v.toLocaleString()} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48} name="Count">
                    {orderVsRequest.map((_, i) => <Cell key={i} fill={i === 0 ? C.gold : C.border} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          BOTTOM — Key Metrics by Dimension table (full width)
          ════════════════════════════════════════════════════ */}
      <div className="chart-section">
        <div className="chart-section__header">
          <div className="chart-section__title-group">
            <div className="chart-section__icon"><BarChart2 size={18} /></div>
            <div>
              <h3 className="chart-section__title">Key Metrics by Dimension</h3>
              <p className="chart-section__subtitle">Material — FT rate, spend and order volumes</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><LayoutGrid size={12} /></button>
            <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 11 }}>
              Material <ChevronDown size={10} />
            </button>
            <button className="btn btn-ghost btn-sm"><Download size={12} /></button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dark-table">
            <thead>
              <tr>
                {[
                  'Material',
                  'FreeText order rate',
                  'FreeText order [EUR]',
                  'Order items',
                  'Net order value [EUR]',
                  '',
                ].map((h, i) => (
                  <th key={i} style={{ textAlign: i > 0 && i < 5 ? 'right' : 'left' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4,
                      justifyContent: i > 0 && i < 5 ? 'flex-end' : 'flex-start' }}>
                      {h}
                      {h && i < 5 && <ArrowUpDown size={9} color={C.border} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: C.gold, fontWeight: 700 }}>
                    {r.mat}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {r.alert
                      ? <span className="badge-danger">{r.rate}</span>
                      : <span style={{ color: C.textSec }}>{r.rate}</span>
                    }
                  </td>
                  <td style={{ textAlign: 'right', color: C.textSec }}>{r.eur}</td>
                  <td style={{ textAlign: 'right', color: C.textSec }}>{r.orders}</td>
                  <td style={{ textAlign: 'right', color: C.textSec }}>{r.net}</td>
                  <td style={{ textAlign: 'center' }}>
                    <MoreVertical size={12} color={C.border} style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
