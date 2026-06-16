import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { BarChart2, TrendingDown, TrendingUp, ArrowUpDown, ChevronDown, Download } from 'lucide-react';
import { C } from '../../lib/colors';

// ── Data ──────────────────────────────────────────────────────
const ftrVsContract = [
  { name:'FT Orders',       value:69.5, count:64200  },
  { name:'Contract Based',  value:30.5, count:28400  },
];

const orderVsRequest = [
  { name:'Order Items',   value:92600 },
  { name:'FT Requests',   value:78400 },
  { name:'Matched POs',   value:61800 },
  { name:'Unmatched',     value:16600 },
];

const plantData = [
  { name:'ADM – IMEC Administratie', value:20.36, color:C.gold    },
  { name:'FI01 – IMEC FINLAND',      value:20.36, color:'#B8963A' },
  { name:'Z001 – IMEC VZW',          value:20.36, color:'#555555' },
  { name:'IM – IMEC 1',              value:20.36, color:'#333333' },
  { name:'Others (6)',               value:18.55, color:'#242424' },
];

const monthlyTrend = [
  { m:'Oct',  ftr:68.2, contract:31.8, items:5400 },
  { m:'Nov',  ftr:69.1, contract:30.9, items:5600 },
  { m:'Dec',  ftr:67.8, contract:32.2, items:4800 },
  { m:'Jan',  ftr:70.2, contract:29.8, items:5900 },
  { m:'Feb',  ftr:71.5, contract:28.5, items:6100 },
  { m:'Mar',  ftr:69.5, contract:30.5, items:5800 },
];

const procurementTable = [
  { plant:'ADM – IMEC Administratie', ftrRate:'72.4%', ftrEur:'195M', orderItems:'20,845', contracted:'7,920',  matched:'18,412', saving:'€18.4M' },
  { plant:'FI01 – IMEC FINLAND',      ftrRate:'68.1%', ftrEur:'172M', orderItems:'20,836', contracted:'9,104',  matched:'17,891', saving:'€14.2M' },
  { plant:'Z001 – IMEC VZW',          ftrRate:'70.3%', ftrEur:'218M', orderItems:'20,839', contracted:'8,421',  matched:'19,104', saving:'€16.8M' },
  { plant:'IM – IMEC 1',              ftrRate:'65.9%', ftrEur:'163M', orderItems:'20,842', contracted:'10,200', matched:'16,800', saving:'€12.1M' },
  { plant:'POR – IMEC PROCESS',       ftrRate:'74.8%', ftrEur:'63M',  orderItems:'9,238',  contracted:'3,820',  matched:'8,102',  saving:'€5.4M'  },
];

const R = Math.PI / 180;
function OuterLabel({ cx, cy, midAngle, outerRadius, value }) {
  const r = outerRadius + 22;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return <text x={x} y={y} textAnchor={x>cx?'start':'end'} dominantBaseline="central" fontSize={9} fill={C.textSec}>{`${value}%`}</text>;
}

function LegendRow({ items }) {
  return (
    <div style={{ display:'flex', justifyContent:'center', gap:20, fontSize:10, color:C.textSec, marginTop:10 }}>
      {items.map(({ color, label }) => (
        <span key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:12, height:12, borderRadius:3, background:color, display:'inline-block' }} />{label}
        </span>
      ))}
    </div>
  );
}

