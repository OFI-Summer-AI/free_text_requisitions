import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, FileText, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { C } from '../../lib/colors';

const suggestions = [
  { id:1, supplier:'VWR International',        category:'Lab Consumables',          orders:47, spend:387000, saving:8.5,  priority:'High',   status:'Actionable', trend:[28,31,35,40,47] },
  { id:2, supplier:'Air Liquide Belgium',       category:'Industrial Gases',         orders:36, spend:241200, saving:12.0, priority:'High',   status:'Actionable', trend:[18,22,25,30,36] },
  { id:3, supplier:'Thermo Fisher Scientific',  category:'Lab Equipment & Reagents', orders:29, spend:514000, saving:6.5,  priority:'Medium', status:'In Review',  trend:[15,18,21,24,29] },
  { id:4, supplier:'Merck Millipore',           category:'Chemicals',                orders:24, spend:298400, saving:9.0,  priority:'Medium', status:'Actionable', trend:[12,14,17,20,24] },
  { id:5, supplier:'RS Components',             category:'Electronics & Cables',     orders:19, spend:73500,  saving:5.0,  priority:'Low',    status:'Watchlist',  trend:[8,10,12,15,19]  },
  { id:6, supplier:'Pfeiffer Vacuum GmbH',      category:'Vacuum Equipment',         orders:15, spend:372000, saving:7.5,  priority:'Medium', status:'Actionable', trend:[5,7,9,12,15]    },
];

const spendData = suggestions.map(s => ({
  name: s.supplier.split(' ')[0],
  spend: s.spend,
  saving: Math.round(s.spend * s.saving / 100),
}));

