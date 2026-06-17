import { useState, useEffect } from 'react';
import { Search, ArrowUpDown, CheckCircle, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { C } from '../../lib/colors';
import { fetchMatchedCatalogue } from '../../lib/api';

const DEMO_orders = [
  { id:'PO-2024-0002', material:'CH-100070-0-2p',  desc:'Lab Grade Isopropanol 5L × 20',        supplier:'VWR International',        cost:3200,  delivery:'2024-07-18', status:'Approved', priority:'Medium', match:87, approved:true  },
  { id:'PO-2024-0004', material:'CH-800071-0-6N',  desc:'Nitrogen Gas Cylinder 50L (99.999%)',   supplier:'Air Liquide Belgium',      cost:6700,  delivery:'2024-07-25', status:'Approved', priority:'High',   match:96, approved:true  },
  { id:'PO-2024-0006', material:'CH-000000-0-A',   desc:'Cleanroom Gloves Class 10 XL (×1000)',  supplier:'Micronclean Ltd',          cost:1240,  delivery:'2024-08-01', status:'Pending',  priority:'High',   match:89, approved:false },
  { id:'PO-2024-0008', material:'CH-000010-6-2p',  desc:'Precision Pipette Tips 200µL (×5000)',  supplier:'Eppendorf AG',             cost:2100,  delivery:'2024-08-08', status:'Pending',  priority:'Medium', match:92, approved:false },
  { id:'PO-2024-0010', material:'CH-801120-0-Mic', desc:'SEM Sample Stub Aluminium (×50)',        supplier:'Agar Scientific',          cost:680,   delivery:'2024-08-15', status:'Approved', priority:'Low',    match:95, approved:true  },
  { id:'PO-2024-0005', material:'CH-400048-0-De',  desc:'Deionised Water System DI-2000',         supplier:'Merck Millipore',          cost:18400, delivery:'2024-07-28', status:'Rejected', priority:'Medium', match:72, approved:false },
];

// Normalise a Railway matched_catalog row → shape the table expects
function normaliseDbRow(row) {
  return {
    id:       row.id ?? row.draft_id ?? String(Math.random()),
    material: row.material_id ?? '—',
    desc:     row.description ?? '—',
    supplier: row.supplier ?? '—',
    cost:     Number(row.cost ?? 0),
    delivery: row.delivery_date
      ? new Date(row.delivery_date).toISOString().slice(0, 10)
      : '—',
    status:   row.status
      ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
      : 'Pending',
    priority: row.priority
      ? row.priority.charAt(0).toUpperCase() + row.priority.slice(1)
      : 'Medium',
    match:    Number(row.match_pct ?? row.confidence_score * 100 ?? 0),
    approved: row.status === 'approved',
    category: row.category ?? '',
    _fromDb:  true,
  };
}

export default function FreeTextView({ data }) {

  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dbRows,  setDbRows]            = useState([]);
  const [dbState, setDbState]           = useState('idle'); // 'idle' | 'loading' | 'ok' | 'error'

  const loadDb = () => {
    setDbState('loading');
    fetchMatchedCatalogue()
      .then(rows => { setDbRows(rows.map(normaliseDbRow)); setDbState('ok'); })
      .catch(() => setDbState('error'));
  };

  useEffect(() => { loadDb(); }, []);

  // DB rows first (live), then demo as padding when DB is empty
  const orders = dbRows.length > 0
    ? dbRows
    : (Array.isArray(data) && data.length > 0 ? data : DEMO_orders);

  const highConf = orders.filter(o => o.match >= 90).length;
  const medConf  = orders.filter(o => o.match >= 75 && o.match < 90).length;
  const avgMatch = orders.length ? Math.round(orders.reduce((a, o) => a + o.match, 0) / orders.length) : 0;

  const filtered = orders.filter(o => {
    const matchesSearch =
      (o.material ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (o.desc ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'All' || o.status === filterStatus;
    return matchesSearch && matchesFilter;

  });

  return (
    <div>

      {/* ════════════════════════════════════════════════════
          KPIs
          ════════════════════════════════════════════════════ */}
      <div className="kpi-efficiency-grid" style={{ marginBottom: 20, gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Matched Items',          value: orders.length, gold: false },
          { label: 'High Confidence (≥90%)', value: highConf,      gold: true  },
          { label: 'Medium Confidence',      value: medConf,       gold: false },
          { label: 'Avg Match Confidence',   value: `${avgMatch}%`,gold: true  },
        ].map(({ label, value, gold }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-card__value" style={{ color: gold ? C.gold : C.textPri }}>{value}</div>
            <div className="kpi-card__label">{label}</div>
            <div className="kpi-card__progress" style={{ marginTop: 10 }}>
              <div className="kpi-card__progress-fill" style={{
                width: gold ? '65%' : '80%',
                background: `linear-gradient(90deg,${C.gold},#E2C96A)`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          TABLE — Matched catalogue items with confidence
          ════════════════════════════════════════════════════ */}
      <div className="chart-section">

        {/* Header */}
        <div className="chart-section__header">
          <div className="chart-section__title-group">
            <div className="chart-section__icon"><ShieldCheck size={18} /></div>
            <div>
              <h3 className="chart-section__title">Matched Catalogue Items</h3>
              <p className="chart-section__subtitle">Free-text requisitions matched to catalogue materials with AI confidence scoring</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* DB live status badge */}
            {dbState === 'loading' && (
              <span style={{ fontSize: 11, color: C.textSec, display: 'flex', alignItems: 'center', gap: 5 }}>
                <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Loading from DB…
              </span>
            )}
            {dbState === 'ok' && dbRows.length > 0 && (
              <span style={{ fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Live · Railway DB
              </span>
            )}
            {dbState === 'ok' && dbRows.length === 0 && (
              <span style={{ fontSize: 11, color: C.textSec, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.textSec, display: 'inline-block' }} />
                No live data yet · showing demo
              </span>
            )}
            {dbState === 'error' && (
              <span style={{ fontSize: 11, color: C.red, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.red, display: 'inline-block' }} />
                DB unreachable · showing demo
              </span>
            )}
            {/* Refresh */}
            <button onClick={loadDb} title="Refresh from DB" className="fc-nav__icon-btn" style={{ padding: '5px 8px', borderRadius: 6 }}>
              <RefreshCw size={13} />
            </button>
            {/* Item count pill */}
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
              background: 'rgba(204,162,62,0.12)', color: C.gold,
              border: `1px solid rgba(204,162,62,0.3)`,
            }}>
              {orders.length} item{orders.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>


        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.textSec }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search material or description..."
              className="form-input"
              style={{ paddingLeft: 30, paddingTop: 7, paddingBottom: 7, width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: 'none',
                background: filterStatus === s ? C.gold : 'transparent',
                color: filterStatus === s ? C.black : C.textSec,
                outline: filterStatus === s ? 'none' : `1px solid ${C.border}`,
              }}>{s}</button>
            ))}
          </div>
          <button className="fc-nav__icon-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 6, fontSize: 12, color: C.textSec }}>
            <ArrowUpDown size={12} /> Filters
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dark-table">
            <thead>
              <tr>
                <th style={{ width: 32, textAlign: 'center' }}></th>
                {['MATERIAL', 'DESCRIPTION', 'SUPPLIER', 'COST [EUR]', 'DELIVERY', 'STATUS', 'PRIORITY', 'MATCH', 'APPROVAL'].map(h => {
                  const isCenter = ['COST [EUR]'].includes(h);
                  return (
                  <th key={h} style={{ textAlign: isCenter ? 'center' : 'left' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: isCenter ? 'center' : 'flex-start', gap: 4 }}>
                      {h} <ArrowUpDown size={9} color={C.border} />
                    </span>
                  </th>
                )})}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td style={{ textAlign: 'center' }}><input type="checkbox" style={{ accentColor: C.gold }} /></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: C.gold, fontWeight: 700 }}>{o.material}</td>
                  <td style={{ maxWidth: 220 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.desc}
                    </span>
                  </td>
                  <td style={{ color: C.textSec }}>{o.supplier}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>€{(o.cost ?? 0).toLocaleString()}</td>
                  <td style={{ color: C.textSec }}>{o.delivery}</td>
                  <td>
                    <span className={
                      o.status === 'Approved' ? 'badge-success' :
                      o.status === 'Rejected' ? 'badge-danger' : 'badge-gold'
                    } style={{ fontSize: 10 }}>{o.status}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: o.priority === 'High' ? C.gold : C.textPri }}>{o.priority}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 4, borderRadius: 2, background: C.border, overflow: 'hidden' }}>
                        <div style={{
                          width: `${o.match}%`, height: '100%', borderRadius: 2,
                          background: o.match >= 90 ? C.gold : o.match >= 75 ? '#E2A020' : C.textSec,
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: C.textSec, minWidth: 28 }}>{o.match}%</span>
                      {o.match >= 90
                        ? <CheckCircle size={12} color={C.gold}    />
                        : o.match >= 75
                          ? <ShieldCheck size={12} color="#E2A020"  />
                          : <AlertCircle size={12} color={C.textSec}/>
                      }
                    </div>
                  </td>
                  <td>
                    {o.approved
                      ? <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 600 }}>✓ Approved</span>
                      : <span style={{ color: C.textSec, fontSize: 12 }}>Review</span>
                    }
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: C.textSec }}>
                    No matched items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
