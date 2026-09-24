import React, { useState, useEffect } from 'react';
import { DUMMY_JOB_REQUESTS, SERVICE_CATEGORIES } from './workerData.js';

// ─── Injected styles ──────────────────────────────────────────────────────────
const HOME_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0f1e;--surface:#111827;--card:#161f35;--border:#1e2d4a;
  --accent:#10b981;--accent2:#3b82f6;--warn:#f59e0b;--danger:#ef4444;
  --text:#f1f5f9;--muted:#64748b;--subtle:#1e293b;
  --radius:14px;--font:'Plus Jakarta Sans',sans-serif;
}
html,body,#root{height:100%;font-family:var(--font);background:var(--bg);color:var(--text)}

/* LAYOUT */
.wh-wrap{display:flex;flex-direction:column;min-height:100vh;}
.wh-header{
  display:flex;align-items:center;gap:14px;
  padding:14px 24px;
  background:var(--surface);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:100;
}
.wh-brand{font-size:17px;font-weight:800;}
.wh-brand span{color:var(--accent);}
.wh-badge{
  font-size:11px;background:rgba(16,185,129,.15);color:#34d399;
  padding:4px 10px;border-radius:20px;font-weight:700;border:1px solid rgba(16,185,129,.3);
}
.wh-status-toggle{
  display:flex;align-items:center;gap:8px;margin-left:auto;
  padding:8px 14px;border-radius:20px;
  cursor:pointer;border:1.5px solid var(--border);
  background:var(--card);font-size:13px;font-weight:600;
  transition:.2s;
}
.wh-status-toggle:hover{border-color:var(--accent);}
.status-dot{width:8px;height:8px;border-radius:50%;transition:.3s;}
.status-dot.online{background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.25);}
.status-dot.offline{background:var(--muted);}
.wh-avatar{
  width:36px;height:36px;border-radius:50%;
  background:linear-gradient(135deg,#10b981,#059669);
  display:grid;place-items:center;
  font-size:14px;font-weight:800;color:#fff;cursor:pointer;flex-shrink:0;
}

.wh-body{flex:1;display:flex;gap:0;overflow:hidden;}
.wh-sidebar{
  width:280px;flex-shrink:0;
  background:var(--surface);border-right:1px solid var(--border);
  padding:20px;display:flex;flex-direction:column;gap:14px;
  overflow-y:auto;
}
.wh-main{flex:1;overflow-y:auto;padding:24px;}

/* STAT CARDS */
.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;}
.stat-card{
  background:var(--card);border:1px solid var(--border);border-radius:var(--radius);
  padding:16px;display:flex;flex-direction:column;gap:6px;
  transition:.2s;
}
.stat-card:hover{border-color:var(--border);box-shadow:0 4px 20px rgba(0,0,0,.3);}
.stat-icon{font-size:22px;}
.stat-label{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;}
.stat-val{font-size:22px;font-weight:800;color:var(--text);}
.stat-sub{font-size:11px;color:var(--accent);}

/* SIDEBAR PROFILE */
.sb-profile{
  background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;
  display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;
}
.sb-avatar{
  width:56px;height:56px;border-radius:50%;
  background:linear-gradient(135deg,#10b981,#059669);
  display:grid;place-items:center;
  font-size:20px;font-weight:800;color:#fff;
  border:3px solid rgba(16,185,129,.4);
}
.sb-name{font-size:15px;font-weight:700;}
.sb-role{font-size:12px;color:var(--accent);font-weight:600;}
.sb-rating{font-size:13px;color:var(--warn);font-weight:700;}

.sb-stats{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;}
.sb-stat{background:var(--subtle);border-radius:8px;padding:10px;text-align:center;}
.sb-stat-val{font-size:16px;font-weight:800;}
.sb-stat-label{font-size:10px;color:var(--muted);margin-top:2px;}

.sb-section{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-top:4px;}
.sb-cats{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
.sb-cat-tag{
  font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;
  background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.3);color:#60a5fa;
}
.sb-avail{
  width:100%;padding:10px 14px;border-radius:10px;
  background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);
  font-size:12px;color:#34d399;text-align:center;font-weight:600;
}