// ── View ──────────────────────────────────────────────────────
export default function ProcurementView() {
  return (
    <div>

      {/* ── TOP: KPI Cards ── */}
      <div className="kpi-efficiency-grid" style={{ marginBottom:20 }}>
        {[
          {
            label:'FreeText Order rate', value:'69.51%',
            sub:'↓ -0.05 pp vs last period', down:true, prog:70,
            desc:'Share of PO items raised as free text',
          },
          {
            label:'FTR Orders vs Contract', value:'92.6K',
            sub:'↑ +4.2K vs last period', down:false, prog:92,
            desc:'Total PO items created as free text',
          },
          {
            label:'FreeText order [EUR]', value:'811M',
            sub:'Non-managed spend', down:false, prog:81,
            desc:'Total EUR value of free-text orders',
          },
          {
            label:'FreeText Order rate [%EUR]', value:'91.1%',
            sub:'↑ +1.2pp vs last period', down:false, prog:91,
            desc:'% of total spend placed as free text',
          },
        ].map(({ label, value, sub, down, prog, desc }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-card__header">
              <div className="kpi-card__icon" style={{ background:'rgba(204,162,62,0.12)' }}>
                <BarChart2 size={18} color={C.gold} />
              </div>
              <span style={{ fontSize:11, color:down?C.red:C.green, display:'flex', alignItems:'center', gap:4 }}>
                {down ? <TrendingDown size={11}/> : <TrendingUp size={11}/>} {sub}
              </span>
            </div>
            <div className="kpi-card__value">{value}</div>
            <div className="kpi-card__label">{label}</div>
            <div className="kpi-card__desc">{desc}</div>
            <div className="kpi-card__progress">
              <div className="kpi-card__progress-fill"
                style={{ width:`${prog}%`, background:`linear-gradient(90deg,${C.gold},#E2C96A)` }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── MIDDLE: Charts Row 1 — FTR vs Contract + Order Items vs FT + Plant ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>

        {/* FTR Orders vs Contract Based */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">FTR vs Contract Based</h3>
                <p className="chart-section__subtitle">Share of total PO items</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ftrVsContract} margin={{ top:8, right:16, left:0, bottom:4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize:10, fill:C.textSec }} />
                <YAxis tick={{ fontSize:9, fill:C.textSec }} unit="%" domain={[0,100]} width={36} />
                <Tooltip contentStyle={C.tip} formatter={v=>`${v}%`} />
                <Bar dataKey="value" radius={[6,6,0,0]} maxBarSize={60} name="Share %">
                  {ftrVsContract.map((_,i) => <Cell key={i} fill={i===0?C.gold:C.border} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', justifyContent:'center', gap:4, marginTop:8 }}>
              <div style={{ background:'rgba(204,162,62,0.1)', border:`1px solid ${C.gold}`, borderRadius:8, padding:'6px 14px', textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:800, color:C.gold }}>69.5%</div>
                <div style={{ fontSize:10, color:C.textSec }}>FT Orders</div>
              </div>
              <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:'6px 14px', textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:800, color:C.textSec }}>30.5%</div>
                <div style={{ fontSize:10, color:C.textSec }}>Contract</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items vs FT Requests */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Order Items vs FT Requests</h3>
                <p className="chart-section__subtitle">Volume comparison</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={orderVsRequest} margin={{ top:8, right:16, left:0, bottom:4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize:9, fill:C.textSec }} />
                <YAxis tick={{ fontSize:9, fill:C.textSec }} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} width={36} />
                <Tooltip contentStyle={C.tip} formatter={v=>v.toLocaleString()} />
                <Bar dataKey="value" radius={[6,6,0,0]} maxBarSize={40} name="Count">
                  {orderVsRequest.map((_,i)=><Cell key={i} fill={i===0?C.gold:i===1?'#B8963A':i===2?'#555':'#333'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:8 }}>
              {[{l:'Order Items',v:'92.6K'},{l:'FT Requests',v:'78.4K'}].map(({l,v})=>(
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:14, fontWeight:800, color:C.gold }}>{v}</div>
                  <div style={{ fontSize:10, color:C.textSec }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FT Orders by Plant */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">FT Orders by Plant</h3>
                <p className="chart-section__subtitle">Plant share breakdown</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body" style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <PieChart width={200} height={200}>
              <Pie data={plantData} cx={98} cy={98} innerRadius={55} outerRadius={90}
                dataKey="value" labelLine={false} label={OuterLabel}>
                {plantData.map((e,i)=><Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v=>`${v}%`} contentStyle={C.tip} />
            </PieChart>
            <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:4, marginTop:4 }}>
              {plantData.map(p=>(
                <div key={p.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:10 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:p.color, display:'inline-block', flexShrink:0 }} />
                    <span style={{ color:C.textSec, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
                  </span>
                  <span style={{ fontWeight:700, color:C.textPri }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE: Charts Row 2 — Monthly Trend ── */}
      <div className="dashboard-charts-row" style={{ marginBottom:12 }}>
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">FTR Rate Trend — Last 6 Months</h3>
                <p className="chart-section__subtitle">FT rate % vs contract rate % over time</p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ gap:6 }}>
              Period <ChevronDown size={11} />
            </button>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTrend} margin={{ top:8, right:24, left:0, bottom:4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize:10, fill:C.textSec }} />
                <YAxis tick={{ fontSize:9, fill:C.textSec }} unit="%" domain={[20,80]} width={36} />
                <Tooltip contentStyle={C.tip} formatter={v=>`${v}%`} />
                <Line type="monotone" dataKey="ftr"      stroke={C.gold}   strokeWidth={2} dot={{ r:4, fill:C.gold, strokeWidth:0 }} name="FT Rate %" />
                <Line type="monotone" dataKey="contract" stroke={C.textSec} strokeWidth={2} dot={{ r:4, fill:C.textSec, strokeWidth:0 }} strokeDasharray="5 3" name="Contract Rate %" />
              </LineChart>
            </ResponsiveContainer>
            <LegendRow items={[{ color:C.gold, label:'FT Rate %' }, { color:C.textSec, label:'Contract Rate %' }]} />
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Order Volume Trend</h3>
                <p className="chart-section__subtitle">Monthly PO items — last 6 months</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyTrend} margin={{ top:8, right:16, left:0, bottom:4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize:10, fill:C.textSec }} />
                <YAxis tick={{ fontSize:9, fill:C.textSec }} tickFormatter={v=>`${v/1000}K`} width={36} />
                <Tooltip contentStyle={C.tip} formatter={v=>v.toLocaleString()} />
                <Bar dataKey="items" fill={C.gold} fillOpacity={0.85} radius={[4,4,0,0]} maxBarSize={40} name="PO Items" />
              </BarChart>
            </ResponsiveContainer>
            <LegendRow items={[{ color:C.gold, label:'PO Items per month' }]} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Procurement Summary Table ── */}
      <div className="chart-section">
        <div className="chart-section__header">
          <div className="chart-section__title-group">
            <div className="chart-section__icon"><BarChart2 size={18} /></div>
            <div>
              <h3 className="chart-section__title">Procurement Summary by Plant</h3>
              <p className="chart-section__subtitle">FT rate, spend, matched volume and savings potential per plant</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-ghost btn-sm" style={{ gap:4, fontSize:11 }}>
              Plant <ChevronDown size={10} />
            </button>
            <button className="btn btn-ghost btn-sm"><Download size={12} /></button>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="dark-table">
            <thead>
              <tr>
                {['Plant','FT Rate','FT Spend [EUR]','Total Order Items','Contract Based','Matched to Catalogue','Savings Potential'].map((h,i) => (
                  <th key={i}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                      {h} <ArrowUpDown size={9} color={C.border} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {procurementTable.map((r,i) => (
                <tr key={i}>
                  <td style={{ fontWeight:700, color:C.textPri, whiteSpace:'nowrap' }}>{r.plant}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:60, height:4, background:C.border, borderRadius:2, overflow:'hidden' }}>
                        <div style={{ width:r.ftrRate, height:'100%', background:`linear-gradient(90deg,${C.gold},#E2C96A)`, borderRadius:2 }} />
                      </div>
                      <span style={{ fontWeight:700, color:C.gold }}>{r.ftrRate}</span>
                    </div>
                  </td>
                  <td style={{ textAlign:'right', color:C.textSec }}>{r.ftrEur}</td>
                  <td style={{ textAlign:'right', fontWeight:700, color:C.textPri }}>{r.orderItems}</td>
                  <td style={{ textAlign:'right', color:C.textSec }}>{r.contracted}</td>
                  <td style={{ textAlign:'right', color:C.textSec }}>{r.matched}</td>
                  <td style={{ textAlign:'right' }}>
                    <span className="badge-gold" style={{ fontSize:10 }}>{r.saving}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop:`1px solid ${C.border}` }}>
                <td style={{ fontWeight:800, color:C.gold, fontSize:12 }}>TOTAL</td>
                <td style={{ fontWeight:800, color:C.gold }}>69.51%</td>
                <td style={{ textAlign:'right', fontWeight:700, color:C.textPri }}>811M</td>
                <td style={{ textAlign:'right', fontWeight:700, color:C.textPri }}>92,600</td>
                <td style={{ textAlign:'right', color:C.textSec }}>39,465</td>
                <td style={{ textAlign:'right', color:C.textSec }}>80,309</td>
                <td style={{ textAlign:'right' }}>
                  <span className="badge-gold" style={{ fontSize:11 }}>€66.9M</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
}
