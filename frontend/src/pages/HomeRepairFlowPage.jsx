import React, { useState } from 'react';
import WorkerCard from '../components/WorkerCard.jsx';
import { householdCategories, workerProfiles, popularHouseholdProblems, initials } from '../appLogic.js';

export default function HomeRepairFlowPage({ state, actions }) {
  const {
    view,
    category,
    issue,
    filter,
    workers,
    services,
    query,
    serviceFilter = 'all',
    serviceSort = 'relevance',
    hasMatches,
  } = state.homeRepair;

  const [localQuery, setLocalQuery] = useState(query || '');

  React.useEffect(() => {
    setLocalQuery(query || '');
  }, [query]);

  const heading =
    view === 'categories'
      ? 'What service do you need today?'
      : view === 'services'
        ? category
          ? `${category.name} Services Offered`
          : 'Services Matching Your Search'
        : view === 'issues'
          ? category
            ? `${category.name} Problems`
            : 'Select Problem'
          : category
            ? category.workerLabel
            : 'Verified Local Workers';

  const copy =
    view === 'categories'
      ? 'Choose a category to find certified local gig workers near you.'
      : view === 'services'
        ? `Select a specific service package for "${query || (category ? category.name : 'your search')}" to compare verified nearby workers.`
        : view === 'issues'
          ? 'Pick the issue that best matches your situation.'
          : category
            ? category.workerCopy
            : 'Available verified workers near your location.';

  const workerFilters = [
    ['all', 'All Workers'],
    ['nearby', 'Within 3 km'],
    ['rated', 'Top Rated (4.8+ ★)'],
    ['available', 'Available Now 🟢'],
  ];

  const serviceFilterChips = [
    { key: 'all', label: 'All Packages', icon: '📦' },
    { key: 'express', label: '⚡ Express Match', icon: '⚡' },
    { key: 'top-rated', label: '★ Top Rated Pro', icon: '★' },
    { key: 'budget', label: '💰 Under ₹350', icon: '💰' },
  ];

  const popularQueries = [
    { label: '🧊 Fridge Repair', query: 'fridge repair' },
    { label: '💧 Leaking Tap', query: 'leaking tap' },
    { label: '⚡ AC Servicing', query: 'ac service' },
    { label: '🪚 Carpenter', query: 'carpenter' },
    { label: '🔌 Appliance Diagnostic', query: 'appliance' },
    { label: '✨ Deep Cleaning', query: 'kitchen deep cleaning' },
  ];

  // Filter services
  let displayServices = [...(services || [])];
  if (serviceFilter === 'express') {
    displayServices = displayServices.filter(
      s =>
        (s.estTime && s.estTime.includes('15')) ||
        (s.badge && (s.badge.includes('Popular') || s.badge.includes('Quick'))),
    );
  } else if (serviceFilter === 'top-rated') {
    displayServices = displayServices.filter(
      s =>
        s.badge &&
        (s.badge.includes('Verified') ||
          s.badge.includes('Popular') ||
          s.badge.includes('Specialist') ||
          s.badge.includes('Hygiene')),
    );
  } else if (serviceFilter === 'budget') {
    displayServices = displayServices.filter(s => s.price <= 350);
  }

  // Sort services
  if (serviceSort === 'price-asc') {
    displayServices.sort((a, b) => a.price - b.price);
  } else if (serviceSort === 'price-desc') {
    displayServices.sort((a, b) => b.price - a.price);
  } else if (serviceSort === 'eta') {
    displayServices.sort(
      (a, b) => parseInt(a.estTime || '20') - parseInt(b.estTime || '20'),
    );
  }

  const handleRefineSubmit = e => {
    e.preventDefault();
    if (localQuery.trim()) {
      actions.searchByQuery(localQuery.trim());
    }
  };

  return (
    <main className="app-shell service-shell">
      <section className="service-panel">
        {/* Header */}
        <header className="service-header">
          <button
            type="button"
            className="service-back-btn"
            onClick={view === 'categories' ? actions.closeHomeRepair : actions.goBackInHomeRepair}
            title="Go Back to Dashboard"
          >
            <span className="back-arrow">←</span>
            <span>Back</span>
          </button>
          <div
            className="header-location-pill"
            onClick={actions.openLocationModal}
            title="Change active locality"
          >
            <span className="location-pin-icon">📍</span>
            <span className="location-label">Active Locality:</span>
            <strong className="location-name">{state.selectedLocation}</strong>
            <span className="location-dropdown-arrow">▾</span>
          </div>
        </header>

        {/* Search Refine Bar (services view only) */}
        {view === 'services' && (
          <div className="search-refine-bar">
            <form onSubmit={handleRefineSubmit} className="search-refine-form">
              <span className="search-refine-icon">🔍</span>
              <input
                type="search"
                className="search-refine-input"
                placeholder="Refine search: e.g. fridge repair, plumber, AC service..."
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
              />
              {localQuery && (
                <button
                  type="button"
                  className="search-refine-clear"
                  onClick={() => {
                    setLocalQuery('');
                    actions.clearSearch();
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <button type="submit" className="search-refine-btn">
                Search
              </button>
            </form>
            <div className="search-tags-scroll">
              <span className="search-tags-label">Quick filter:</span>
              {popularQueries.map(item => (
                <button
                  key={item.query}
                  type="button"
                  className={`search-query-chip ${query && query.toLowerCase() === item.query ? 'active' : ''}`}
                  onClick={() => {
                    setLocalQuery(item.query);
                    actions.searchByQuery(item.query);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section Intro */}
        <section className="service-intro">
          <p className="eyebrow">HYPERLOCAL SERVICE DISCOVERY</p>
          <h1>{heading}</h1>
          <p>{copy}</p>
        </section>

        {/* Categories Grid */}
        {view === 'categories' && (
          <div className="household-grid">
            {householdCategories.map(item => (
              <button
                key={item.id}
                type="button"
                className="household-category"
                onClick={() => actions.chooseHouseholdCategory(item)}
              >
                <span>{item.icon}</span>
                <div>
                  <span className="category-badge">{item.badge || 'Available'}</span>
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </div>
                <b>→</b>
              </button>
            ))}
          </div>
        )}

        {/* Services Discovery View */}
        {view === 'services' && (
          <div className="services-discovery-container">
            {/* Search Hero Banner */}
            <div className="search-hero-banner">
              <div className="search-hero-icon-wrap">
                <span className="search-hero-icon">{category ? category.icon : '🔍'}</span>
                <span className="search-hero-pulse"></span>
              </div>
              <div className="search-hero-details">
                <div className="search-hero-top-pills">
                  <span className="hero-pill category-pill">
                    {category ? category.name : 'Home Services'}
                  </span>
                  {hasMatches === false ? (
                    <span className="hero-pill fallback-pill">
                      ⚠️ Showing Top Recommended Services
                    </span>
                  ) : (
                    <span className="hero-pill matches-pill">✓ Exact Matches Found</span>
                  )}
                </div>
                <h2 className="search-hero-heading">
                  {query ? (
                    <>
                      Results for <span className="highlight-term">"{query}"</span>
                    </>
                  ) : category ? (
                    category.name
                  ) : (
                    'Explore All Services'
                  )}
                </h2>
                <div className="search-hero-features-row">
                  {[
                    { icon: '⚡', text: <>Average <strong>15–20 min</strong> arrival</> },
                    { icon: '🛡️', text: <><strong>₹10,000</strong> LabouRack Property Protection</> },
                    { icon: '📍', text: <>Near <strong>{state.selectedLocation}</strong></> },
                    { icon: '🪪', text: <><strong>100%</strong> Aadhaar KYC Verified</> },
                  ].map((f, i) => (
                    <div key={i} className="hero-feature-item">
                      <span className="feature-icon">{f.icon}</span>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter & Sort Toolbar */}
            <div className="search-toolbar">
              <div className="filter-chips-group">
                {serviceFilterChips.map(chip => (
                  <button
                    key={chip.key}
                    type="button"
                    className={`filter-chip ${serviceFilter === chip.key ? 'active' : ''}`}
                    onClick={() => actions.setServiceFilter(chip.key)}
                  >
                    <span>{chip.icon}</span> {chip.label}
                  </button>
                ))}
              </div>
              <div className="sort-select-wrap">
                <label htmlFor="serviceSortSelect">Sort by:</label>
                <select
                  id="serviceSortSelect"
                  value={serviceSort}
                  onChange={e => actions.setServiceSort(e.target.value)}
                  className="sort-dropdown"
                >
                  <option value="relevance">Best Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="eta">Fastest Response (ETA)</option>
                </select>
              </div>
            </div>

            {/* Services Grid */}
            {displayServices.length > 0 ? (
              <div className="services-grid">
                {displayServices.map((service, index) => (
                  <div
                    key={service.id || service.name || index}
                    className="service-offer-card"
                    onClick={() => actions.chooseService(service)}
                  >
                    <div className="service-card-header">
                      <div className="service-card-icon-title">
                        <span className="service-icon">
                          {service.icon || (category ? category.icon : '✦')}
                        </span>
                        <div>
                          <h3>{service.name}</h3>
                          <div className="service-rating-row">
                            <span className="rating-stars">★★★★★</span>
                            <span className="rating-score">4.8</span>
                            <span className="rating-count">(120+ booked)</span>
                          </div>
                        </div>
                      </div>
                      <span className="service-badge">{service.badge || 'Verified Pro'}</span>
                    </div>
                    <p className="service-desc">{service.description}</p>
                    {service.included && (
                      <ul className="service-included-list">
                        {service.included.map((item, idx) => (
                          <li key={idx}>
                            <span className="check-icon">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="service-card-footer">
                      <div className="price-box">
                        <span className="price-label">Upfront Estimated Rate</span>
                        <div className="price-value-row">
                          <strong className="service-price">₹{service.price}</strong>
                          <span className="price-subtext">no hidden fee</span>
                        </div>
                        <small className="eta-tag">⚡ {service.estTime || '15 mins response'}</small>
                      </div>
                      <div className="service-card-footer-actions">
                        <button
                          type="button"
                          className="express-book-btn"
                          onClick={e => {
                            e.stopPropagation();
                            actions.expressAutoAssign(service);
                          }}
                          title="Direct checkout & auto-assign nearest worker"
                        >
                          ⚡ Express Book (₹69)
                        </button>
                        <button type="button" className="choose-service-btn">
                          Compare Pros →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-empty-card">
                <span className="empty-search-icon">🔍</span>
                <h3>No service packages match this filter</h3>
                <p>Try switching filters or searching with different keywords.</p>
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={() => {
                    actions.setServiceFilter('all');
                    actions.setServiceSort('relevance');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Direct Worker Matches Preview Strip */}
            <div className="nearby-workers-preview-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">DIRECT MATCH PROS</p>
                  <h2>
                    Verified Workers Ready for {query || (category ? category.name : 'this task')}
                  </h2>
                </div>
                <span className="workers-ready-badge">
                  🟢 {state.homeRepair.workers.length || 5} Active Now
                </span>
              </div>
              <div className="nearby-workers-horizontal-scroll">
                {(state.homeRepair.workers.length ? state.homeRepair.workers : workerProfiles)
                  .slice(0, 4)
                  .map(worker => (
                    <div
                      key={worker.name}
                      className="worker-mini-preview-card"
                      onClick={() => actions.chooseHouseholdIssue(query || 'Home Service')}
                    >
                      <div className="worker-avatar-badge-wrap">
                        <div className={`worker-avatar hue-${worker.hue}`}>
                          {initials(worker.name)}
                        </div>
                        <span className="online-dot" title="Available now"></span>
                      </div>
                      <div className="worker-mini-info">
                        <strong>{worker.name}</strong>
                        <small className="worker-mini-skills">
                          ★ {worker.rating} • {worker.reviews} reviews
                        </small>
                        <span className="worker-mini-meta">
                          📍 {worker.distance} km • ⚡ {worker.time} mins away
                        </span>
                        <span className="worker-rate-tag">₹{worker.rate}/hr</span>
                      </div>
                      <button
                        type="button"
                        className="mini-book-btn"
                        onClick={e => {
                          e.stopPropagation();
                          actions.bookWorker(worker);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Issues List View */}
        {view === 'issues' && (
          <div className="issue-list">
            {category &&
              category.issues &&
              category.issues.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => actions.chooseHouseholdIssue(item)}
                >
                  <span>{category.icon}</span>
                  <div>
                    <strong>{item}</strong>
                    <small>Match with nearby {category.workerType}s</small>
                  </div>
                  <b>→</b>
                </button>
              ))}
          </div>
        )}

        {/* Workers List View */}
        {view === 'workers' && (
          <>
            <div className="selected-problem-card">
              <div className="selected-problem-left">
                <span className="selected-problem-icon">
                  {category ? category.icon : '✦'}
                </span>
                <div className="selected-problem-details">
                  <span className="selected-problem-label">SELECTED TASK / SERVICE</span>
                  <h3 className="selected-problem-title">
                    {issue || (category ? category.name : 'Home Service')}
                  </h3>
                  <span className="selected-problem-sub">
                    ⚡ Matching nearby Aadhaar-verified{' '}
                    {category ? category.workerType : 'gig worker'}s
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="change-service-btn"
                onClick={actions.goBackInHomeRepair}
              >
                ✏️ Change Service
              </button>
            </div>

            <div className="worker-filters-bar">
              <span className="worker-filters-label">Filter Pros:</span>
              <div className="worker-filters-chips">
                {workerFilters.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`worker-filter-chip ${filter === key ? 'active' : ''}`}
                    onClick={() => actions.setWorkerFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="worker-list">
              {workers.length ? (
                workers.map(worker => (
                  <WorkerCard
                    key={worker.name}
                    worker={worker}
                    actions={actions}
                    state={state}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">🔍</span>
                  <p className="empty-workers">
                    No workers match this filter currently. Try clearing filters or expanding your
                    radius.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
