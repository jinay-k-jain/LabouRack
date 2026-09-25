import React, { useState } from 'react';
import { submitEstimateDecision } from '../api.js';

export default function CustomerEstimatePage({ state, actions, estimateOverride, onBack }) {
  // Default rich estimate model if not provided from state
  const defaultEstimate = {
    jobId: 'b-101',
    jobTitle: 'Water Tap & Valve Joint Leakage Repair',
    category: 'Water & Plumbing',
    categoryIcon: '💧',
    worker: {
      name: 'Assigned professional',
      avatar: 'RK',
      rating: 4.9,
      reviews: 142,
      jobsCompleted: 184,
      distance: '0.8 km',
      eta: 'On-site now',
      phone: '+91 9812345678',
    },
    inspectionTime: 'Today at 2:15 PM (On-site inspection completed)',
    inspectionNote:
      'Inspected the main bathroom washbasin. The brass spindle threading has worn out causing continuous drip, and the inlet braided pipe joint requires fresh washer sealing with high-density Teflon.',
    materials: [
      { name: '1/2" Heavy Brass Tap Spindle', workerPrice: 120, aiMarketPrice: 110, qty: 1 },
      { name: 'PTFE High-Density Teflon Tape (2x)', workerPrice: 30, aiMarketPrice: 25, qty: 2 },
      { name: 'Rubber Gasket & Washer Seal Kit', workerPrice: 20, aiMarketPrice: 15, qty: 1 },
    ],
    pricing: {
      laborCharge: 3000,
      materialsCost: 1700,
      visitingFee: 50,
      visitingFeeAdjusted: -50, // adjusted against final bill
      promoDiscount: 0,
      totalWorkerQuote: 4700,
    },
    aiPrediction: {
      predictedBenchmark: 4200,
      marketRangeMin: 4000,
      marketRangeMax: 4800,
      confidence: 96,
      aiLaborEstimate: 280,
      aiMaterialsEstimate: 150,
      aiVisitingFee: 0,
      variancePct: 6.8, // +6.8%
      fairnessStatus: 'fair', // 'fair' | 'slight_high' | 'high'
      fairnessLabel: 'Verified Fair Market Rate (Within ±8% standard city variance)',
      modelInsights: [
        'ML Price Model evaluated 1,420+ similar plumbing leak repairs across Indiranagar & East Bengaluru.',
        'Material quotes match retail hardware pricing within 5% tolerance.',
        'Labor duration estimated at 35–45 minutes by certified plumber.',
        'Eligible for 30-Day LabouRack Quality & Leak-Free Guarantee.',
      ],
    },
    photos: [
      {
        id: 'p1',
        title: 'Damaged Spindle & Continuous Drip',
        dataUrl:
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        caption: 'Worn spindle threading causing 2.5L/hour water waste',
      },
      {
        id: 'p2',
        title: 'Inlet Braided Pipe Joint',
        dataUrl:
          'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80',
        caption: 'Needs fresh washer and Teflon seal at coupling',
      },
    ],
  };

  const estimate = estimateOverride || state?.currentEstimate || defaultEstimate;

  const [decision, setDecision] = useState(null); // 'accepted' | 'rejected' | 'counter'
  const [counterAmount, setCounterAmount] = useState(estimate.aiPrediction.predictedBenchmark);
  const [counterNote, setCounterNote] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const materials = estimate.materials || [];
  const workerTotal = estimate.pricing?.totalWorkerQuote || 4700;
  const aiBenchmark = estimate.aiPrediction?.predictedBenchmark || 4200;
  const variance = Math.round(((workerTotal - aiBenchmark) / aiBenchmark) * 100);

  async function sendDecision(decisionType, counterOffer = null) {
    setIsSubmitting(true);
    try {
      if (estimate.bookingId) {
        await submitEstimateDecision(estimate.bookingId, {
          decision: decisionType,
          counter_offer: counterOffer,
          feedback: counterNote || null,
        });
      }
      setDecision(decisionType === 'counter_offer' ? 'counter_sent' : decisionType);
      setIsSubmitting(false);
      return true;
    } catch (error) { setIsSubmitting(false); actions?.showToast(error.message || 'Unable to update the estimate.'); return false; }
  }

  async function handleAccept() {
    if (await sendDecision('accepted')) actions?.showToast('Estimate accepted. Worker notified.');
  }

  async function handleReject() {
    if (await sendDecision('rejected')) actions?.showToast('Estimate declined. Worker notified.');
  }

  async function handleSendCounter() {
    if (!counterAmount || counterAmount <= 0) return;
    if (await sendDecision('counter_offer', Number(counterAmount))) actions?.showToast(`Counter-offer of ₹${counterAmount} sent to the worker.`);
  }

  return (
    <div className="estimate-review-page-wrap">
      {/* Photo Zoom Modal */}
      {selectedPhoto && (
        <div className="modal-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-zoom-card" onClick={e => e.stopPropagation()}>
            <div className="photo-zoom-header">
              <strong>{selectedPhoto.title}</strong>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedPhoto(null)}
              >
                ✕
              </button>
            </div>
            <img src={selectedPhoto.dataUrl} alt={selectedPhoto.title} className="photo-zoom-img" />
            <p className="photo-zoom-caption">{selectedPhoto.caption}</p>
          </div>
        </div>
      )}

      {/* TOP NAV BAR */}
      <header className="estimate-top-nav">
        <button
          type="button"
          className="back-button"
          onClick={onBack || (() => actions?.setPage && actions.setPage('dashboard'))}
        >
          ← <span>Back to Dashboard</span>
        </button>
        <div className="nav-brand-badge">
          <span className="live-pulse-dot" />
          <span>ON-SITE INSPECTION REPORT</span>
        </div>
        <div className="nav-job-tag">
          {estimate.categoryIcon} {estimate.jobTitle}
        </div>
      </header>

      <main className="estimate-main-container">
        {/* HERO TITLE & WORKER STATUS */}
        <section className="estimate-hero-section">
          <div className="estimate-hero-content">
            <div className="ai-badge-row">
              <span className="ai-chip">🤖 AI FAIR PRICE GUARANTEE</span>
            </div>
            <h1>On-Site Repair Estimate &amp; AI Price Comparison</h1>
            <p className="estimate-hero-desc">
              Worker <strong>{estimate.worker.name}</strong> has completed the inspection at your
              address. Review the material breakdown alongside the <strong>LabouRack AI Market Benchmark</strong>{' '}
              to approve or negotiate before work begins.
            </p>
          </div>

          <div className="worker-inspection-badge-card">
            <div className="wib-avatar">{estimate.worker.avatar || 'RK'}</div>
            <div className="wib-details">
              <strong>{estimate.worker.name}</strong>
              <small>🛡️ Aadhaar Verified Pro • ★ {estimate.worker.rating} (142 reviews)</small>
              <div className="wib-time">📍 {estimate.inspectionTime}</div>
            </div>
          </div>
        </section>

        {/* DECISION BANNER (IF ACTION TAKEN) */}
        {decision === 'accepted' && (
          <div className="decision-banner accepted">
            <div className="db-icon">🎉</div>
            <div className="db-content">
              <h3>Estimate Approved by You!</h3>
              <p>
                Your assigned professional has been authorized to start the repair. A completion verification OTP{' '}
                <strong>[ 5824 ]</strong> will be required once the job is completed to your satisfaction.
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={onBack || (() => actions?.setPage && actions.setPage('dashboard'))}
            >
              Return to Live Tracking →
            </button>
          </div>
        )}

        {decision === 'rejected' && (
          <div className="decision-banner rejected">
            <div className="db-icon">✕</div>
            <div className="db-content">
              <h3>Estimate Declined</h3>
              <p>
                You have declined this quote. No charges apply. You can re-assign another pro or request
                a fresh inspection from the dashboard.
              </p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={onBack || (() => actions?.setPage && actions.setPage('dashboard'))}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {decision === 'counter_sent' && (
          <div className="decision-banner counter">
            <div className="db-icon">💬</div>
            <div className="db-content">
              <h3>Counter-Offer of ₹{counterAmount} Sent to Worker!</h3>
              <p>
                Your assigned professional will review your proposal aligned with the AI Fair Market Benchmark (₹
                {aiBenchmark}). You will be notified once he responds.
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={onBack || (() => actions?.setPage && actions.setPage('dashboard'))}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* SIDE BY SIDE COMPARISON: WORKER QUOTE vs AI PREDICTION */}
        <section className="estimate-cards-grid">
          {/* CARD 1: WORKER ESTIMATE */}
          <div className="estimate-card worker-card-quote">
            <div className="card-top-row">
              <span className="card-source-tag worker-tag">👨‍🔧 Worker's On-Site Quote</span>
              <span className="status-live-chip">Submitted Just Now</span>
            </div>

            <div className="price-huge-display">
              <span className="rupee-symbol">₹</span>
              <span className="price-number">{workerTotal}</span>
              <span className="price-subtext">Total Estimated Bill</span>
            </div>

            <div className="quote-breakdown-list">
              <div className="q-row">
                <span>🔧 Labor &amp; Diagnostic Charge</span>
                <strong>₹{estimate.pricing.laborCharge}</strong>
              </div>
              <div className="q-row">
                <span>🔩 Required Materials ({materials.length} items)</span>
                <strong>₹{estimate.pricing.materialsCost}</strong>
              </div>
              <div className="q-row">
                <span>🚗 Visiting Fee (₹50)</span>
                <span className="green-text">Adjusted in Total (-₹50)</span>
              </div>
            </div>

            <div className="worker-note-box">
              <p className="note-title">📝 Worker Inspection Notes:</p>
              <p className="note-body">"{estimate.inspectionNote}"</p>
            </div>
          </div>

          {/* CARD 2: AI PREDICTION ML BENCHMARK */}
          <div className="estimate-card ai-card-benchmark">
            <div className="card-top-row">
              <span className="card-source-tag ai-tag">🤖 LabouRack AI Price Predictor</span>
              <span className="confidence-chip">
                ⚡ {estimate.aiPrediction.confidence}% Confidence
              </span>
            </div>

            <div className="price-huge-display ai-display">
              <span className="rupee-symbol">₹</span>
              <span className="price-number">{aiBenchmark}</span>
              <span className="price-subtext">AI Market Benchmark</span>
            </div>

            <div className="ai-range-meter-box">
              <div className="range-labels">
                <span>Min: ₹{estimate.aiPrediction.marketRangeMin}</span>
                <span className="benchmark-label">Benchmark: ₹{aiBenchmark}</span>
                <span>Max: ₹{estimate.aiPrediction.marketRangeMax}</span>
              </div>
              <div className="range-bar-track">
                <div
                  className="range-bar-fair-zone"
                  style={{ left: '20%', width: '60%' }}
                  title="Standard City Fair Price Zone"
                />
                <div
                  className="range-marker worker-marker"
                  style={{ left: `${Math.min(95, Math.max(5, (workerTotal / (aiBenchmark * 1.3)) * 100))}%` }}
                  title={`Worker Quote: ₹${workerTotal}`}
                >
                  <span className="marker-pin">📍 Worker ₹{workerTotal}</span>
                </div>
              </div>
            </div>

            <div className="fairness-status-pill fair">
              <span>{variance >= 0 ? `+${variance}%` : `${variance}%`}</span>
              <span>{estimate.aiPrediction.fairnessLabel}</span>
            </div>

            <div className="ai-insights-list">
              <p className="insights-title">💡 Machine Learning Insights:</p>
              <ul>
                {estimate.aiPrediction.modelInsights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ON-SITE INSPECTION PHOTOS */}
        {estimate.photos && estimate.photos.length > 0 && (
          <section className="estimate-section-box">
            <div className="section-title-row">
              <div>
                <h2>📷 On-Site Inspection Photos &amp; Proof</h2>
                <p>Uploaded by {estimate.worker.name} during inspection to show damaged parts.</p>
              </div>
              <span className="photos-count-tag">{estimate.photos.length} Photos Captured</span>
            </div>

            <div className="inspection-photos-grid">
              {estimate.photos.map(photo => (
                <div
                  key={photo.id}
                  className="inspection-photo-card"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="photo-img-wrap">
                    <img src={photo.dataUrl} alt={photo.title} />
                    <span className="zoom-hint-btn">🔍 Click to zoom</span>
                  </div>
                  <div className="photo-card-caption">
                    <strong>{photo.title}</strong>
                    <small>{photo.caption}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ITEMIZED MATERIAL & COST COMPARISON TABLE */}
        <section className="estimate-section-box">
          <div className="section-title-row">
            <div>
              <h2>🔩 Itemized Materials &amp; Hardware Breakdown</h2>
              <p>Transparent comparison between Worker quoted price and local retail hardware benchmark.</p>
            </div>
          </div>

          <div className="table-responsive-wrapper">
            <table className="materials-comparison-table">
              <thead>
                <tr>
                  <th>Material / Part Description</th>
                  <th>Qty</th>
                  <th>Worker Quoted Price</th>
                  <th>AI Retail Benchmark</th>
                  <th>Variance</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m, idx) => {
                  const diff = m.workerPrice - m.aiMarketPrice;
                  const diffPct = Math.round((diff / m.aiMarketPrice) * 100);
                  return (
                    <tr key={idx}>
                      <td>
                        <strong>{m.name}</strong>
                      </td>
                      <td>{m.qty || 1}x</td>
                      <td>
                        <strong className="worker-price-val">₹{m.workerPrice}</strong>
                      </td>
                      <td>
                        <span className="ai-benchmark-val">₹{m.aiMarketPrice}</span>
                      </td>
                      <td>
                        <span
                          className={`variance-badge ${diff <= 5 ? 'fair-var' : 'high-var'}`}
                        >
                          {diff >= 0 ? `+₹${diff} (${diffPct}%)` : `-₹${Math.abs(diff)}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="table-total-row">
                  <td colSpan="2">
                    <strong>Total Materials Cost</strong>
                  </td>
                  <td>
                    <strong className="worker-price-val">
                      ₹{estimate.pricing.materialsCost}
                    </strong>
                  </td>
                  <td>
                    <span className="ai-benchmark-val">
                      ₹{estimate.aiPrediction.aiMaterialsEstimate}
                    </span>
                  </td>
                  <td>
                    <span className="variance-badge fair-var">+₹20 (+13%)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* COUNTER OFFER FORM (IF CUSTOMER CLICKS NEGOTIATE) */}
        {decision === 'counter' && (
          <section className="counter-offer-section">
            <div className="counter-box">
              <h3>💬 Propose a Counter-Offer / Renegotiate</h3>
              <p>
                Suggest a fair revised total based on the AI Benchmark (₹{aiBenchmark}). The worker
                can accept or respond with a refined quote.
              </p>

              <div className="counter-inputs-row">
                <div className="counter-field">
                  <label htmlFor="counterPriceInput">Your Proposed Total Pay (₹):</label>
                  <div className="price-input-wrapper">
                    <span className="prefix">₹</span>
                    <input
                      id="counterPriceInput"
                      type="number"
                      value={counterAmount}
                      onChange={e => setCounterAmount(Number(e.target.value))}
                      className="counter-input"
                    />
                  </div>
                </div>

                <div className="counter-field flex-2">
                  <label htmlFor="counterNoteInput">Message to Worker (Optional):</label>
                  <input
                    id="counterNoteInput"
                    type="text"
                    value={counterNote}
                    onChange={e => setCounterNote(e.target.value)}
                    placeholder="e.g. Can we do ₹4,200 as suggested by AI market benchmark?"
                    className="counter-input"
                  />
                </div>
              </div>

              <div className="counter-action-btns">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setDecision(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-button counter-submit-btn"
                  onClick={handleSendCounter}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending Proposal...' : 'Send Counter-Offer to Worker →'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* CUSTOMER ACTION BAR (IF NO FINAL DECISION YET) */}
        {!decision && (
          <footer className="estimate-action-footer">
            <div className="footer-price-summary">
              <small>Total to Authorize:</small>
              <strong>₹{workerTotal}</strong>
              <span className="sub-benchmark">
                (AI Benchmark: ₹{aiBenchmark})
              </span>
            </div>

            <div className="footer-buttons-group">
              <button
                type="button"
                className="action-btn decline-btn"
                onClick={handleReject}
                disabled={isSubmitting}
              >
                ✕ Decline Estimate
              </button>

              <button
                type="button"
                className="action-btn negotiate-btn"
                onClick={() => setDecision('counter')}
                disabled={isSubmitting}
              >
                💬 Counter-Offer / Renegotiate
              </button>

              <button
                type="button"
                className="action-btn accept-btn"
                onClick={handleAccept}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Authorizing...' : `✅ Accept Estimate (₹${workerTotal}) & Start Work →`}
              </button>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}
