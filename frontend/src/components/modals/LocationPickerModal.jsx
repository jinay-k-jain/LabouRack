import React, { useMemo, useState } from 'react';

const LOCATION_DATA = {
  Karnataka: { Bengaluru: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar'], Mysuru: ['Vijayanagar', 'Kuvempunagar'] },
  Maharashtra: { Mumbai: ['Bandra West', 'Andheri East', 'Powai'], Pune: ['Koregaon Park', 'Baner', 'Viman Nagar'] },
  Delhi: { 'New Delhi': ['Hauz Khas', 'Dwarka', 'Saket', 'Rohini'] },
  Telangana: { Hyderabad: ['Banjara Hills', 'Gachibowli', 'Hitech City'] },
  'Tamil Nadu': { Chennai: ['Adyar', 'Anna Nagar', 'Velachery'] },
  'West Bengal': { Kolkata: ['Salt Lake', 'Park Street', 'Ballygunge'] },
  Gujarat: { Ahmedabad: ['Navrangpura', 'Satellite', 'Bopal'] },
};

const POPULAR_LOCATIONS = [
  ['Indiranagar', 'Bengaluru', 'Karnataka'],
  ['Bandra West', 'Mumbai', 'Maharashtra'],
  ['Hauz Khas', 'New Delhi', 'Delhi'],
  ['Gachibowli', 'Hyderabad', 'Telangana'],
  ['Adyar', 'Chennai', 'Tamil Nadu'],
  ['Salt Lake', 'Kolkata', 'West Bengal'],
];

export default function LocationPickerModal({ state, actions }) {
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [selectedArea, setSelectedArea] = useState('Indiranagar');
  const [query, setQuery] = useState('');

  const cities = Object.keys(LOCATION_DATA[selectedState]);
  const areas = LOCATION_DATA[selectedState][selectedCity];
  const allLocations = useMemo(
    () => Object.entries(LOCATION_DATA).flatMap(([stateName, cityMap]) =>
      Object.entries(cityMap).flatMap(([cityName, areaNames]) =>
        areaNames.map(areaName => ({ stateName, cityName, areaName })),
      ),
    ),
    [],
  );
  const matches = query.trim()
    ? allLocations.filter(item =>
        `${item.areaName} ${item.cityName} ${item.stateName}`.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : [];

  function setLocation(stateName, cityName, areaName) {
    setSelectedState(stateName);
    setSelectedCity(cityName);
    setSelectedArea(areaName);
    setQuery('');
  }

  if (!state.locationModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={actions.closeLocationModal}>
      <section className="location-modal-card" onClick={e => e.stopPropagation()} aria-label="Choose service location">
        <div className="location-modal-header">
          <div>
            <p className="location-modal-eyebrow">SERVICE LOCATION</p>
            <h3>Select where you need help</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={actions.closeLocationModal} aria-label="Close location selector">✕</button>
        </div>
        <p className="location-modal-sub">Search popular areas or select your state, city, and locality.</p>

        <label className="location-search-wrap">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search area, city, or state" />
        </label>

        {matches.length > 0 && (
          <div className="location-search-results">
            {matches.slice(0, 5).map(item => (
              <button key={`${item.areaName}-${item.cityName}`} type="button" onClick={() => setLocation(item.stateName, item.cityName, item.areaName)}>
                <span>📍</span><span><strong>{item.areaName}</strong><small>{item.cityName}, {item.stateName}</small></span>
              </button>
            ))}
          </div>
        )}

        {!query && (
          <>
            <p className="location-section-label">Popular locations</p>
            <div className="popular-location-grid">
              {POPULAR_LOCATIONS.map(([areaName, cityName, stateName]) => (
                <button key={`${areaName}-${cityName}`} type="button" onClick={() => setLocation(stateName, cityName, areaName)} className={selectedArea === areaName && selectedCity === cityName ? 'active' : ''}>
                  <strong>{areaName}</strong><span>{cityName}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="location-select-grid">
          <label>State<select value={selectedState} onChange={event => { const nextState = event.target.value; const nextCity = Object.keys(LOCATION_DATA[nextState])[0]; setLocation(nextState, nextCity, LOCATION_DATA[nextState][nextCity][0]); }}>{Object.keys(LOCATION_DATA).map(item => <option key={item}>{item}</option>)}</select></label>
          <label>City<select value={selectedCity} onChange={event => setLocation(selectedState, event.target.value, LOCATION_DATA[selectedState][event.target.value][0])}>{cities.map(item => <option key={item}>{item}</option>)}</select></label>
          <label className="location-area-select">Area<select value={selectedArea} onChange={event => setSelectedArea(event.target.value)}>{areas.map(item => <option key={item}>{item}</option>)}</select></label>
        </div>

        <button type="button" className="location-confirm-btn" onClick={() => actions.selectLocation(`${selectedArea}, ${selectedCity}`)}>Use {selectedArea}, {selectedCity}</button>
      </section>
    </div>
  );
}
