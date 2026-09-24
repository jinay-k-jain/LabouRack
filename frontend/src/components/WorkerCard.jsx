import React from 'react';
import { initials } from '../appLogic.js';

export default function WorkerCard({ worker, actions, state }) {
  if (!worker) return null;
  const available = worker.status === 'Available now';
  const isSaved = Boolean(
    state && Array.isArray(state.savedWorkers) && state.savedWorkers.includes(worker.name),
  );
  const skills = Array.isArray(worker.skills) ? worker.skills : [];

  return (
    <article className="worker-card">
      <div className={'worker-avatar worker-avatar--' + (worker.hue || 'orange')}>
        {initials(worker.name)}
        <span className={'worker-presence ' + (available ? 'available' : '')} />
      </div>
      <div className="worker-summary">
        <div className="worker-name-row">
          <div>
            <h3>
              {worker.name}{' '}
              <span className="verified-badge" title="Aadhaar KYC Verified">
                🛡️ Verified
              </span>
            </h3>
            <p>
              Age {worker.age} • {worker.experience || '5 yrs exp'}
            </p>
          </div>
          <button
            className={'heart-button ' + (isSaved ? 'saved' : '')}
            type="button"
            title={isSaved ? 'Remove favorite' : 'Save favorite'}
            aria-label={'Save ' + worker.name}
            onClick={() => actions.toggleSaveWorker(worker.name)}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        </div>
        <p className="worker-rating">
          <span>★</span> {worker.rating}{' '}
          <small>
            ({worker.reviews} reviews • {worker.completedJobs || 120}+ jobs)
          </small>
        </p>
        <div className="worker-tags">
          {skills.map(skill => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
      <div className="worker-booking">
        <p>
          📍 {worker.distance} km away{' '}
          <small>({worker.time} mins response)</small>
        </p>
        <span className={'availability ' + (available ? 'availability--now' : 'availability--busy')}>
          {worker.status}
        </span>
        <strong>
          ₹{worker.rate}
          <small>/hour</small>
        </strong>
        <button
          type="button"
          className={available ? 'book-button' : 'notify-button'}
          onClick={() =>
            available ? actions.bookWorker(worker) : actions.notifyWorker(worker)
          }
        >
          {available ? '⚡ Book Now' : 'Notify Availability'}
        </button>
      </div>
    </article>
  );
}
