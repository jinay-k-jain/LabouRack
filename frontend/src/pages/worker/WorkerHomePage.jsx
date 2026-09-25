import React, { useState, useEffect } from 'react';
import { DUMMY_JOB_REQUESTS, SERVICE_CATEGORIES } from './workerData.js';

// ─── Injected styles ──────────────────────────────────────────────────────────
const HOME_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f5f8f6;--surface:#ffffff;--card:#ffffff;--border:#e3e8e4;
  --accent:#0b6b46;--accent2:#1d4ed8;--warn:#d97706;--danger:#dc2626;
  --text:#0f1914;--muted:#617368;--subtle:#f0f5f3;
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
  font-size:11px;background:rgba(11,107,70,.1);color:#0b6b46;
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
.status-dot.online{background:#0b6b46;box-shadow:0 0 0 3px rgba(11,107,70,.2);}
.status-dot.offline{background:#94a3b8;}
.wh-avatar{
  width:36px;height:36px;border-radius:50%;
  background:linear-gradient(135deg,#0b6b46,#059669);
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
.stat-card:hover{border-color:#d4ded7;box-shadow:0 4px 16px rgba(15,25,20,.08);}
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
  background:linear-gradient(135deg,#0b6b46,#059669);
  display:grid;place-items:center;
  font-size:20px;font-weight:800;color:#fff;
  border:3px solid rgba(11,107,70,.3);
}
.sb-name{font-size:15px;font-weight:700;}
.sb-role{font-size:12px;color:#0b6b46;font-weight:600;}
.sb-rating{font-size:13px;color:#d97706;font-weight:700;}

.sb-stats{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;}
.sb-stat{background:var(--subtle);border-radius:8px;padding:10px;text-align:center;}
.sb-stat-val{font-size:16px;font-weight:800;}
.sb-stat-label{font-size:10px;color:var(--muted);margin-top:2px;}

.sb-section{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-top:4px;}
.sb-cats{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
.sb-cat-tag{
  font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;
  background:rgba(29,78,216,.08);border:1px solid rgba(29,78,216,.2);color:#1d4ed8;
}
.sb-avail{
  width:100%;padding:10px 14px;border-radius:10px;
  background:rgba(11,107,70,.06);border:1px solid rgba(11,107,70,.15);
  font-size:12px;color:#0b6b46;text-align:center;font-weight:600;
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
.jobs-live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#0b6b46;box-shadow:0 0 0 3px rgba(11,107,70,.15);margin-right:5px;animation:pulse 1.5s infinite;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 3px rgba(11,107,70,.15)}50%{box-shadow:0 0 0 6px rgba(11,107,70,.05)}}

.job-card{
  background:var(--card);border:1px solid var(--border);border-radius:18px;
  margin-bottom:16px;overflow:hidden;transition:.3s;
}
.job-card:hover{border-color:#c5d0c8;box-shadow:0 8px 24px rgba(15,25,20,.08);}
.job-card.accepted{border-color:rgba(11,107,70,.35);}
.job-card.rejected{opacity:.45;}

.job-card-top{padding:18px 20px;display:flex;gap:14px;align-items:flex-start;}
.job-cat-badge{
  width:46px;height:46px;border-radius:14px;
  display:grid;place-items:center;font-size:22px;flex-shrink:0;
  background:rgba(29,78,216,.08);border:1px solid rgba(29,78,216,.15);
}
.job-info{flex:1;}
.job-urgency-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.job-urgency{
  font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;
  text-transform:uppercase;letter-spacing:.06em;
}
.job-urgency.urgent{background:rgba(220,38,38,.08);color:#dc2626;border:1px solid rgba(220,38,38,.15);}
.job-urgency.normal{background:rgba(29,78,216,.08);color:#1d4ed8;border:1px solid rgba(29,78,216,.15);}
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
.job-btn.accept{background:linear-gradient(135deg,#0b6b46,#059669);color:#fff;}
.job-btn.accept:hover{box-shadow:0 6px 20px rgba(11,107,70,.25);}
.job-btn.reject{background:#f8faf9;border:1px solid var(--border);color:var(--muted);}
.job-btn.reject:hover{border-color:var(--danger);color:#dc2626;}

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
.page-tab.active{background:var(--accent);color:#fff;}

/* INSURANCE SECTION */
.sb-insurance{width:100%;display:flex;flex-direction:column;gap:8px;}
.insurance-card{
  display:flex;align-items:center;gap:10px;
  padding:12px;background:var(--card);border:1px solid var(--border);
  border-radius:10px;transition:.2s;
}
.insurance-card:hover{border-color:var(--accent);}
.insurance-card.active-plan{border-color:rgba(16,185,129,.35);background:rgba(16,185,129,.06);}
.insurance-card.pending-plan{border-color:rgba(245,158,11,.35);background:rgba(245,158,11,.06);}
.ins-icon{font-size:22px;flex-shrink:0;}
.ins-info{flex:1;}
.ins-name{font-size:12px;font-weight:700;color:var(--text);}
.ins-detail{font-size:10px;color:var(--muted);margin-top:1px;}
.ins-status{
  font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;
  white-space:nowrap;
}
.ins-status.active{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.25);}
.ins-status.pending{background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.25);}
.ins-status.expired{background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.2);}

.ins-banner{
  background:var(--card);border:1px solid var(--border);border-radius:var(--radius);
  padding:18px 20px;margin-bottom:16px;
}
.ins-banner-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:14px;
}
.ins-banner-title{font-size:16px;font-weight:800;display:flex;align-items:center;gap:8px;}
.ins-banner-badge{
  font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;
  background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.25);
}
.ins-plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.ins-plan-card{
  padding:14px;background:var(--subtle);border:1px solid var(--border);
  border-radius:12px;text-align:center;transition:.2s;cursor:pointer;
}
.ins-plan-card:hover{border-color:var(--accent);}
.ins-plan-icon{font-size:28px;margin-bottom:6px;}
.ins-plan-name{font-size:12px;font-weight:700;color:var(--text);margin-bottom:2px;}
.ins-plan-cover{font-size:11px;color:var(--accent);font-weight:600;}
.ins-plan-premium{font-size:10px;color:var(--muted);margin-top:4px;}
.ins-plan-status{
  display:inline-block;margin-top:6px;font-size:10px;font-weight:700;
  padding:3px 8px;border-radius:6px;
}
.ins-plan-status.active{background:rgba(16,185,129,.15);color:#34d399;}
.ins-plan-status.available{background:rgba(59,130,246,.12);color:#60a5fa;}
.ins-claim-btn{
  margin-top:14px;width:100%;padding:12px;border:none;border-radius:10px;
  background:linear-gradient(135deg,var(--accent2),#2563eb);
  color:#fff;font-size:13px;font-weight:700;cursor:pointer;
  font-family:var(--font);transition:.2s;
}
.ins-claim-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(59,130,246,.35);}

@media(max-width:1024px){
  .ins-plans-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:600px){
  .ins-plans-grid{grid-template-columns:1fr;}
}

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
    visitingFee: 50,
    discount: 0,
  });
  const [note, setNote] = useState('');
  const [workerPhotos, setWorkerPhotos] = useState([]);
  const [estimateSent, setEstimateSent] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');

  const allMaterials = [...job.materials, ...customMaterials];
  const checkedMats = allMaterials.filter(m => checkedMaterials.includes(m.name));
  const materialsCost = checkedMats.reduce((sum, m) => sum + (m.price || 0), 0);
  const total = Math.max(0, prices.labour + materialsCost + prices.visitingFee - prices.discount);

  // AI Fair Price Benchmark calculation
  const aiBenchmark = Math.round((prices.labour * 0.92) + (materialsCost * 0.95) + prices.visitingFee);
  const variancePct = Math.round(((total - aiBenchmark) / aiBenchmark) * 100);

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

  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setWorkerPhotos(prev => [
          ...prev,
          {
            id: 'wp_' + Date.now() + '_' + i,
            title: file.name,
            caption: 'On-site evidence of damaged part / issue',
            dataUrl: ev.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (id) => {
    setWorkerPhotos(prev => prev.filter(p => p.id !== id));
  };

  const sendEstimate = () => {
    const payload = {
      jobId: job.id,
      jobTitle: job.issue,
      category: job.category || 'General Repair',
      categoryIcon: job.categoryIcon || '🔧',
      worker: {
        name: 'Rohit Kumar',
        avatar: 'RK',
        rating: 4.9,
        reviews: 142,
        jobsCompleted: 184,
        distance: `${job.distance || 0.8} km`,
        eta: 'On-site now',
        phone: '+91 9812345678',
      },
      inspectionTime: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inspectionNote: note || 'On-site inspection completed. Damaged parts identified and quote prepared.',
      materials: checkedMats.map(m => ({
        name: m.name,
        workerPrice: m.price || 0,
        aiMarketPrice: Math.max(10, Math.round((m.price || 0) * 0.92)),
        qty: 1,
      })),
      pricing: {
        laborCharge: prices.labour,
        materialsCost: materialsCost,
        visitingFee: prices.visitingFee,
        visitingFeeAdjusted: -prices.visitingFee,
        promoDiscount: prices.discount,
        totalWorkerQuote: total,
      },
      aiPrediction: {
        predictedBenchmark: aiBenchmark,
        marketRangeMin: Math.round(aiBenchmark * 0.9),
        marketRangeMax: Math.round(aiBenchmark * 1.15),
        confidence: 96,
        aiLaborEstimate: Math.round(prices.labour * 0.92),
        aiMaterialsEstimate: Math.round(materialsCost * 0.95),
        variancePct,
        fairnessStatus: variancePct <= 10 ? 'fair' : 'slight_high',
        fairnessLabel: variancePct <= 10 ? 'Verified Fair Market Rate' : 'Slightly Above Average Benchmark',
        modelInsights: [
          `ML Price Model evaluated 1,420+ similar ${job.issue} tasks in Bengaluru.`,
          `Material quotes match retail hardware pricing within 5% tolerance.`,
          `Labor duration estimated at 35–45 minutes.`,
          `Eligible for 30-Day LabouRack Quality Guarantee.`,
        ],
      },
      photos: workerPhotos.length > 0 ? workerPhotos : [
        {
          id: 'p1',
          title: 'Damaged Part / Joint',
          dataUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
          caption: 'On-site inspection evidence'
        }
      ],
    };

    try {
      localStorage.setItem('labourack_current_estimate', JSON.stringify(payload));
    } catch (_) {}

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
                {t === 'materials' ? '🔩 Materials Needed' : '💰 Price Estimate & Photos'}
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
                  {job.customer} has received your price breakdown of <strong style={{ color: 'var(--accent)' }}>₹{total}</strong> along with the <strong>LabouRack AI Fair Market Benchmark (₹{aiBenchmark})</strong>.
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
                  💰 On-Site Price Estimate &amp; AI Analysis
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>
                    — submit to customer
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

                {/* AI Price Benchmark Real-Time Preview for Worker */}
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(59,130,246,.08)',
                  border: '1px solid rgba(59,130,246,.25)',
                  borderRadius: 10,
                  marginBottom: 14,
                  fontSize: 12,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ color: '#60a5fa', fontWeight: 700 }}>🤖 AI Fair Market Prediction:</span>
                    <strong style={{ color: '#93c5fd', fontSize: 14 }}>₹{aiBenchmark}</strong>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                    Standard City Benchmark range: ₹{Math.round(aiBenchmark * 0.9)} – ₹{Math.round(aiBenchmark * 1.15)} (96% Confidence)
                  </div>
                </div>

                {/* On-Site Inspection Photos Upload */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                    📷 On-Site Inspection Photos (Evidence for Customer):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id={`worker-photo-inp-${job.id}`}
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {workerPhotos.map(p => (
                      <div key={p.id} style={{ position: 'relative', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img src={p.dataUrl} alt="Inspection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,.8)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => document.getElementById(`worker-photo-inp-${job.id}`).click()}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1.5px dashed rgba(255,255,255,.2)',
                        background: 'var(--card)',
                        color: 'var(--muted)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>📷</span>
                      <span>{workerPhotos.length > 0 ? '+ Add Photo' : 'Attach Inspection Photos'}</span>
                    </button>
                  </div>
                </div>

                <div className="price-total-row" style={{ marginBottom: 14 }}>
                  <span className="price-total-label">Total Estimated Cost</span>
                  <span className="price-total-val">₹{total}</span>
                </div>

                <textarea
                  className="inspection-note"
                  placeholder="📝 Add inspection notes (e.g. 'Worn spindle threading causing continuous drip. Replaced spindle and washer.')"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />

                <button className="submit-estimate-btn" onClick={sendEstimate}>
                  📨 Send Estimate to Customer (₹{total}) →
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

            <p className="sb-section">Insurance & Protection</p>
            <div className="sb-insurance">
              <div className="insurance-card active-plan">
                <span className="ins-icon">🛡️</span>
                <div className="ins-info">
                  <p className="ins-name">Accident Insurance</p>
                  <p className="ins-detail">Up to ₹2,00,000 cover</p>
                </div>
                <span className="ins-status active">Active</span>
              </div>
              <div className="insurance-card active-plan">
                <span className="ins-icon">❤️</span>
                <div className="ins-info">
                  <p className="ins-name">Health Cover</p>
                  <p className="ins-detail">₹50,000 annual</p>
                </div>
                <span className="ins-status active">Active</span>
              </div>
              <div className="insurance-card pending-plan">
                <span className="ins-icon">🔧</span>
                <div className="ins-info">
                  <p className="ins-name">Tool Protection</p>
                  <p className="ins-detail">Equipment damage cover</p>
                </div>
                <span className="ins-status pending">Enroll</span>
              </div>
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
