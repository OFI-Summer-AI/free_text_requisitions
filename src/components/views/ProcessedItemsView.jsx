import { useState } from 'react';
import { Search, CheckSquare, Square, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { C } from '../../lib/colors';

const orders = [
  { id:'PO-2024-0001',material:'CH-400452-0-VT', desc:'Industrial Vacuum Pump Series V4',      supplier:'Pfeiffer Vacuum GmbH',    cost:24800,delivery:'2024-07-15',status:'Pending', priority:'High',  match:94,approved:false},
  { id:'PO-2024-0002',material:'CH-100070-0-2p', desc:'Lab Grade Isopropanol 5L × 20',         supplier:'VWR International',       cost:3200, delivery:'2024-07-18',status:'Approved',priority:'Medium',match:87,approved:true },
  { id:'PO-2024-0003',material:'CH-400000-0-Mi', desc:'Optical Microscope Slides (×500)',       supplier:'Thermo Fisher Scientific',cost:845,  delivery:'2024-07-22',status:'Pending', priority:'Low',   match:91,approved:false},
  { id:'PO-2024-0004',material:'CH-800071-0-6N', desc:'Nitrogen Gas Cylinder 50L (99.999%)',    supplier:'Air Liquide Belgium',     cost:6700, delivery:'2024-07-25',status:'Approved',priority:'High',  match:96,approved:true },
  { id:'PO-2024-0005',material:'CH-400048-0-De', desc:'Deionised Water System DI-2000',         supplier:'Merck Millipore',         cost:18400,delivery:'2024-07-28',status:'Rejected',priority:'Medium',match:72,approved:false},
  { id:'PO-2024-0006',material:'CH-000000-0-A',  desc:'Cleanroom Gloves Class 10 XL (×1000)',   supplier:'Micronclean Ltd',         cost:1240, delivery:'2024-08-01',status:'Pending', priority:'High',  match:89,approved:false},
  { id:'PO-2024-0007',material:'CH-400412-0-HT', desc:'High-Temperature Resistant Cable 10m',   supplier:'RS Components',           cost:3850, delivery:'2024-08-05',status:'Approved',priority:'Low',   match:83,approved:true },
  { id:'PO-2024-0008',material:'CH-000010-6-2p', desc:'Precision Pipette Tips 200µL (×5000)',   supplier:'Eppendorf AG',            cost:2100, delivery:'2024-08-08',status:'Pending', priority:'Medium',match:92,approved:false},
  { id:'PO-2024-0009',material:'CH-400055-0-RE', desc:'Reflow Oven Controller Board REF-4',     supplier:'Heller Industries',       cost:41200,delivery:'2024-08-12',status:'Pending', priority:'High',  match:78,approved:false},
  { id:'PO-2024-0010',material:'CH-801120-0-Mic',desc:'SEM Sample Stub Aluminium (×50)',        supplier:'Agar Scientific',         cost:680,  delivery:'2024-08-15',status:'Approved',priority:'Low',   match:95,approved:true },
  { id:'PO-2024-0011',material:'CH-400071-0-EK', desc:'EKG Monitoring Module EK-32',            supplier:'Siemens Healthineers',    cost:8900, delivery:'2024-08-20',status:'Rejected',priority:'High',  match:65,approved:false},
  { id:'PO-2024-0012',material:'CH-100010-6-2p', desc:'PCB Soldering Flux Pen (×24)',           supplier:'MG Chemicals',            cost:420,  delivery:'2024-08-22',status:'Pending', priority:'Low',   match:88,approved:false},
];

const STATUS_BADGE = {
  Pending:  <span className="badge-gold">Pending</span>,
  Approved: <span className="badge-success">Approved</span>,
  Rejected: <span className="badge-danger">Rejected</span>,
};
const PRIORITY_COLOR = { High: C.gold, Medium: C.textPri, Low: C.textSec };

export default function ProcessedItemsView() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');
  const [selected, setSelected] = useState(new Set());

  const visible = orders.filter(o =>
    (filter === 'All' || o.status === filter) &&
    (o.desc.toLowerCase().includes(search.toLowerCase()) || o.material.toLowerCase().includes(search.toLowerCase()))
  );

  const toggle = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const kpis = [
    { label:'Total PO Requests',   value: orders.length,                                        gold:false },
    { label:'Pending Approval',    value: orders.filter(o=>o.status==='Pending').length,         gold:true  },
    { label:'Approved',            value: orders.filter(o=>o.status==='Approved').length,        gold:false },
    { label:'Avg Match Confidence',value:`${Math.round(orders.reduce((a,o)=>a+o.match,0)/orders.length)}%`, gold:true },
  ];

  return (
    <div>
      {/* KPIs */}
      <div className="kpi-efficiency-grid" style={{ marginBottom:20 }}>
        {kpis.map(({ label, value, gold }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-card__label">{label}</div>
            <div className="kpi-card__value" style={{ color: gold ? C.gold : C.textPri }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, marginBottom:12, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1 1 220px', maxWidth:320 }}>
          <Search size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.textSec }} />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search material or description…"
            className="form-input" style={{ paddingLeft:34, paddingTop:8, paddingBottom:8 }} />
        </div>
        {['All','Pending','Approved','Rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter===s ? 'btn-primary' : 'btn-outline'}`}>
            {s}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto', gap:6 }}>
          <SlidersHorizontal size={12} /> Filters
        </button>
        {selected.size > 0 && (
          <button className="btn btn-primary btn-sm">Approve {selected.size} selected</button>
        )}
      </div>

      {/* Table */}
      <div className="chart-section" style={{ overflow:'visible' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="dark-table">
            <thead>
              <tr>
                <th style={{ width:36 }}></th>
                {['Material','Description','Supplier','Cost [EUR]','Delivery','Status','Priority','Match','Approval'].map(h => (
                  <th key={h}><span style={{ display:'flex', alignItems:'center', gap:4 }}>{h} <ArrowUpDown size={9} color={C.border} /></span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((o,i) => (
                <tr key={o.id} style={{ cursor:'pointer', background: selected.has(o.id) ? 'rgba(204,162,62,0.06)' : undefined }}
                  onClick={() => toggle(o.id)}>
                  <td style={{ textAlign:'center' }}>
                    {selected.has(o.id)
                      ? <CheckSquare size={14} color={C.gold} />
                      : <Square size={14} color={C.border} />}
                  </td>
                  <td style={{ fontFamily:'var(--font-mono)', fontSize:10, color:C.gold, fontWeight:700 }}>{o.material}</td>
                  <td style={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.desc}</td>
                  <td style={{ color:C.textSec, whiteSpace:'nowrap', fontSize:11 }}>{o.supplier}</td>
                  <td style={{ textAlign:'right', fontWeight:700 }}>€{o.cost.toLocaleString()}</td>
                  <td style={{ color:C.textSec, whiteSpace:'nowrap' }}>{o.delivery}</td>
                  <td>{STATUS_BADGE[o.status]}</td>
                  <td style={{ fontWeight:700, color:PRIORITY_COLOR[o.priority] }}>{o.priority}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:60, height:4, background:C.border, borderRadius:2, overflow:'hidden' }}>
                        <div style={{ width:`${o.match}%`, height:'100%', borderRadius:2, background: o.match>=85?C.gold:o.match>=70?'#555':'#333' }} />
                      </div>
                      <span style={{ fontSize:11, color:C.textSec }}>{o.match}%</span>
                    </div>
                  </td>
                  <td>
                    {o.approved
                      ? <span style={{ color:C.green, fontWeight:700, fontSize:11 }}>✓ Approved</span>
                      : <button className="btn btn-outline btn-sm" onClick={e=>{e.stopPropagation()}} style={{ fontSize:11, padding:'4px 10px' }}>Review</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'12px 16px', borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:C.textSec }}>
          <span>Showing {visible.length} of {orders.length} items</span>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-ghost btn-sm">← Prev</button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-ghost btn-sm">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
