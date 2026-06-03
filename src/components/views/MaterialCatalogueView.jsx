import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Search, BarChart2, ArrowUpDown } from 'lucide-react';
import { C } from '../../lib/colors';

const categories = [
  { name: 'Lab Equipment',       cat: 4521, ftRate: 22 },
  { name: 'PPE & Safety',        cat: 3812, ftRate: 55 },
  { name: 'Chemicals & Gases',   cat: 3240, ftRate: 18 },
  { name: 'Electronics & PCB',   cat: 2987, ftRate: 39 },
  { name: 'Consumables',         cat: 2654, ftRate: 46 },
  { name: 'Cleanroom Supplies',  cat: 1930, ftRate: 30 },
  { name: 'Mechanical Parts',    cat: 1540, ftRate: 62 },
  { name: 'Software & Licences', cat: 980,  ftRate: 9  },
];

const coverage = [
  { name: 'Catalogue-linked', value: 65.4, color: C.gold   },
  { name: 'Free-text orders', value: 34.6, color: C.border },
];

const materials = [
  { code: 'CH-400452-0-VT',  name: 'Vacuum Pump Series V4',           cat: 'Lab Equipment',      orders: 1401, avg: '€17,700', last: '2026-03-01', status: 'Active' },
  { code: 'CH-100010-6-2p',  name: 'Isopropanol 5L (Lab Grade)',       cat: 'Chemicals & Gases',  orders: 502,  avg: '€160',    last: '2026-02-14', status: 'Active' },
  { code: 'CH-000010-6-2p',  name: 'Precision Pipette Tips 200µL',    cat: 'Consumables',         orders: 487,  avg: '€420',    last: '2026-02-20', status: 'Active' },
  { code: 'CH-400055-0-RE',  name: 'Reflow Oven Controller REF-4',    cat: 'Electronics & PCB',   orders: 486,  avg: '€41,200', last: '2026-01-18', status: 'Active' },
  { code: 'CH-400071-0-EK',  name: 'EKG Monitoring Module EK-32',     cat: 'Lab Equipment',       orders: 451,  avg: '€8,900',  last: '2026-03-05', status: 'Active' },
  { code: 'CH-801120-0-Mic', name: 'SEM Sample Stub Aluminium ×50',   cat: 'Lab Equipment',       orders: 438,  avg: '€680',    last: '2026-02-28', status: 'Active' },
  { code: 'CH-400046-0-De',  name: 'DI Water System DI-2000',         cat: 'Lab Equipment',       orders: 416,  avg: '€18,400', last: '2025-12-10', status: 'Review' },
  { code: 'CH-000030-8-A',   name: 'Cleanroom Gloves Class 10 XL',    cat: 'Cleanroom Supplies',  orders: 326,  avg: '€1,240',  last: '2026-01-30', status: 'Active' },
  { code: 'CH-400412-0-HT',  name: 'High-Temp Resistant Cable 10m',   cat: 'Mechanical Parts',    orders: 535,  avg: '€3,850',  last: '2026-03-12', status: 'Active' },
  { code: 'CH-801200-0-Ni',  name: 'Nitrogen Cylinder 50L (99.999%)', cat: 'Chemicals & Gases',   orders: 412,  avg: '€6,700',  last: '2026-03-08', status: 'Active' },
];

const R = Math.PI / 180;
function PieLabel({ cx, cy, midAngle, outerRadius, value }) {
  const r = outerRadius + 22;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central" fontSize={9} fill={C.textSec}>
      {`${value}%`}
    </text>
  );
}

export default function MaterialCatalogueView() {
  return (
    <div>

      {/* ── TOP: KPIs ── */}
      <div className="kpi-efficiency-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Materials',      value: '45,231', gold: false  },
          { label: 'Catalogue Coverage',   value: '65.4%',  gold: true   },
          { label: 'Free-Text Rate',       value: '34.6%',  danger: true },
          { label: 'Categories',           value: '8',      gold: false  },
        ].map(({ label, value, gold, danger }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-card__label">{label}</div>
            <div
              className="kpi-card__value"
              style={{ color: danger ? C.red : gold ? C.gold : C.textPri }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* ── MIDDLE: Charts ── */}
      <div className="dashboard-charts-row" style={{ gridTemplateColumns: '60% 1fr', marginBottom: 12 }}>

        {/* Category bar chart */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Orders by Material Category</h3>
                <p className="chart-section__subtitle">Catalogue-linked vs Free-text breakdown</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={categories} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={C.grid} />
                <XAxis type="number" tick={{ fontSize: 9, fill: C.textSec }}
                  tickFormatter={v => `${(v / 1000).toFixed(1)}K`} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10, fill: C.textPri }} />
                <Tooltip contentStyle={C.tip} />
                <Bar dataKey="cat" name="Catalogue-linked" fill={C.gold} radius={[0, 0, 0, 0]}
                  label={{ position: 'right', fontSize: 9, fill: C.textSec,
                    formatter: v => v > 0 ? `${Math.round(100 - (categories.find(c => c.cat === v)?.ftRate || 0))}%` : '' }} />
                <Bar dataKey="ftRate" name="Free-text %" fill={C.border} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: 10, color: C.textSec, marginTop: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: C.gold, display: 'inline-block' }} />
                Catalogue-linked
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: C.border, display: 'inline-block' }} />
                Free-text
              </span>
            </div>
          </div>
        </div>

        {/* Coverage donut */}
        <div className="chart-section" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Catalogue Coverage</h3>
                <p className="chart-section__subtitle">Linked vs free-text share</p>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px 16px' }}>
            <PieChart width={210} height={210}>
              <Pie data={coverage} cx={103} cy={103} innerRadius={58} outerRadius={94}
                dataKey="value" labelLine={{ stroke: C.border, strokeWidth: 0.8 }} label={PieLabel}>
                {coverage.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} contentStyle={C.tip} />
            </PieChart>
            <div style={{ display: 'flex', gap: 20, fontSize: 11, color: C.textSec }}>
              {coverage.map(e => (
                <span key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: e.color, display: 'inline-block' }} />
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Materials Table ── */}
      <div className="chart-section">
        <div className="chart-section__header">
          <div className="chart-section__title-group">
            <div className="chart-section__icon"><BarChart2 size={18} /></div>
            <h3 className="chart-section__title">Material Catalogue</h3>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.textSec }} />
            <input placeholder="Search materials…" className="form-input"
              style={{ paddingLeft: 30, paddingTop: 7, paddingBottom: 7, width: 200 }} />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dark-table">
            <thead>
              <tr>
                {['Material Code', 'Name', 'Category', 'Total Orders', 'Avg Price', 'Last Order', 'Status'].map(h => (
                  <th key={h}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {h} <ArrowUpDown size={9} color={C.border} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materials.map(m => (
                <tr key={m.code}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: C.gold, fontWeight: 700 }}>{m.code}</td>
                  <td>{m.name}</td>
                  <td><span className="source-chip" style={{ fontSize: 10 }}>{m.cat}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{m.orders.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', color: C.textSec }}>{m.avg}</td>
                  <td style={{ color: C.textSec }}>{m.last}</td>
                  <td>
                    <span className={m.status === 'Active' ? 'badge-success' : 'badge-gold'} style={{ fontSize: 10 }}>
                      {m.status}
                    </span>
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
