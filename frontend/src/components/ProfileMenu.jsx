import React from 'react';
import { initials } from '../appLogic.js';

function Detail({ icon, label, value }) {
  return (
    <div className="profile-detail">
      <span className="profile-detail-icon">{icon}</span>
      <div>
        <span className="profile-detail-label">{label}</span>
        <span className="profile-detail-value">{value}</span>
      </div>
    </div>
  );
}

export default function ProfileMenu({ state, actions }) {
  const { role, session, profileOpen } = state;
  const name =
    role === 'admin'
      ? 'LabouRack Administrator'
      : session.name || (role === 'worker' ? 'Gig Worker' : 'Alex Morgan');
  const location = state.selectedLocation || 'Indiranagar, Bengaluru';
  const label =
    role === 'admin'
      ? 'Operations Admin'
      : role === 'worker'
        ? 'Verified Gig Worker'
        : 'Customer Account';

  return (
    <div className="profile-menu">
      <button
        className="avatar"
        type="button"
        title="View profile"
        aria-label="View profile"
        aria-expanded={profileOpen}
        onClick={actions.toggleProfile}
      >
        {initials(name)}
      </button>
      {profileOpen && (
        <aside className="profile-popover" aria-label="Account details">
          <div className="profile-top">
            <span className="profile-avatar">{initials(name)}</span>
            <div>
              <p className="profile-name">{name}</p>
              <p className="profile-role">{label}</p>
            </div>
          </div>
          <div className="profile-details">
            {role === 'admin' ? (
              <Detail icon="▣" label="Access Level" value="Super Administrator" />
            ) : (
              <Detail icon="📍" label="Selected Location" value={location} />
            )}
            {role === 'customer' && (
              <Detail icon="🛡️" label="Trust Status" value="Aadhaar Verified Customer" />
            )}
            {role === 'worker' && (
              <>
                <Detail
                  icon="✦"
                  label="Active Skills"
                  value={(session.skills || ['Plumbing', 'Electrical']).join(', ')}
                />
                <Detail icon="⭐" label="Worker Rating" value="4.9 ★ (142 reviews)" />
              </>
            )}
          </div>
          <button type="button" className="profile-signout" onClick={actions.signOut}>
            Sign out of LabouRack
          </button>
        </aside>
      )}
    </div>
  );
}
