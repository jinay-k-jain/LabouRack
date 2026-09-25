import React, { useState } from 'react';
import Brand from '../components/Brand.jsx';
import ProfileMenu from '../components/ProfileMenu.jsx';
import WorkerCard from '../components/WorkerCard.jsx';
import HomeRepairFlowPage from './HomeRepairFlowPage.jsx';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard.jsx';
import { householdCategories, workerProfiles, popularHouseholdProblems } from '../appLogic.js';

export default function DashboardPage({ state, actions }) {
  const { role, searchQuery, dashboard } = state;
  const customer = role === 'customer';
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Show the home repair sub-flow for customers when active
  if (customer && state.homeRepair.view !== 'home') {
    return <HomeRepairFlowPage state={state} actions={actions} />;
  }

  return (
    <main className="app-shell dashboard-shell">
      <section className="dashboard-panel">
        {/* TOP HEADER */}
        <header className={'dashboard-header ' + (customer ? '' : 'dashboard-header--simple')}>
          <Brand compact />

          {customer && (
            <button
              className="location-picker"
              type="button"
              onClick={actions.openLocationModal}
            >
              <span>📍</span>
              <span>{state.selectedLocation}</span>
              <b>⌄</b>
            </button>
          )}

          {customer && (
            <form className="issue-search" role="search" onSubmit={actions.searchDashboard}>
              <span aria-hidden="true">⌕</span>
              <input
                value={searchQuery}
                onChange={event => actions.setSearchQuery(event.target.value)}
                type="search"
                placeholder="Search service, plumber, electrician..."
                aria-label="Search for an issue or service"
              />
              <button type="submit">Search</button>
            </form>
          )}

          {/* ROLE QUICK SWITCHER PILL */}
          <div className="header-role-switcher" aria-label="Role preview">
            {['customer', 'worker', 'admin'].map(r => (
              <button
                key={r}
                className={'role-pill ' + (role === r ? 'active' : '')}
                type="button"
                onClick={() => actions.setRole(r)}
              >
                {r === 'customer' ? 'Customer' : r === 'worker' ? 'Gig Worker' : 'Admin'}
              </button>
            ))}
          </div>

          <div className="dashboard-actions">
            {customer && (
              <button
                className="help-circle"
                type="button"
                title="Active Bookings"
                onClick={() =>
                  actions.showToast(
                    'You have ' + state.activeBookings.length + ' active bookings',
                  )
                }
              >
                ⚡ <span className="badge-count">{state.activeBookings.length}</span>
              </button>
            )}
            <ProfileMenu state={state} actions={actions} />
          </div>
        </header>

        {/* ACTIVE BOOKING WIDGET */}
        {customer && state.activeBookings.length > 0 && (
          <div className="active-booking-banner">
            <div className="booking-status-pulse">
              <span className="pulse-dot" />
              <span>LIVE TASK ACTIVE</span>
            </div>

            {/* ── AI Estimate Inspection Alert Card ── */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,.12), rgba(59,130,246,.1))',
              border: '1.5px solid rgba(16,185,129,.4)',
              borderRadius: 14,
              padding: '16px 18px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>🤖</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      background: '#10b981',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: 6,
                      textTransform: 'uppercase',
                      letterSpacing: '.05em',
                    }}>
                      Estimate Ready
                    </span>
                    <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                      Worker Rohit Kumar Submitted On-Site Quote (₹470)
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
                    ✨ AI Market Benchmark: <strong style={{ color: '#10b981' }}>₹440</strong> • Includes parts + labor. Review photos &amp; accept/reject.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => actions.openEstimateReview && actions.openEstimateReview()}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16,185,129,.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>Review Estimate &amp; AI Price</span>
                <span>→</span>
              </button>
            </div>

            {state.activeBookings.map(b => (
              <div key={b.id} className="active-booking-card">
                <span className="booking-icon">{b.categoryIcon || '💧'}</span>
                <div className="booking-info">
                  <strong>{b.issue}</strong>
                  <small>
                    Assigned Pro: <b>{b.workerName}</b> • {b.status} ({b.eta})
                  </small>
                  {b.photos && b.photos.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>📷 Attached Photos:</span>
                      {b.photos.map(p => (
                        <img
                          key={p.id}
                          src={p.dataUrl}
                          alt={p.name}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 4,
                            objectFit: 'cover',
                            border: '1px solid var(--line)',
                          }}
                          title={p.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="booking-actions">
                  <button
                    className="track-button"
                    type="button"
                    onClick={() =>
                      actions.showToast('📞 Contacting ' + b.workerName + ' (OTP Code 4821)')
                    }
                  >
                    📞 Call Worker
                  </button>
                  <button
                    className="cancel-text-btn"
                    type="button"
                    onClick={() => actions.cancelBooking(b.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HERO SECTION FOR CUSTOMER */}
        {customer && (
          <section className="hero-banner">
            <div className="hero-content">
              <div className="hero-badge">
                <span>🛡️ SIH 2026 PROTOTYPE</span>
                <p>Aadhaar-Verified Local Gig Network</p>
              </div>
              <h1>Instant Household Help, Verified &amp; On-Demand.</h1>
              <p>
                Connect with top-rated plumbers, electricians, and technicians in{' '}
                <strong>{state.selectedLocation}</strong> within 15 minutes.
              </p>
              <div className="hero-stats-row">
                {[
                  { val: '500+', label: 'Verified Local Pros' },
                  { val: '4.9 ★', label: 'Avg Rating (12k+ Jobs)' },
                  { val: '< 15 mins', label: 'Avg Response Time' },
                  { val: '₹0', label: 'Hidden Service Fees' },
                ].map(stat => (
                  <div key={stat.label} className="stat-pill">
                    <strong>{stat.val}</strong>
                    <small>{stat.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* WORKER / ADMIN INTRO */}
        {!customer && (
          <section className="dashboard-intro" aria-labelledby="dashboardTitle">
            <p className="eyebrow">{role.toUpperCase()} PORTAL</p>
            <h1 id="dashboardTitle">{dashboard.heading}</h1>
            <p>{dashboard.copy}</p>
          </section>
        )}

        {/* CUSTOMER QUICK HELP SECTION */}
        {customer && (
          <section className="dashboard-popular" aria-labelledby="popularProblems">
            <div className="section-heading">
              <div>
                <p className="eyebrow">POPULAR QUICK REPAIRS</p>
                <h2 id="popularProblems">What needs urgent fixing?</h2>
              </div>
              <button className="text-button" type="button" onClick={actions.openHomeRepair}>
                Explore All Services →
              </button>
            </div>
            <div className="popular-problem-grid">
              {popularHouseholdProblems.map(problem => (
                <button
                  key={problem.label}
                  type="button"
                  className="popular-problem"
                  onClick={() => actions.openPopularProblem(problem.categoryId, problem.issue)}
                >
                  <span>{problem.icon}</span>
                  <div>
                    <strong>{problem.label}</strong>
                    <small>{problem.description}</small>
                    <div className="problem-meta">
                      <span className="price-tag">Starts @ ₹{problem.price}</span>
                      <span className="eta-tag">⚡ {problem.estTime}</span>
                    </div>
                  </div>
                  <b>→</b>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ALL HOUSEHOLD SERVICES GRID */}
        {customer && (
          <section className="dashboard-content" id="services">
            <div className="section-heading">
              <div>
                <p className="eyebrow">SERVICE CATEGORIES</p>
                <h2>Browse All Household Specialties</h2>
              </div>
              <button className="text-button" type="button" onClick={actions.openHomeRepair}>
                View All Categories →
              </button>
            </div>
            <div className="household-grid">
              {householdCategories.slice(0, 6).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className="household-category"
                  onClick={() => actions.chooseHouseholdCategory(cat)}
                >
                  <span>{cat.icon}</span>
                  <div>
                    <span className="category-badge">{cat.badge}</span>
                    <strong>{cat.name}</strong>
                    <small>{cat.description}</small>
                  </div>
                  <b>→</b>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* TOP VERIFIED LOCAL WORKERS */}
        {customer && (
          <section className="dashboard-content nearby-workers-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">LIVE WORKER RADAR</p>
                <h2>Top Verified Workers Near {state.selectedLocation}</h2>
              </div>
              <span className="radar-status">🟢 14 Workers Online Now</span>
            </div>
            <div className="worker-list">
              {workerProfiles.slice(0, 3).map(worker => (
                <WorkerCard
                  key={worker.name}
                  worker={worker}
                  actions={actions}
                  state={state}
                />
              ))}
            </div>
          </section>
        )}

        {/* GIG WORKER VIEW */}
        {role === 'worker' && (
          <section className="worker-portal-view">
            <div className="worker-stats-cards">
              {[
                { icon: '💰', label: "Today's Earnings", val: '₹1,450' },
                { icon: '✅', label: 'Completed Jobs', val: '4 Tasks' },
                { icon: '⭐', label: 'Average Rating', val: '4.9 / 5.0' },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <span className="stat-icon">{stat.icon}</span>
                  <div>
                    <small>{stat.label}</small>
                    <strong>{stat.val}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-heading">
              <h2>Open Gig Requests Near You</h2>
              <span className="radar-status">🟢 Radar Active (3 km radius)</span>
            </div>

            <div className="gig-requests-list">
              {[
                {
                  icon: '💧',
                  title: 'Leaking Bathroom Pipe Repair',
                  location: 'Indiranagar 12th Main (1.2 km away)',
                  posted: '5 mins ago',
                  tags: ['Plumbing', 'Urgent'],
                  pay: 350,
                },
                {
                  icon: '⚡',
                  title: 'Switch Board Replacement & Fuse Check',
                  location: 'Koramangala 4th Block (2.5 km away)',
                  posted: '12 mins ago',
                  tags: ['Electrical', 'Standard'],
                  pay: 400,
                },
              ].map(gig => (
                <article key={gig.title} className="gig-request-card">
                  <div className="gig-icon">{gig.icon}</div>
                  <div className="gig-details">
                    <h4>{gig.title}</h4>
                    <p>
                      📍 {gig.location} • Posted {gig.posted}
                    </p>
                    <div className="gig-tags">
                      {gig.tags.map(t => (
                        <span key={t}>{t}</span>
                      ))}
                      <span>Est Pay: ₹{gig.pay}</span>
                    </div>
                  </div>
                  <button
                    className="book-button"
                    type="button"
                    onClick={() =>
                      actions.showToast('✓ Gig request accepted! Customer notified.')
                    }
                  >
                    Accept Job (₹{gig.pay})
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ADMIN VIEW */}
        {role === 'admin' && showAnalytics && (
          <AdminAnalyticsDashboard onBack={() => setShowAnalytics(false)} />
        )}

        {role === 'admin' && !showAnalytics && (
          <section className="admin-portal-view">
            <div className="admin-stats-cards">
              {[
                { icon: '👥', label: 'Active Workers', val: '1,420 Verified' },
                { icon: '🛡️', label: 'Safety Score', val: '99.4% Compliant' },
                { icon: '⌛', label: 'Pending Verifications', val: '3 Profiles' },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <span className="stat-icon">{stat.icon}</span>
                  <div>
                    <small>{stat.label}</small>
                    <strong>{stat.val}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* AI ANALYTICS LAUNCH BUTTON */}
            <button
              className="analytics-launch-btn"
              type="button"
              onClick={() => setShowAnalytics(true)}
            >
              <span className="analytics-launch-icon">📈</span>
              <div className="analytics-launch-text">
                <strong>AI Demand Forecasting & Workforce Allocation</strong>
                <small>View regional analytics, supply gaps, and ML-powered insights</small>
              </div>
              <span className="analytics-launch-arrow">→</span>
            </button>

            <div className="section-heading">
              <h2>Pending Aadhaar &amp; Skill Verification Queue</h2>
            </div>

            <div className="admin-queue-list">
              <article className="queue-card">
                <div className="queue-avatar">VK</div>
                <div className="queue-info">
                  <h4>
                    Vikram Kulkarni <small>(Aadhaar: 7890 **** 1245)</small>
                  </h4>
                  <p>Specialties: Plumbing, Water Pump Repair • 7 Yrs Exp</p>
                  <span className="queue-badge">Aadhaar OTP Verified ✓</span>
                </div>
                <div className="queue-actions">
                  <button
                    className="approve-btn"
                    type="button"
                    onClick={() =>
                      actions.showToast('✓ Worker Vikram Kulkarni approved.')
                    }
                  >
                    Approve Worker
                  </button>
                  <button
                    className="reject-btn"
                    type="button"
                    onClick={() => actions.showToast('Worker profile rejected.')}
                  >
                    Reject
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