/* JOB CARDS */
.jobs-section-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:16px;
}
.jobs-section-title{font-size:18px;font-weight:800;}
.jobs-section-count{
  font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;
  background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3);color:var(--warn);
}
.jobs-live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.2);margin-right:5px;animation:pulse 1.5s infinite;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 3px rgba(16,185,129,.2)}50%{box-shadow:0 0 0 6px rgba(16,185,129,.05)}}

.job-card{
  background:var(--card);border:1px solid var(--border);border-radius:18px;
  margin-bottom:16px;overflow:hidden;transition:.3s;
}
.job-card:hover{border-color:rgba(59,130,246,.4);box-shadow:0 8px 32px rgba(0,0,0,.35);}
.job-card.accepted{border-color:rgba(16,185,129,.4);}
.job-card.rejected{opacity:.45;}

.job-card-top{padding:18px 20px;display:flex;gap:14px;align-items:flex-start;}
.job-cat-badge{
  width:46px;height:46px;border-radius:14px;
  display:grid;place-items:center;font-size:22px;flex-shrink:0;
  background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.2);
}
.job-info{flex:1;}
.job-urgency-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.job-urgency{
  font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;
  text-transform:uppercase;letter-spacing:.06em;
}
.job-urgency.urgent{background:rgba(239,68,68,.15);color:#f87171;border:1px solid rgba(239,68,68,.2);}
.job-urgency.normal{background:rgba(59,130,246,.12);color:#60a5fa;border:1px solid rgba(59,130,246,.2);}
.job-posted{font-size:11px;color:var(--muted);}
.job-title{font-size:16px;font-weight:800;margin-bottom:4px;}
.job-desc{font-size:13px;color:var(--muted);line-height:1.5;margin-bottom:10px;}
.job-meta-row{display:flex;gap:12px;flex-wrap:wrap;}
.job-meta-item{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--muted);font-weight:500;}
.job-meta-item strong{color:var(--text);}

.job-card-footer{
  border-top:1px solid var(--border);padding:14px 20px;
  display:flex;align-items:center;gap:10px;
}
.job-pay{
  font-size:18px;font-weight:800;color:var(--accent);
  margin-right:auto;
}
.job-pay small{font-size:11px;color:var(--muted);font-weight:500;}
.job-btn{
  padding:10px 20px;border:none;border-radius:10px;
  font-size:13px;font-weight:700;cursor:pointer;
  font-family:var(--font);transition:.2s;
}
.job-btn:hover{transform:translateY(-1px);}
.job-btn.accept{background:linear-gradient(135deg,#10b981,#059669);color:#fff;}
.job-btn.accept:hover{box-shadow:0 6px 20px rgba(16,185,129,.35);}
.job-btn.reject{background:var(--subtle);border:1px solid var(--border);color:var(--muted);}
.job-btn.reject:hover{border-color:var(--danger);color:#f87171;}

/* JOB EXPANDED (accepted) */
.job-expanded{background:var(--subtle);border-top:1px solid var(--border);}

/* MATERIALS SECTION */
.materials-section{padding:18px 20px;border-bottom:1px solid var(--border);}
.materials-title{font-size:13px;font-weight:800;color:var(--text);margin-bottom:12px;display:flex;align-items:center;gap:6px;}
.material-row{
  display:flex;align-items:center;gap:10px;
  padding:10px 12px;background:var(--card);border:1px solid var(--border);
  border-radius:10px;margin-bottom:8px;cursor:pointer;transition:.2s;
}
.material-row:hover{border-color:var(--border);}
.material-row.needed{border-color:rgba(16,185,129,.35);background:rgba(16,185,129,.06);}
.material-checkbox{
  width:20px;height:20px;border-radius:6px;
  border:2px solid var(--border);display:grid;place-items:center;
  transition:.2s;flex-shrink:0;font-size:12px;
}
.material-checkbox.checked{background:var(--accent);border-color:var(--accent);color:#fff;}
.material-name{flex:1;font-size:13px;font-weight:600;color:var(--text);}
.material-price{font-size:12px;color:var(--accent);font-weight:700;}
.material-req-badge{
  font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;
  background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.25);color:var(--warn);
}

.add-material-row{display:flex;gap:8px;margin-top:8px;}
.mat-input{
  flex:1;padding:10px 12px;background:var(--card);
  border:1px solid var(--border);border-radius:10px;
  color:var(--text);font-size:13px;font-family:var(--font);
}
.mat-input:focus{outline:none;border-color:var(--accent);}
.mat-add-btn{
  padding:10px 14px;border:none;border-radius:10px;
  background:var(--accent2);color:#fff;font-size:13px;font-weight:700;
  cursor:pointer;font-family:var(--font);
}

/* PRICE ESTIMATION */
.price-section{padding:18px 20px;}
.price-title{font-size:13px;font-weight:800;color:var(--text);margin-bottom:12px;display:flex;align-items:center;gap:6px;}
.price-breakdown{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.price-row-item{
  display:flex;align-items:center;gap:10px;
  padding:10px 12px;background:var(--card);border:1px solid var(--border);border-radius:10px;
}
.price-row-label{flex:1;font-size:13px;color:var(--muted);}
.price-inp{
  width:90px;padding:8px 10px;text-align:right;
  background:var(--subtle);border:1px solid var(--border);
  border-radius:8px;color:var(--text);font-size:14px;font-weight:700;
  font-family:var(--font);
}
.price-inp:focus{outline:none;border-color:var(--accent);}
.price-total-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:12px 14px;background:rgba(16,185,129,.08);
  border:1px solid rgba(16,185,129,.25);border-radius:10px;
}
.price-total-label{font-size:14px;font-weight:700;color:var(--text);}
.price-total-val{font-size:22px;font-weight:800;color:var(--accent);}

.inspection-note{
  width:100%;padding:10px 12px;min-height:70px;resize:vertical;
  background:var(--card);border:1px solid var(--border);border-radius:10px;
  color:var(--text);font-size:13px;font-family:var(--font);margin-bottom:12px;
}
.inspection-note:focus{outline:none;border-color:var(--accent);}

.submit-estimate-btn{
  width:100%;padding:14px;border:none;border-radius:12px;
  background:linear-gradient(135deg,#10b981,#059669);
  color:#fff;font-size:15px;font-weight:700;cursor:pointer;
  font-family:var(--font);transition:.2s;
}
.submit-estimate-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(16,185,129,.35);}

/* SENT BADGE */
.estimate-sent{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:28px;gap:10px;text-align:center;
}
.estimate-sent-icon{font-size:44px;}
.estimate-sent-title{font-size:16px;font-weight:800;color:var(--accent);}
.estimate-sent-sub{font-size:13px;color:var(--muted);line-height:1.5;}

/* EMPTY STATE */
.empty-jobs{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:64px 24px;gap:12px;text-align:center;
}
.empty-jobs-icon{font-size:52px;}
.empty-jobs-title{font-size:18px;font-weight:700;}
.empty-jobs-sub{font-size:14px;color:var(--muted);max-width:320px;line-height:1.6;}

/* NOTIFICATION DOT */
.notif-badge{
  display:inline-flex;align-items:center;justify-content:center;
  width:20px;height:20px;border-radius:50%;
  background:var(--danger);color:#fff;font-size:10px;font-weight:800;
  margin-left:6px;
}

/* HISTORY SECTION */
.history-card{
  display:flex;gap:12px;padding:14px 16px;
  background:var(--card);border:1px solid var(--border);border-radius:12px;
  margin-bottom:10px;
}
.history-icon{font-size:22px;}
.history-info{flex:1;}
.history-title{font-size:13px;font-weight:700;margin-bottom:2px;}
.history-sub{font-size:12px;color:var(--muted);}
.history-pay{font-size:15px;font-weight:800;color:var(--accent);}
.history-date{font-size:11px;color:var(--muted);}

/* TABS */
.page-tabs{display:flex;gap:4px;margin-bottom:20px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:4px;}
.page-tab{
  flex:1;padding:9px;text-align:center;font-size:13px;font-weight:600;
  border:none;background:none;color:var(--muted);cursor:pointer;border-radius:9px;
  transition:.2s;font-family:var(--font);
}
.page-tab.active{background:var(--accent2);color:#fff;}

/* RESPONSIVE */
@media(max-width:768px){
  .wh-sidebar{display:none;}
  .stat-row{grid-template-columns:repeat(2,1fr);}
}
`;

function StyleOnce() {
  if (document.getElementById('whome-style')) return null;
  const s = document.createElement('style');
  s.id = 'whome-style';
  s.textContent = HOME_STYLE;
  document.head.appendChild(s);
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ─── Material Checklist Row ───────────────────────────────────────────────────
function MaterialRow({ mat, checked, onToggle }) {
  return (
    <div className={`material-row ${checked ? 'needed' : ''}`} onClick={onToggle}>
      <div className={`material-checkbox ${checked ? 'checked' : ''}`}>
        {checked && '✓'}
      </div>
      <span className="material-name">{mat.name}</span>
      {mat.required && <span className="material-req-badge">Required</span>}
      {mat.price > 0 && <span className="material-price">₹{mat.price}</span>}
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onAccept, onReject }) {
  const [checkedMaterials, setCheckedMaterials] = useState(
    job.materials.filter(m => m.required).map(m => m.name),
  );
  const [customMaterials, setCustomMaterials] = useState([]);
  const [customMatName, setCustomMatName] = useState('');
  const [customMatPrice, setCustomMatPrice] = useState('');
  const [prices, setPrices] = useState({
    labour: job.estimatedPay,
    materials: 0,
    visitingFee: 69,
    discount: 0,
  });
  const [note, setNote] = useState('');
  const [estimateSent, setEstimateSent] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');

  const allMaterials = [...job.materials, ...customMaterials];
  const checkedMats = allMaterials.filter(m => checkedMaterials.includes(m.name));
  const materialsCost = checkedMats.reduce((sum, m) => sum + (m.price || 0), 0);
  const total = Math.max(0, prices.labour + materialsCost + prices.visitingFee - prices.discount);

  const toggleMat = (name) =>
    setCheckedMaterials(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name],
    );

  const addCustomMaterial = () => {
    if (!customMatName.trim()) return;
    setCustomMaterials(prev => [
      ...prev,
      { name: customMatName.trim(), required: false, price: parseInt(customMatPrice) || 0 },
    ]);
    setCheckedMaterials(prev => [...prev, customMatName.trim()]);
    setCustomMatName('');
    setCustomMatPrice('');
  };

  const sendEstimate = () => {
    setEstimateSent(true);
  };

  // PENDING
  if (job.status === 'pending') {
    return (
      <div className="job-card">
        <div className="job-card-top">
          <div className="job-cat-badge">{job.categoryIcon}</div>
          <div className="job-info">
            <div className="job-urgency-row">
              <span className={`job-urgency ${job.urgency}`}>
                {job.urgency === 'urgent' ? '🔴 Urgent' : '🔵 Standard'}
              </span>
              <span className="job-posted">Posted {job.postedAgo}</span>
            </div>
            <h3 className="job-title">{job.issue}</h3>
            <p className="job-desc">{job.description}</p>
            <div className="job-meta-row">
              <span className="job-meta-item">👤 <strong>{job.customer}</strong></span>
              <span className="job-meta-item">⭐ <strong>{job.customerRating}</strong></span>
              <span className="job-meta-item">📍 <strong>{job.distance} km</strong></span>
              <span className="job-meta-item">⚡ ETA <strong>{job.eta}</strong></span>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 20px 14px', fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📍</span> {job.address}
        </div>
        <div className="job-card-footer">
          <div className="job-pay">
            ₹{job.estimatedPay} <small>est. pay</small>
          </div>
          <button className="job-btn reject" onClick={() => onReject(job.id)}>
            ✕ Decline
          </button>
          <button className="job-btn accept" onClick={() => onAccept(job.id)}>
            ⚡ Accept Job
          </button>
        </div>
      </div>
    );
  }

  // REJECTED
  if (job.status === 'rejected') {
    return (
      <div className="job-card rejected">
        <div className="job-card-top" style={{ opacity: .5 }}>
          <div className="job-cat-badge">{job.categoryIcon}</div>
          <div className="job-info">
            <h3 className="job-title">{job.issue}</h3>
            <p className="job-desc" style={{ fontSize: 12 }}>You declined this request.</p>
          </div>
        </div>
      </div>
    );
  }

  // ACCEPTED — full inspection + estimate panel
  return (
    <div className="job-card accepted">
      <div className="job-card-top">
        <div className="job-cat-badge">{job.categoryIcon}</div>
        <div className="job-info">
          <div className="job-urgency-row">
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,.15)', color: '#34d399', border: '1px solid rgba(16,185,129,.25)' }}>
              ✅ Accepted
            </span>
            <span className="job-posted">Posted {job.postedAgo}</span>
          </div>
          <h3 className="job-title">{job.issue}</h3>
          <div className="job-meta-row">
            <span className="job-meta-item">👤 <strong>{job.customer}</strong></span>
            <span className="job-meta-item">📍 <strong>{job.distance} km away</strong></span>
            <span className="job-meta-item">⚡ <strong>{job.eta}</strong></span>
          </div>
        </div>
      </div>

      <div className="job-expanded">
        {/* Sub-tabs */}
        <div style={{ padding: '12px 20px 0' }}>
          <div className="page-tabs">
            {['materials', 'estimate'].map(t => (
              <button
                key={t}
                className={`page-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t === 'materials' ? '🔩 Materials Needed' : '💰 Price Estimate'}
              </button>
            ))}
          </div>
        </div>

        {/* MATERIALS TAB */}
        {activeTab === 'materials' && (
          <div className="materials-section">
            <p className="materials-title">
              🔩 Required Materials &amp; Tools
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginLeft: 4 }}>
                (Check items you'll need to bring)
              </span>
            </p>

            {allMaterials.map(mat => (
              <MaterialRow
                key={mat.name}
                mat={mat}
                checked={checkedMaterials.includes(mat.name)}
                onToggle={() => toggleMat(mat.name)}
              />
            ))}

            {/* Add custom material */}
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
              + Add any extra item you need:
            </p>
            <div className="add-material-row">
              <input
                className="mat-input"
                placeholder="Material / tool name"
                value={customMatName}
                onChange={e => setCustomMatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomMaterial()}
              />
              <input
                className="mat-input"
                style={{ width: 80 }}
                placeholder="₹ cost"
                value={customMatPrice}
                onChange={e => setCustomMatPrice(e.target.value.replace(/\D/, ''))}
                inputMode="numeric"
              />
              <button className="mat-add-btn" onClick={addCustomMaterial}>Add</button>
            </div>

            {checkedMats.length > 0 && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 10, fontSize: 13 }}>
                <span style={{ color: 'var(--muted)' }}>Estimated materials cost: </span>
                <strong style={{ color: 'var(--accent)' }}>₹{materialsCost}</strong>
                <span style={{ color: 'var(--muted)', marginLeft: 8, fontSize: 12 }}>({checkedMats.length} items selected)</span>
              </div>
            )}
          </div>
        )}

        {/* PRICE ESTIMATE TAB */}
        {activeTab === 'estimate' && (
          <div className="price-section">
            {estimateSent ? (
              <div className="estimate-sent">
                <div className="estimate-sent-icon">📨</div>
                <p className="estimate-sent-title">Estimate Sent to Customer!</p>
                <p className="estimate-sent-sub">
                  {job.customer} will receive your price breakdown of <strong style={{ color: 'var(--accent)' }}>₹{total}</strong>. 
                  They'll confirm or negotiate before you begin work.
                </p>
                <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {checkedMats.map(m => (
                    <span key={m.name} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'var(--subtle)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                      {m.name} {m.price > 0 ? `₹${m.price}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p className="price-title">
                  💰 Submit Your Price Estimate
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>
                    — after on-site inspection
                  </span>
                </p>

                <div className="price-breakdown">
                  {[
                    { key: 'labour', label: '🔧 Labour / Service Charge' },
                    { key: 'visitingFee', label: '🚗 Visiting Fee' },
                    { key: 'discount', label: '🏷️ Discount / Promo' },
                  ].map(row => (
                    <div className="price-row-item" key={row.key}>
                      <span className="price-row-label">{row.label}</span>
                      <span style={{ color: 'var(--muted)', fontSize: 13 }}>₹</span>
                      <input
                        className="price-inp"
                        type="number"
                        min="0"
                        value={prices[row.key]}
                        onChange={e => setPrices(p => ({ ...p, [row.key]: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  ))}

                  {/* Materials (auto from checklist) */}
                  {materialsCost > 0 && (
                    <div className="price-row-item">
                      <span className="price-row-label">🔩 Materials Cost ({checkedMats.length} items)</span>
                      <span style={{ color: 'var(--accent)', fontSize: 15, fontWeight: 700 }}>₹{materialsCost}</span>
                    </div>
                  )}
                </div>

                <div className="price-total-row" style={{ marginBottom: 14 }}>
                  <span className="price-total-label">Total Estimated Cost</span>
                  <span className="price-total-val">₹{total}</span>
                </div>

                <textarea
                  className="inspection-note"
                  placeholder="📝 Add inspection notes (e.g. 'Condenser is blown, fan motor also needs lubrication. Will require 1–2 hrs of work.')"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />

                <button className="submit-estimate-btn" onClick={sendEstimate}>
                  📨 Send Estimate to Customer (₹{total})
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Worker Home ─────────────────────────────────────────────────────────
export default function WorkerHomePage({ worker, onSignOut }) {
  const [online, setOnline] = useState(true);
  const [jobs, setJobs] = useState(DUMMY_JOB_REQUESTS);
  const [activePageTab, setActivePageTab] = useState('jobs');

  const workerName = worker?.name || 'Ravi Kumar';
  const workerCats = worker?.selectedCategories || ['electrical', 'plumbing'];
  const catLabels = SERVICE_CATEGORIES.filter(c => workerCats.includes(c.id));

  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const acceptedJobs = jobs.filter(j => j.status === 'accepted');

  const acceptJob = (id) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'accepted' } : j));
  const rejectJob = (id) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'rejected' } : j));

  const HISTORY = [
    { icon: '⚡', title: 'Fan Motor Replacement', sub: 'Indiranagar • 2 hrs', pay: 480, date: 'Sep 23' },
    { icon: '🔧', title: 'Bathroom Leakage Fix', sub: 'Koramangala • 1.5 hrs', pay: 320, date: 'Sep 22' },
    { icon: '⚡', title: 'Switchboard Wiring', sub: 'HSR Layout • 3 hrs', pay: 650, date: 'Sep 21' },
  ];

  return (
    <>
      <StyleOnce />
      <div className="wh-wrap">
        {/* HEADER */}
        <div className="wh-header">
          <div className="wh-brand">Labou<span>Rack</span></div>
          <span className="wh-badge">Worker Portal</span>
          <div
            className="wh-status-toggle"
            onClick={() => setOnline(o => !o)}
            title="Toggle online status"
          >
            <span className={`status-dot ${online ? 'online' : 'offline'}`} />
            <span>{online ? 'Online' : 'Offline'}</span>
          </div>
          <div className="wh-avatar" title={workerName} onClick={onSignOut}>
            {initials(workerName)}
          </div>
        </div>

        <div className="wh-body">
          {/* SIDEBAR */}
          <aside className="wh-sidebar">
            <div className="sb-profile">
              <div className="sb-avatar">{initials(workerName)}</div>
              <p className="sb-name">{workerName}</p>
              <p className="sb-role">Verified Gig Worker</p>
              <p className="sb-rating">⭐ 4.9 / 5.0 (142 reviews)</p>
              <div className="sb-stats">
                <div className="sb-stat">
                  <p className="sb-stat-val">184</p>
                  <p className="sb-stat-label">Jobs Done</p>
                </div>
                <div className="sb-stat">
                  <p className="sb-stat-val">₹1.4L</p>
                  <p className="sb-stat-label">Total Earned</p>
                </div>
              </div>
            </div>

            <p className="sb-section">My Services</p>
            <div className="sb-cats">
              {catLabels.length > 0
                ? catLabels.map(c => (
                  <span key={c.id} className="sb-cat-tag">{c.icon} {c.label}</span>
                ))
                : ['⚡ Electrical', '🔧 Plumbing'].map(t => (
                  <span key={t} className="sb-cat-tag">{t}</span>
                ))
              }
            </div>

            <div className="sb-avail">
              🕐 Working: 08:00 AM – 08:00 PM
            </div>

            <p className="sb-section">Location</p>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              📍 Indiranagar, Bengaluru – 560038<br />
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>🟢 Active in 3 km radius</span>
            </div>

            <button
              onClick={onSignOut}
              style={{ marginTop: 'auto', padding: '10px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}
            >
              Sign Out
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <main className="wh-main">
            {/* STATS */}
            <div className="stat-row">
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <span className="stat-label">Today's Earnings</span>
                <span className="stat-val">₹1,450</span>
                <span className="stat-sub">↑ ₹250 vs yesterday</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✅</span>
                <span className="stat-label">Jobs Completed</span>
                <span className="stat-val">4</span>
                <span className="stat-sub">Today</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⭐</span>
                <span className="stat-label">Avg Rating</span>
                <span className="stat-val">4.9</span>
                <span className="stat-sub">142 reviews</span>
              </div>
            </div>

            {/* PAGE TABS */}
            <div className="page-tabs">
              <button
                className={`page-tab ${activePageTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setActivePageTab('jobs')}
              >
                📋 Job Requests
                {pendingJobs.length > 0 && (
                  <span className="notif-badge">{pendingJobs.length}</span>
                )}
              </button>
              <button
                className={`page-tab ${activePageTab === 'active' ? 'active' : ''}`}
                onClick={() => setActivePageTab('active')}
              >
                ⚡ Active Jobs ({acceptedJobs.length})
              </button>
              <button
                className={`page-tab ${activePageTab === 'history' ? 'active' : ''}`}
                onClick={() => setActivePageTab('history')}
              >
                📁 History
              </button>
            </div>

            {/* JOB REQUESTS TAB */}
            {activePageTab === 'jobs' && (
              <>
                <div className="jobs-section-header">
                  <h2 className="jobs-section-title">
                    <span className="jobs-live-dot" />
                    Live Job Requests
                  </h2>
                  {pendingJobs.length > 0 && (
                    <span className="jobs-section-count">
                      {pendingJobs.length} New
                    </span>
                  )}
                </div>

                {!online && (
                  <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
                    ⚠️ You are currently <strong>offline</strong>. Toggle the status button above to receive job requests.
                  </div>
                )}

                {pendingJobs.length === 0 ? (
                  <div className="empty-jobs">
                    <div className="empty-jobs-icon">📭</div>
                    <p className="empty-jobs-title">No new requests right now</p>
                    <p className="empty-jobs-sub">
                      Stay online and nearby to receive new job notifications in real-time.
                    </p>
                  </div>
                ) : (
                  jobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onAccept={acceptJob}
                      onReject={rejectJob}
                    />
                  ))
                )}
              </>
            )}

            {/* ACTIVE JOBS TAB */}
            {activePageTab === 'active' && (
              <>
                <div className="jobs-section-header">
                  <h2 className="jobs-section-title">⚡ Active / Accepted Jobs</h2>
                </div>
                {acceptedJobs.length === 0 ? (
                  <div className="empty-jobs">
                    <div className="empty-jobs-icon">🔍</div>
                    <p className="empty-jobs-title">No active jobs</p>
                    <p className="empty-jobs-sub">Accept a request from the Job Requests tab to see it here.</p>
                  </div>
                ) : (
                  acceptedJobs.map(job => (
                    <JobCard key={job.id} job={job} onAccept={acceptJob} onReject={rejectJob} />
                  ))
                )}
              </>
            )}

            {/* HISTORY TAB */}
            {activePageTab === 'history' && (
              <>
                <div className="jobs-section-header">
                  <h2 className="jobs-section-title">📁 Completed Jobs</h2>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Last 30 days</span>
                </div>
                <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
                  {[
                    { label: 'Total Jobs', val: '184', color: 'var(--accent2)' },
                    { label: 'Earnings', val: '₹1.4L', color: 'var(--accent)' },
                    { label: 'Avg Rating', val: '4.9 ★', color: 'var(--warn)' },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, padding: '12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
                      <p style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                {HISTORY.map(h => (
                  <div key={h.title} className="history-card">
                    <span className="history-icon">{h.icon}</span>
                    <div className="history-info">
                      <p className="history-title">{h.title}</p>
                      <p className="history-sub">{h.sub}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="history-pay">₹{h.pay}</p>
                      <p className="history-date">{h.date}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
