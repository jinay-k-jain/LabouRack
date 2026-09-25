import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Line
} from 'recharts';

/* ─────────────────────────── MOCK DATA ─────────────────────────── */

const REGIONS = [
  'Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield',
  'MG Road', 'Jayanagar', 'BTM Layout', 'Electronic City',
];

const SERVICES = [
  { name: 'Plumbing', color: '#3b82f6', icon: '💧' },
  { name: 'Electrical', color: '#f59e0b', icon: '⚡' },
  { name: 'Appliance', color: '#10b981', icon: '🔌' },
  { name: 'Carpentry', color: '#8b5cf6', icon: '🪚' },
  { name: 'Cleaning', color: '#ec4899', icon: '✨' },
  { name: 'Painting', color: '#f97316', icon: '🎨' },
];

// Regional demand vs supply data
const regionalData = REGIONS.map(region => ({
  region,
  demand: Math.floor(Math.random() * 80 + 40),
  supply: Math.floor(Math.random() * 60 + 15),
  pending: Math.floor(Math.random() * 20 + 5),
}));

// Sort by demand gap (descending)
regionalData.sort((a, b) => (b.demand - b.supply) - (a.demand - a.supply));

// Service-wise demand breakdown
const serviceDemandData = SERVICES.map(s => ({
  name: s.name,
  value: Math.floor(Math.random() * 200 + 80),
  color: s.color,
  icon: s.icon,
}));

// 7-day demand trend with AI forecast
const trendData = [
  { day: 'Mon', actual: 145, forecast: 150 },
  { day: 'Tue', actual: 168, forecast: 162 },
  { day: 'Wed', actual: 192, forecast: 185 },
  { day: 'Thu', actual: 178, forecast: 190 },
  { day: 'Fri', actual: 210, forecast: 205 },
  { day: 'Sat', actual: null, forecast: 238 },
  { day: 'Sun', actual: null, forecast: 195 },
];

// Per-region per-service demand matrix
const regionServiceMatrix = REGIONS.map(region => {
  const row = { region };
  SERVICES.forEach(s => {
    row[s.name] = Math.floor(Math.random() * 30 + 5);
  });
  return row;
});

// Worker skill distribution
const workerSkillData = SERVICES.map(s => ({
  skill: s.name,
  workers: Math.floor(Math.random() * 80 + 20),
  avgRating: (Math.random() * 1.5 + 3.5).toFixed(1),
  utilization: Math.floor(Math.random() * 40 + 50),
}));

// Peak hours heatmap data
const peakHoursData = [
  { hour: '6 AM', requests: 12 },
  { hour: '7 AM', requests: 28 },
  { hour: '8 AM', requests: 54 },
  { hour: '9 AM', requests: 82 },
  { hour: '10 AM', requests: 95 },
  { hour: '11 AM', requests: 78 },
  { hour: '12 PM', requests: 65 },
  { hour: '1 PM', requests: 48 },
  { hour: '2 PM', requests: 56 },
  { hour: '3 PM', requests: 72 },
  { hour: '4 PM', requests: 88 },
  { hour: '5 PM', requests: 96 },
  { hour: '6 PM', requests: 90 },
  { hour: '7 PM', requests: 60 },
  { hour: '8 PM', requests: 35 },
  { hour: '9 PM', requests: 15 },
];

// Radar chart data for service quality
const radarData = SERVICES.map(s => ({
  service: s.name,
  demand: Math.floor(Math.random() * 60 + 40),
  satisfaction: Math.floor(Math.random() * 30 + 70),
  response: Math.floor(Math.random() * 40 + 50),
}));