const PRIORITY_BADGE = {
  High:   <span style={{ background:C.gold, color:'#000', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>HIGH</span>,
  Medium: <span className="badge-neutral" style={{ textTransform:'uppercase', fontSize:10 }}>MEDIUM</span>,
  Low:    <span className="badge-neutral" style={{ textTransform:'uppercase', fontSize:10, opacity:0.6 }}>LOW</span>,
};
const STATUS_COLOR = { Actionable:'color:'+ C.gold, 'In Review':'color:'+ C.textSec, Watchlist:'color:'+ C.textSec };

function MiniSparkline({ data }) {
  const max = Math.max(...data);
  const pts = data.map((v,i) => `${4+(i/(data.length-1))*52},${18-(v/max)*14}`).join(' ');
  return (
    <svg width="60" height="20">
      <polyline points={pts} fill="none" stroke={C.gold} strokeWidth="1.5" />
      {[data.length-1].map(i => {
        const x = 4+(i/(data.length-1))*52, y = 18-(data[i]/max)*14;
        return <circle key={i} cx={x} cy={y} r="2.5" fill={C.gold} />;
      })}
    </svg>
  );
}

export default function SuggestionsView() {
  const totalSavings = suggestions.reduce((a,s)=>a+Math.round(s.spend*s.saving/100),0);
  const actionable   = suggestions.filter(s=>s.status==='Actionable').length;

  return (
    <div>
      {/* KPIs */}
      <div className="kpi-efficiency-grid" style={{ marginBottom:20 }}>
        {[
          { label:'Contract Suggestions',    value:suggestions.length, icon:FileText,     gold:false },
          { label:'Actionable Now',           value:actionable,         icon:AlertTriangle,gold:true  },
          { label:'Potential Annual Savings', value:`€${(totalSavings/1000).toFixed(0)}K`,icon:TrendingUp,   gold:true  },
          { label:'Contracts Created YTD',   value:3,                  icon:CheckCircle2, gold:false },
        ].map(({ label, value, icon:Icon, gold }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-card__header">
              <div className="kpi-card__icon" style={{ background: gold?'rgba(204,162,62,0.15)':'rgba(255,255,255,0.05)' }}>
                <Icon size={18} color={gold?C.gold:C.textSec} />
              </div>
            </div>
            <div className="kpi-card__value" style={{ color:gold?C.gold:C.textPri }}>{value}</div>
            <div className="kpi-card__label">{label}</div>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      <div style={{ background:'rgba(204,162,62,0.08)', border:`1px solid rgba(204,162,62,0.3)`, borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, marginBottom:16, fontSize:13 }}>
        <AlertTriangle size={16} color={C.gold} style={{ flexShrink:0 }} />
        <p style={{ color:C.textPri }}>
          <strong style={{ color:C.gold }}>{actionable} suppliers</strong> have exceeded the repetitive-order threshold.
          Consolidating these under contract could save approximately{' '}
          <strong style={{ color:C.gold }}>€{(totalSavings/1000).toFixed(0)}K</strong> annually.
        </p>
      </div>

      <div className="dashboard-charts-row" style={{ gridTemplateColumns:'1fr 320px' }}>
        {/* Suggestion cards grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {suggestions.map(s => (
            <div key={s.id} className="suboptimal-tile fade-in-up">
              <div className="suboptimal-tile__header">
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:C.textPri }}>{s.supplier}</div>
                  <div style={{ fontSize:11, color:C.textSec, marginTop:2 }}>{s.category}</div>
                </div>
                {PRIORITY_BADGE[s.priority]}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
                {[
                  { l:'Orders (12M)', v:s.orders, c:C.textPri },
                  { l:'Total Spend',  v:`€${(s.spend/1000).toFixed(0)}K`, c:C.textPri },
                  { l:'Potential',    v:`${s.saving}%`, c:C.gold },
                ].map(({ l,v,c }) => (
                  <div key={l}>
                    <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:16, fontWeight:800, color:c }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:9, color:C.muted }}>TREND</span>
                  <MiniSparkline data={s.trend} />
                </div>
                <span style={{ fontSize:11, color: s.status==='Actionable'?C.gold:C.textSec, fontWeight: s.status==='Actionable'?700:400 }}>
                  {s.status}
                </span>
              </div>

              {s.status === 'Actionable' && (
                <button className="btn btn-primary btn-full" style={{ borderRadius:8 }}>Create Contract →</button>
              )}
              {s.status === 'In Review' && (
                <button className="btn btn-outline btn-full" style={{ borderRadius:8 }}>View Review</button>
              )}
              {s.status === 'Watchlist' && (
                <button className="btn btn-ghost btn-full" style={{ borderRadius:8 }}>Monitor</button>
              )}
            </div>
          ))}
        </div>

        {/* Spend vs savings chart */}
        <div className="chart-section" style={{ display:'flex', flexDirection:'column' }}>
          <div className="chart-section__header">
            <div>
              <h3 className="chart-section__title">Spend vs Savings</h3>
              <p className="chart-section__subtitle">By supplier (top 6)</p>
            </div>
          </div>
          <div className="chart-section__body" style={{ flex:1 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={spendData} layout="vertical" margin={{ top:4, right:16, left:4, bottom:4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={C.grid} />
                <XAxis type="number" tick={{ fontSize:9, fill:C.textSec }} tickFormatter={v=>`€${(v/1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" width={56} tick={{ fontSize:10, fill:C.textPri }} />
                <Tooltip contentStyle={C.tip} formatter={(v,n)=>[`€${(v/1000).toFixed(0)}K`, n==='spend'?'Total Spend':'Potential Saving']} />
                <Bar dataKey="spend"  fill={C.border} name="spend"  radius={[0,2,2,0]} maxBarSize={14} />
                <Bar dataKey="saving" fill={C.gold}   name="saving" radius={[0,2,2,0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', justifyContent:'center', gap:20, fontSize:10, color:C.textSec }}>
              <span style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:12,height:12,borderRadius:3,background:C.border,display:'inline-block' }} /> Total Spend</span>
              <span style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:12,height:12,borderRadius:3,background:C.gold,display:'inline-block' }} /> Savings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail table */}
      <div className="chart-section" style={{ marginTop:12 }}>
        <div className="chart-section__header">
          <h3 className="chart-section__title">Repetitive Order Detail</h3>
        </div>
        <table className="dark-table">
          <thead>
            <tr>
              {['Supplier','Category','Orders (12M)','Total Spend','Saving','Avg Order','Priority','Status','Action'].map(h=>(
                <th key={h}><span style={{ display:'flex', alignItems:'center', gap:4 }}>{h} <ArrowUpDown size={9} color={C.border} /></span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suggestions.map(s=>(
              <tr key={s.id}>
                <td style={{ fontWeight:700, color:C.textPri }}>{s.supplier}</td>
                <td style={{ color:C.textSec, fontSize:11 }}>{s.category}</td>
                <td style={{ textAlign:'right', fontWeight:700 }}>{s.orders}</td>
                <td style={{ textAlign:'right', color:C.textSec }}>€{(s.spend/1000).toFixed(0)}K</td>
                <td style={{ textAlign:'right', fontWeight:700, color:C.gold }}>{s.saving}%</td>
                <td style={{ textAlign:'right', color:C.textSec }}>€{Math.round(s.spend/s.orders).toLocaleString()}</td>
                <td>{PRIORITY_BADGE[s.priority]}</td>
                <td style={{ color:s.status==='Actionable'?C.gold:C.textSec, fontWeight:s.status==='Actionable'?700:400 }}>{s.status}</td>
                <td>
                  {s.status==='Actionable'
                    ? <button className="btn btn-primary btn-sm">Create Contract</button>
                    : <button className="btn btn-outline btn-sm">View</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
