import React from 'react';
import { availableLocations } from '../../appLogic.js';

export default function LocationPickerModal({ state, actions }) {
  if (!state.locationModalOpen) return null;
  return (
    <div className="modal-backdrop" onClick={actions.closeLocationModal}>
      <div className="location-modal-card" onClick={e => e.stopPropagation()}>
        <div className="location-modal-header">
          <h3>📍 Select Service Locality</h3>
          <button type="button" className="modal-close-btn" onClick={actions.closeLocationModal}>
            ✕
          </button>
        </div>
        <p className="location-modal-sub">
          Choose your current locality in Bengaluru for accurate 15-min worker dispatch.
        </p>

        <div className="location-list-grid">
          {(availableLocations || []).map(loc => (
            <button
              key={loc}
              type="button"
              className={`location-item-btn ${state.selectedLocation === loc ? 'active' : ''}`}
              onClick={() => actions.selectLocation(loc)}
            >
              <span>📍 {loc}</span>
              {state.selectedLocation === loc && (
                <span className="active-check">✓ Active</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