// AI Allocation recommendations
const allocationRecommendations = [
  {
    region: 'Whitefield',
    service: 'Plumbing',
    gap: 18,
    urgency: 'critical',
    recommendation: 'Deploy 12+ plumbers — monsoon surge predicted this week',
  },
  {
    region: 'Koramangala',
    service: 'Electrical',
    gap: 14,
    urgency: 'high',
    recommendation: 'Route 8 electricians from BTM Layout (low demand area)',
  },
  {
    region: 'HSR Layout',
    service: 'Cleaning',
    gap: 11,
    urgency: 'high',
    recommendation: 'Seasonal deep-clean demand spike — recruit 10 workers',
  },
  {
    region: 'Indiranagar',
    service: 'Appliance',
    gap: 8,
    urgency: 'medium',
    recommendation: 'AC repair demand rising — schedule 5 technicians',
  },
  {
    region: 'Electronic City',
    service: 'Carpentry',
    gap: 5,
    urgency: 'low',
    recommendation: 'Stable — maintain current allocation of 12 carpenters',
  },
];

/* ─────────────────── CUSTOM TOOLTIP ─────────────────── */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="analytics-tooltip">
      <strong>{label}</strong>
      {payload.map((entry, i) => (
        <div key={i} style={{ color: entry.color, fontSize: 13 }}>
          {entry.name}: <b>{entry.value}</b>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

export default function AdminAnalyticsDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState(null);

  const totalDemand = regionalData.reduce((s, r) => s + r.demand, 0);
  const totalSupply = regionalData.reduce((s, r) => s + r.supply, 0);
  const overallGap = totalDemand - totalSupply;
  const criticalRegions = regionalData.filter(r => (r.demand - r.supply) > 15).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'regional', label: 'Regional Analysis', icon: '🗺️' },
    { id: 'workforce', label: 'Workforce', icon: '👷' },
    { id: 'recommendations', label: 'AI Insights', icon: '🤖' },
  ];

  return (
    <main className="analytics-dashboard">
      {/* HEADER */}
      <header className="analytics-header">
        <div className="analytics-header-left">
          <button className="analytics-back-btn" onClick={onBack} type="button">
            ← Back
          </button>
          <div>
            <h1 className="analytics-title">
              <span className="analytics-title-icon">📈</span>
              AI Demand Forecasting & Workforce Allocation
            </h1>
            <p className="analytics-subtitle">
              Real-time insights across {REGIONS.length} regions • Powered by ML Models
            </p>
          </div>
        </div>
        <div className="analytics-header-right">
          <span className="analytics-live-badge">
            <span className="analytics-pulse" /> LIVE
          </span>
          <span className="analytics-updated">Updated 2 min ago</span>
        </div>
      </header>

      {/* TAB NAVIGATION */}
      <nav className="analytics-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`analytics-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* ───────── OVERVIEW TAB ───────── */}
      {activeTab === 'overview' && (
        <div className="analytics-content">
          {/* KPI CARDS */}
          <div className="analytics-kpi-row">
            {[
              { label: 'Total Demand Today', value: totalDemand, icon: '📋', color: '#3b82f6', suffix: ' requests' },
              { label: 'Active Workers', value: totalSupply, icon: '👷', color: '#10b981', suffix: ' workers' },
              { label: 'Supply Gap', value: overallGap, icon: '⚠️', color: '#f59e0b', suffix: ' deficit' },
              { label: 'Critical Regions', value: criticalRegions, icon: '🔴', color: '#ef4444', suffix: ' zones' },
              { label: 'Avg Response Time', value: '18', icon: '⏱️', color: '#8b5cf6', suffix: ' min' },
              { label: 'Fulfillment Rate', value: '76', icon: '✅', color: '#06b6d4', suffix: '%' },
            ].map(kpi => (
              <div key={kpi.label} className="analytics-kpi-card" style={{ '--kpi-color': kpi.color }}>
                <span className="kpi-icon">{kpi.icon}</span>
                <div className="kpi-data">
                  <span className="kpi-value">{kpi.value}<small>{kpi.suffix}</small></span>
                  <span className="kpi-label">{kpi.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ROW 1: Demand vs Supply + Service Breakdown */}
          <div className="analytics-chart-row">
            <div className="analytics-chart-card wide">
              <div className="chart-card-header">
                <h3>📊 Regional Demand vs Worker Supply</h3>
                <span className="chart-badge">Live Data</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={regionalData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="region" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
                  <Bar dataKey="demand" name="Demand" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="supply" name="Workers Available" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Line dataKey="pending" name="Pending Jobs" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>🎯 Service Demand Split</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={serviceDemandData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceDemandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ROW 2: Trend Forecast + Peak Hours */}
          <div className="analytics-chart-row">
            <div className="analytics-chart-card wide">
              <div className="chart-card-header">
                <h3>🔮 7-Day Demand Forecast (AI Predicted)</h3>
                <span className="chart-badge ai">AI Model v3.2</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="actual" name="Actual Demand" stroke="#3b82f6" fill="url(#gradActual)" strokeWidth={2.5} connectNulls={false} />
                  <Area type="monotone" dataKey="forecast" name="AI Forecast" stroke="#f59e0b" fill="url(#gradForecast)" strokeWidth={2} strokeDasharray="6 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>⏰ Peak Hours Analysis</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={{ stroke: '#e2e8f0' }} interval={1} angle={-45} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="requests" name="Service Requests" radius={[3, 3, 0, 0]}>
                    {peakHoursData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.requests > 80 ? '#ef4444' : entry.requests > 50 ? '#f59e0b' : '#10b981'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ───────── REGIONAL ANALYSIS TAB ───────── */}
      {activeTab === 'regional' && (
        <div className="analytics-content">
          {/* Region selector pills */}
          <div className="region-selector-row">
            <button
              className={`region-pill ${!selectedRegion ? 'active' : ''}`}
              onClick={() => setSelectedRegion(null)}
              type="button"
            >
              All Regions
            </button>
            {REGIONS.map(r => (
              <button
                key={r}
                className={`region-pill ${selectedRegion === r ? 'active' : ''}`}
                onClick={() => setSelectedRegion(r)}
                type="button"
              >
                {r}
              </button>
            ))}
          </div>

          {/* Region heatmap bars */}
          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>🗺️ Region-wise Service Demand Breakdown</h3>
              <span className="chart-badge">Stacked View</span>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={selectedRegion ? regionServiceMatrix.filter(r => r.region === selectedRegion) : regionServiceMatrix}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="region" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {SERVICES.map(s => (
                  <Bar key={s.name} dataKey={s.name} stackId="a" fill={s.color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Region detail cards grid */}
          <div className="region-detail-grid">
            {(selectedRegion ? regionalData.filter(r => r.region === selectedRegion) : regionalData).map(r => {
              const gap = r.demand - r.supply;
              const gapPercent = Math.round((gap / r.demand) * 100);
              const urgency = gap > 20 ? 'critical' : gap > 10 ? 'high' : gap > 5 ? 'medium' : 'low';
              return (
                <div key={r.region} className={`region-detail-card urgency-${urgency}`}>
                  <div className="region-detail-header">
                    <h4>📍 {r.region}</h4>
                    <span className={`urgency-badge ${urgency}`}>{urgency.toUpperCase()}</span>
                  </div>
                  <div className="region-detail-stats">
                    <div className="region-stat">
                      <span className="stat-num demand">{r.demand}</span>
                      <span className="stat-label">Demand</span>
                    </div>
                    <div className="region-stat">
                      <span className="stat-num supply">{r.supply}</span>
                      <span className="stat-label">Workers</span>
                    </div>
                    <div className="region-stat">
                      <span className="stat-num gap">{gap}</span>
                      <span className="stat-label">Gap ({gapPercent}%)</span>
                    </div>
                  </div>
                  <div className="region-bar-track">
                    <div className="region-bar-fill supply" style={{ width: `${Math.min(100, (r.supply / r.demand) * 100)}%` }} />
                  </div>
                  <small className="region-bar-legend">
                    {Math.round((r.supply / r.demand) * 100)}% workforce coverage
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────── WORKFORCE TAB ───────── */}
      {activeTab === 'workforce' && (
        <div className="analytics-content">
          {/* Radar chart for service quality */}
          <div className="analytics-chart-row">
            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <h3>🛡️ Service Performance Radar</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="service" tick={{ fill: '#475569', fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar name="Demand" dataKey="demand" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                  <Radar name="Satisfaction" dataKey="satisfaction" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Radar name="Response Time" dataKey="response" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-chart-card wide">
              <div className="chart-card-header">
                <h3>👷 Worker Skill Distribution & Utilization</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={workerSkillData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="workers" name="Active Workers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" dataKey="utilization" name="Utilization %" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Worker table */}
          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>📋 Workforce Summary by Skill</h3>
            </div>
            <div className="workforce-table-wrap">
              <table className="workforce-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Active Workers</th>
                    <th>Avg Rating</th>
                    <th>Utilization</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workerSkillData.map(row => (
                    <tr key={row.skill}>
                      <td>
                        <span className="skill-cell">
                          {SERVICES.find(s => s.name === row.skill)?.icon} {row.skill}
                        </span>
                      </td>
                      <td><strong>{row.workers}</strong></td>
                      <td>
                        <span className="rating-cell">
                          ⭐ {row.avgRating}
                        </span>
                      </td>
                      <td>
                        <div className="utilization-bar-wrap">
                          <div className="utilization-bar" style={{
                            width: `${row.utilization}%`,
                            background: row.utilization > 80 ? '#ef4444' : row.utilization > 60 ? '#f59e0b' : '#10b981'
                          }} />
                          <span>{row.utilization}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`table-status ${row.utilization > 80 ? 'overloaded' : row.utilization > 60 ? 'busy' : 'available'}`}>
                          {row.utilization > 80 ? 'Overloaded' : row.utilization > 60 ? 'Busy' : 'Available'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────── AI INSIGHTS / RECOMMENDATIONS TAB ───────── */}
      {activeTab === 'recommendations' && (
        <div className="analytics-content">
          {/* AI Header Card */}
          <div className="ai-insights-hero">
            <div className="ai-hero-icon">🤖</div>
            <div className="ai-hero-text">
              <h3>AI-Powered Workforce Allocation Engine</h3>
              <p>
                Our ML model analyzes historical demand patterns, seasonal trends, weather data,
                and real-time booking velocity to generate optimal workforce allocation recommendations.
              </p>
            </div>
            <div className="ai-hero-stats">
              <div><strong>94.7%</strong><small>Prediction Accuracy</small></div>
              <div><strong>12K+</strong><small>Data Points / Day</small></div>
            </div>
          </div>

          {/* Recommendation Cards */}
          <div className="recommendations-list">
            {allocationRecommendations.map((rec, i) => (
              <div key={i} className={`recommendation-card urgency-${rec.urgency}`}>
                <div className="rec-header">
                  <div className="rec-location">
                    <span className="rec-index">#{i + 1}</span>
                    <div>
                      <h4>📍 {rec.region} — {rec.service}</h4>
                      <span className={`urgency-badge ${rec.urgency}`}>
                        {rec.urgency === 'critical' ? '🔴' : rec.urgency === 'high' ? '🟠' : rec.urgency === 'medium' ? '🟡' : '🟢'} {rec.urgency.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>
                  <div className="rec-gap-badge">
                    <span className="rec-gap-num">{rec.gap}</span>
                    <small>worker deficit</small>
                  </div>
                </div>
                <p className="rec-description">{rec.recommendation}</p>
                <div className="rec-actions">
                  <button className="rec-action-btn primary" type="button">
                    ✓ Apply Recommendation
                  </button>
                  <button className="rec-action-btn secondary" type="button">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Model Performance Card */}
          <div className="analytics-chart-card full-width">
            <div className="chart-card-header">
              <h3>📈 Model Accuracy — Predicted vs Actual (Last 7 Days)</h3>
              <span className="chart-badge ai">LSTM + XGBoost Ensemble</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData.filter(d => d.actual !== null)} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="actual" name="Actual" stroke="#3b82f6" fill="url(#gradAcc)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="forecast" name="AI Predicted" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="5 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </main>
  );
}
