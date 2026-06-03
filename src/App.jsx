import { useState } from 'react';
import { Bell, Download, LayoutGrid, RefreshCw } from 'lucide-react';
import ProcessedItemsView    from './components/views/ProcessedItemsView';
import MaterialCatalogueView from './components/views/MaterialCatalogueView';
import FreeTextView          from './components/views/FreeTextView';
import SuggestionsView       from './components/views/SuggestionsView';

const TABS = [
  { id: 'overview',  label: 'Overview'   },
  { id: 'p2p',       label: 'P2P'        },
  { id: 'freetext',  label: 'Free Text'  },
  { id: 'cycletime', label: 'Cycle Time' },
];

export default function App() {
  const [active, setActive] = useState('freetext');

  return (
    <div className="fc-page">
      <header className="fc-header">
        <div className="fc-main-nav__inner">
          {/* Brand */}
          <div className="ofi-logo">
            <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--ofi-gold)', letterSpacing: '-1px' }}>
              <sup style={{ fontSize: 9, verticalAlign: 'super' }}>™</sup>imec
            </span>
          </div>
          {/* Tabs */}
          <nav className="fc-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`fc-nav__item${active === t.id ? ' fc-nav__item--active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="fc-nav__right">
            <button className="fc-nav__icon-btn"><RefreshCw size={13} /></button>
            <button className="fc-nav__icon-btn"><LayoutGrid size={13} /></button>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ofi-gold)',
              border: '1px solid var(--ofi-gold)', borderRadius: 20, padding: '3px 10px' }}>
              100%
            </span>
            <button className="fc-nav__icon-btn"><Bell size={13} /></button>
            <button className="fc-nav__icon-btn"><Download size={13} /></button>
          </div>
        </div>
      </header>

      <div className="fc-page__body">
        <main className="fc-page__main">
          {active === 'overview'  && <ProcessedItemsView />}
          {active === 'p2p'       && <MaterialCatalogueView />}
          {active === 'freetext'  && <FreeTextView />}
          {active === 'cycletime' && <SuggestionsView />}
        </main>
      </div>
    </div>
  );
}
