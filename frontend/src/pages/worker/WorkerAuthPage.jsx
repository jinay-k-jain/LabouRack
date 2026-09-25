import React, { useState, useRef } from 'react';
import {
  SERVICE_CATEGORIES,
  EXPERIENCE_LEVELS,
  STATES,
  INITIAL_REG_STATE,
} from './workerData.js';

// mode: 'both' (default) — shows Login + Register tabs
// mode: 'register-only' — shows only registration form (no tabs)

// ─── Styles injected once ────────────────────────────────────────────────────
const AUTH_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f5f8f6;
  --surface:#ffffff;
  --card:#ffffff;
  --border:#e3e8e4;
  --accent:#0b6b46;
  --accent2:#1d4ed8;
  --warn:#d97706;
  --text:#0f1914;
  --muted:#617368;
  --subtle:#f0f5f3;
  --radius:14px;
  --font:'Plus Jakarta Sans',sans-serif;
}
html,body,#root{height:100%;font-family:var(--font);background:var(--bg);color:var(--text)}

.wauth-wrap{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg, #f0f5f3 0%, #e8f0ec 50%, #f5f8f6 100%);
  padding:24px;
}
.wauth-card{
  width:100%;max-width:520px;
  background:#ffffff;
  border:1px solid #e3e8e4;
  border-radius:24px;
  overflow:hidden;
  box-shadow:0 16px 48px rgba(15,25,20,.08), 0 4px 16px rgba(0,0,0,.04);
}
.wauth-brand{
  display:flex;align-items:center;gap:10px;
  padding:24px 32px 0;
  text-decoration:none;
}
.wauth-logo{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,#0b6b46,#059669);
  display:grid;place-items:center;
  font-size:18px;font-weight:900;color:#fff;
}
.wauth-logo-text{font-size:17px;font-weight:800;color:var(--text);}
.wauth-logo-text span{color:var(--accent);}

.wauth-tabs{
  display:flex;border-bottom:1px solid var(--border);
  margin:20px 32px 0;
}
.wauth-tab{
  flex:1;padding:12px;text-align:center;
  font-size:13px;font-weight:600;
  color:var(--muted);cursor:pointer;
  border:none;background:none;
  border-bottom:2px solid transparent;
  transition:.2s;
}
.wauth-tab.active{color:var(--accent);border-bottom-color:var(--accent);}

/* LOGIN FORM */
.wauth-body{padding:28px 32px 32px;}
.wauth-title{font-size:22px;font-weight:800;margin-bottom:6px;}
.wauth-sub{font-size:13px;color:var(--muted);margin-bottom:24px;line-height:1.5;}

.wf-group{margin-bottom:16px;}
.wf-label{display:block;font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
.wf-input{
  width:100%;padding:12px 14px;
  background:var(--subtle);border:1px solid var(--border);
  border-radius:10px;color:var(--text);font-size:14px;
  font-family:var(--font);transition:.2s;
}
.wf-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(16,185,129,.15);}
.wf-input::placeholder{color:var(--muted);}
.wf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.wf-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}

.phone-wrap{display:flex;gap:10px;align-items:center;}
.phone-code{
  padding:12px 14px;background:var(--subtle);
  border:1px solid var(--border);border-radius:10px;
  font-size:14px;color:var(--text);white-space:nowrap;
}
.phone-field-input{flex:1;}

.otp-wrap{display:flex;gap:8px;justify-content:center;margin:8px 0;}
.otp-wrap input{
  width:46px;height:52px;text-align:center;
  font-size:20px;font-weight:700;
  background:var(--subtle);border:1px solid var(--border);
  border-radius:10px;color:var(--text);
  transition:.2s;
}
.otp-wrap input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(16,185,129,.15);}

.wauth-btn{
  width:100%;padding:14px;border:none;border-radius:12px;
  background:linear-gradient(135deg,#0b6b46,#059669);
  color:#fff;font-size:15px;font-weight:700;
  cursor:pointer;transition:.2s;margin-top:4px;
  font-family:var(--font);
}
.wauth-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(11,107,70,.25);}
.wauth-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.wauth-btn-outline{
  background:transparent;border:1px solid var(--border);
  color:var(--text);margin-top:8px;
}
.wauth-btn-outline:hover{border-color:var(--accent);box-shadow:none;}

.otp-hint{font-size:12px;color:var(--muted);text-align:center;margin-top:8px;}
.resend-line{font-size:13px;color:var(--muted);text-align:center;margin-top:12px;}
.resend-btn{background:none;border:none;color:var(--accent);font-size:13px;cursor:pointer;font-family:var(--font);font-weight:600;}

/* STEP PROGRESS */
.reg-progress{
  display:flex;align-items:center;gap:0;
  padding:20px 32px 0;overflow-x:auto;
}
.reg-step{
  display:flex;align-items:center;gap:6px;
  font-size:11px;font-weight:600;color:var(--muted);
  white-space:nowrap;
}
.reg-step-num{
  width:24px;height:24px;border-radius:50%;
  display:grid;place-items:center;
  background:var(--subtle);border:1px solid var(--border);
  font-size:11px;font-weight:700;
  transition:.3s;flex-shrink:0;
}
.reg-step.done .reg-step-num{background:var(--accent);border-color:var(--accent);color:#fff;}
.reg-step.active .reg-step-num{background:var(--accent2);border-color:var(--accent2);color:#fff;}
.reg-step.active{color:var(--text);}
.reg-step.done{color:var(--accent);}
.reg-step-line{width:20px;height:2px;background:var(--border);margin:0 4px;flex-shrink:0;}
.reg-step-line.done{background:var(--accent);}

/* CATEGORY GRID */
.cat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:6px;}
.cat-btn{
  display:flex;align-items:center;gap:10px;
  padding:12px;background:var(--subtle);
  border:1.5px solid var(--border);border-radius:12px;
  cursor:pointer;transition:.2s;font-family:var(--font);
}
.cat-btn:hover{border-color:var(--accent);background:rgba(11,107,70,.04);}
.cat-btn.selected{border-color:var(--accent);background:rgba(11,107,70,.08);}
.cat-icon{font-size:22px;width:36px;height:36px;display:grid;place-items:center;}
.cat-label{font-size:13px;font-weight:600;color:var(--text);}

/* SKILL PILLS */
.skill-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;}
.skill-pill{
  padding:6px 12px;border-radius:20px;
  font-size:12px;font-weight:600;
  border:1px solid var(--border);background:var(--subtle);
  color:var(--muted);cursor:pointer;transition:.2s;
}
.skill-pill.selected{background:rgba(29,78,216,.08);border-color:var(--accent2);color:#1d4ed8;}

/* EXPERIENCE PILLS */
.exp-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;}
.exp-pill{
  padding:8px 14px;border-radius:10px;font-size:13px;font-weight:600;
  border:1px solid var(--border);background:var(--subtle);color:var(--muted);
  cursor:pointer;transition:.2s;
}
.exp-pill.selected{background:rgba(11,107,70,.08);border-color:var(--accent);color:var(--accent);}

/* TIME RANGE */
.time-range-row{display:flex;gap:12px;align-items:center;}
.time-sep{color:var(--muted);font-size:13px;}

/* AADHAAR */
.aadhaar-row{display:flex;gap:8px;}
.verify-btn{
  padding:12px 16px;border:none;border-radius:10px;
  background:var(--accent2);color:#fff;font-size:13px;font-weight:700;
  cursor:pointer;white-space:nowrap;font-family:var(--font);transition:.2s;
}
.verify-btn:disabled{opacity:.5;cursor:not-allowed;}
.verify-btn.done{background:#059669;}
.field-note{font-size:11px;color:var(--muted);margin-top:5px;line-height:1.4;}
.field-error{font-size:11px;color:#f87171;margin-top:5px;}

/* GENDER PILLS */
.gender-pills{display:flex;gap:8px;margin-top:6px;}
.gender-pill{
  flex:1;padding:10px;text-align:center;
  border:1px solid var(--border);border-radius:10px;
  font-size:13px;font-weight:600;color:var(--muted);
  cursor:pointer;transition:.2s;background:var(--subtle);
}
.gender-pill.selected{border-color:var(--accent2);background:rgba(29,78,216,.06);color:#1d4ed8;}

/* LANGUAGE PILLS */
.lang-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;}

/* CONSENT */
.consent-box{
  background:var(--subtle);border:1px solid var(--border);border-radius:12px;
  padding:16px;margin-bottom:14px;
}
.consent-label{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:13px;color:var(--muted);line-height:1.5;}
.consent-label input{margin-top:2px;accent-color:var(--accent);}

/* BACK BTN */
.back-btn{
  display:flex;align-items:center;gap:6px;
  background:none;border:none;color:var(--muted);
  font-size:13px;font-weight:600;cursor:pointer;
  margin-bottom:16px;font-family:var(--font);padding:0;
}
.back-btn:hover{color:var(--text);}

/* SUCCESS BANNER */
.success-banner{
  text-align:center;padding:48px 32px;
}
.success-icon-big{
  width:80px;height:80px;border-radius:50%;
  background:linear-gradient(135deg,#0b6b46,#059669);
  display:grid;place-items:center;
  font-size:36px;margin:0 auto 20px;
  box-shadow:0 16px 40px rgba(11,107,70,.2);
}
.success-title{font-size:24px;font-weight:800;margin-bottom:8px;}
.success-sub{font-size:14px;color:var(--muted);margin-bottom:28px;line-height:1.6;}

/* SELECT */
.wf-select{
  width:100%;padding:12px 14px;
  background:var(--subtle);border:1px solid var(--border);
  border-radius:10px;color:var(--text);font-size:14px;
  font-family:var(--font);cursor:pointer;
}
.wf-select:focus{outline:none;border-color:var(--accent);}
.wf-select option{background:#ffffff;}

/* TEXTAREA */
.wf-textarea{
  width:100%;padding:12px 14px;min-height:90px;resize:vertical;
  background:var(--subtle);border:1px solid var(--border);
  border-radius:10px;color:var(--text);font-size:14px;
  font-family:var(--font);
}
.wf-textarea:focus{outline:none;border-color:var(--accent);}

.section-eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--accent);text-transform:uppercase;margin-bottom:14px;}
.step-actions{display:flex;gap:10px;margin-top:6px;}
.step-actions .wauth-btn{margin-top:0;}
`;

// ─── Inject styles ────────────────────────────────────────────────────────────
function StyleOnce() {
  if (document.getElementById('wauth-style')) return null;
  const s = document.createElement('style');
  s.id = 'wauth-style';
  s.textContent = AUTH_STYLE;
  document.head.appendChild(s);
  return null;
}

// ─── Step labels ─────────────────────────────────────────────────────────────
const STEPS = ['Personal', 'Address', 'Aadhaar KYC', 'Skills', 'Confirm'];
const LANGS = ['Hindi', 'English', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati'];

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function RegProgress({ step }) {
  return (
    <div className="reg-progress">
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div className={`reg-step ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : ''}`}>
            <span className="reg-step-num">{i + 1 < step ? '✓' : i + 1}</span>
            <span>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`reg-step-line ${i + 1 < step ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── OTP Box ──────────────────────────────────────────────────────────────────
function OtpBox({ otp, setOtp }) {
  const refs = useRef([]);
  const handleChange = (i, val) => {
    const v = val.replace(/\D/, '');
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };
  return (
    <div className="otp-wrap">
      {otp.map((d, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          value={d}
          maxLength={1}
          inputMode="numeric"
          autoFocus={i === 0}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
}

// ─── Login View ───────────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const sendOtp = (e) => {
    e.preventDefault();
    if (phone.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    setError('');
    setOtpSent(true);
  };

  const verify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter all 6 OTP digits.'); return; }
    // Demo: any 6 digits work
    onLogin({ phone, name: 'Ravi Kumar' });
  };

  return (
    <div className="wauth-body">
      <h2 className="wauth-title">Sign in to your account</h2>
      <p className="wauth-sub">
        Enter your registered mobile number to receive a one-time verification code.
      </p>

      {!otpSent ? (
        <form onSubmit={sendOtp}>
          <div className="wf-group">
            <label className="wf-label">Mobile Number</label>
            <div className="phone-wrap">
              <span className="phone-code">🇮🇳 +91</span>
              <input
                className="wf-input phone-field-input"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/, '').slice(0, 10))}
                inputMode="numeric"
                placeholder="Enter 10-digit number"
                autoComplete="tel"
              />
            </div>
          </div>
          {error && <p className="field-error">{error}</p>}
          <button className="wauth-btn" type="submit">
            Send OTP →
          </button>
        </form>
      ) : (
        <form onSubmit={verify}>
          <div className="wf-group">
            <label className="wf-label">Verification Code sent to +91 {phone}</label>
            <OtpBox otp={otp} setOtp={setOtp} />
            <p className="otp-hint">💡 Demo: Enter any 6 digits to sign in.</p>
          </div>
          {error && <p className="field-error">{error}</p>}
          <button className="wauth-btn" type="submit">
            Verify &amp; Sign In →
          </button>
          <p className="resend-line">
            Didn't receive it?{' '}
            <button type="button" className="resend-btn" onClick={() => { setOtp(['','','','','','']); setOtpSent(false); }}>
              Resend OTP
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

// ─── STEP 1: Personal Details ─────────────────────────────────────────────────
function Step1({ data, setData, onNext }) {
  const [err, setErr] = useState({});
  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = 'Full name is required.';
    if (!data.phone || data.phone.length !== 10) e.phone = 'Valid 10-digit number required.';
    if (!data.gender) e.gender = 'Please select a gender.';
    if (!data.dob) e.dob = 'Date of birth is required.';
    setErr(e);
    return Object.keys(e).length === 0;
  };
  const submit = (e) => { e.preventDefault(); if (validate()) onNext(); };

  return (
    <form onSubmit={submit}>
      <p className="section-eyebrow">Step 1 — Personal Information</p>

      <div className="wf-group">
        <label className="wf-label">Full Legal Name *</label>
        <input
          className="wf-input"
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
          placeholder="As on your Aadhaar card"
          autoComplete="name"
        />
        {err.name && <p className="field-error">{err.name}</p>}
      </div>

      <div className="wf-row">
        <div className="wf-group">
          <label className="wf-label">Date of Birth *</label>
          <input
            className="wf-input"
            type="date"
            value={data.dob}
            onChange={e => setData({ ...data, dob: e.target.value })}
            max={new Date(Date.now() - 18 * 365.25 * 86400000).toISOString().split('T')[0]}
          />
          {err.dob && <p className="field-error">{err.dob}</p>}
        </div>
        <div className="wf-group">
          <label className="wf-label">Gender *</label>
          <div className="gender-pills">
            {['Male', 'Female', 'Other'].map(g => (
              <div
                key={g}
                className={`gender-pill ${data.gender === g ? 'selected' : ''}`}
                onClick={() => setData({ ...data, gender: g })}
              >
                {g}
              </div>
            ))}
          </div>
          {err.gender && <p className="field-error">{err.gender}</p>}
        </div>
      </div>

      <div className="wf-group">
        <label className="wf-label">Mobile Number *</label>
        <div className="phone-wrap">
          <span className="phone-code">🇮🇳 +91</span>
          <input
            className="wf-input phone-field-input"
            value={data.phone}
            onChange={e => setData({ ...data, phone: e.target.value.replace(/\D/, '').slice(0, 10) })}
            inputMode="numeric"
            placeholder="10-digit number"
          />
        </div>
        {err.phone && <p className="field-error">{err.phone}</p>}
      </div>

      <div className="wf-group">
        <label className="wf-label">Email Address (Optional)</label>
        <input
          className="wf-input"
          type="email"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
          placeholder="yourname@email.com"
          autoComplete="email"
        />
      </div>

      <div className="wf-group">
        <label className="wf-label">Languages You Speak</label>
        <div className="lang-pills">
          {LANGS.map(lang => (
            <div
              key={lang}
              className={`skill-pill ${data.languages.includes(lang) ? 'selected' : ''}`}
              onClick={() => {
                const langs = data.languages.includes(lang)
                  ? data.languages.filter(l => l !== lang)
                  : [...data.languages, lang];
                setData({ ...data, languages: langs });
              }}
            >
              {lang}
            </div>
          ))}
        </div>
      </div>

      <button className="wauth-btn" type="submit">
        Continue to Address →
      </button>
    </form>
  );
}

// ─── STEP 2: Address ──────────────────────────────────────────────────────────
function Step2({ data, setData, onNext, onBack }) {
  const [err, setErr] = useState({});
  const validate = () => {
    const e = {};
    if (!data.street.trim()) e.street = 'Street / Area is required.';
    if (!data.city.trim()) e.city = 'City is required.';
    if (!data.pincode || data.pincode.length !== 6) e.pincode = 'Valid 6-digit pincode required.';
    if (!data.state) e.state = 'Please select a state.';
    setErr(e);
    return Object.keys(e).length === 0;
  };
  const submit = (e) => { e.preventDefault(); if (validate()) onNext(); };

  return (
    <form onSubmit={submit}>
      <p className="section-eyebrow">Step 2 — Your Address</p>

      <div className="wf-row">
        <div className="wf-group">
          <label className="wf-label">House / Flat No.</label>
          <input
            className="wf-input"
            value={data.houseNo}
            onChange={e => setData({ ...data, houseNo: e.target.value })}
            placeholder="e.g. 12B, Flat 3"
          />
        </div>
        <div className="wf-group">
          <label className="wf-label">Landmark</label>
          <input
            className="wf-input"
            value={data.landmark}
            onChange={e => setData({ ...data, landmark: e.target.value })}
            placeholder="Near bus stop, etc."
          />
        </div>
      </div>

      <div className="wf-group">
        <label className="wf-label">Street / Area *</label>
        <input
          className="wf-input"
          value={data.street}
          onChange={e => setData({ ...data, street: e.target.value })}
          placeholder="Street name or colony"
        />
        {err.street && <p className="field-error">{err.street}</p>}
      </div>

      <div className="wf-group">
        <label className="wf-label">Locality / Neighbourhood</label>
        <input
          className="wf-input"
          value={data.locality}
          onChange={e => setData({ ...data, locality: e.target.value })}
          placeholder="e.g. Indiranagar, HSR Layout"
        />
      </div>

      <div className="wf-row">
        <div className="wf-group">
          <label className="wf-label">City *</label>
          <input
            className="wf-input"
            value={data.city}
            onChange={e => setData({ ...data, city: e.target.value })}
            placeholder="e.g. Bengaluru"
          />
          {err.city && <p className="field-error">{err.city}</p>}
        </div>
        <div className="wf-group">
          <label className="wf-label">Pincode *</label>
          <input
            className="wf-input"
            value={data.pincode}
            onChange={e => setData({ ...data, pincode: e.target.value.replace(/\D/, '').slice(0, 6) })}
            inputMode="numeric"
            placeholder="6-digit pincode"
          />
          {err.pincode && <p className="field-error">{err.pincode}</p>}
        </div>
      </div>

      <div className="wf-group">
        <label className="wf-label">State *</label>
        <select
          className="wf-select"
          value={data.state}
          onChange={e => setData({ ...data, state: e.target.value })}
        >
          <option value="">Select your state</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {err.state && <p className="field-error">{err.state}</p>}
      </div>

      <div className="step-actions">
        <button type="button" className="wauth-btn wauth-btn-outline" style={{ flex: '0 0 auto', width: 'auto', padding: '14px 20px' }} onClick={onBack}>
          ← Back
        </button>
        <button className="wauth-btn" type="submit" style={{ margin: 0 }}>
          Continue to Aadhaar KYC →
        </button>
      </div>
    </form>
  );
}

// ─── STEP 3: Aadhaar KYC ─────────────────────────────────────────────────────
function Step3({ data, setData, onNext, onBack }) {
  const [err, setErr] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState(['', '', '', '', '', '']);

  const triggerVerify = () => {
    if (data.aadhaar.length !== 12) { setErr({ aadhaar: 'Enter valid 12-digit Aadhaar number.' }); return; }
    setErr({});
    setOtpSent(true);
  };

  const confirmVerify = () => {
    const code = aadhaarOtp.join('');
    if (code.length !== 6) { setErr({ otp: 'Enter all 6 OTP digits.' }); return; }
    setData({ ...data, aadhaarVerified: true });
    setErr({});
  };

  const validate = () => {
    const e = {};
    if (data.aadhaar.length !== 12) e.aadhaar = 'Enter 12-digit Aadhaar.';
    if (!data.aadhaarVerified) e.verify = 'You must verify your Aadhaar before continuing.';
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => { e.preventDefault(); if (validate()) onNext(); };

  return (
    <form onSubmit={submit}>
      <p className="section-eyebrow">Step 3 — Aadhaar Identity Verification</p>

      <div style={{ background: 'rgba(11,107,70,.06)', border: '1px solid rgba(11,107,70,.15)', borderRadius: 12, padding: '12px 14px', marginBottom: 20, fontSize: 13, color: '#0b6b46', lineHeight: 1.5 }}>
        🛡️ Your Aadhaar number is <strong>encrypted end-to-end</strong>. We use UIDAI-compliant hashing — it is <strong>never stored in plain text</strong> or displayed to customers.
      </div>

      <div className="wf-group">
        <label className="wf-label">12-Digit Aadhaar Number *</label>
        <div className="aadhaar-row">
          <input
            className="wf-input"
            value={data.aadhaar}
            onChange={e => setData({ ...data, aadhaar: e.target.value.replace(/\D/, '').slice(0, 12) })}
            inputMode="numeric"
            placeholder="e.g. 5489 1204 8921"
            disabled={data.aadhaarVerified}
          />
          <button
            type="button"
            className={`verify-btn ${data.aadhaarVerified ? 'done' : ''}`}
            disabled={data.aadhaarVerified}
            onClick={triggerVerify}
          >
            {data.aadhaarVerified ? 'Verified ✓' : otpSent ? 'Resend' : 'Send OTP'}
          </button>
        </div>
        {err.aadhaar && <p className="field-error">{err.aadhaar}</p>}
        <p className="field-note">🔒 Aadhaar linked mobile OTP will be dispatched via UIDAI.</p>
      </div>

      {otpSent && !data.aadhaarVerified && (
        <div className="wf-group">
          <label className="wf-label">Enter UIDAI OTP (6-Digit) *</label>
          <OtpBox otp={aadhaarOtp} setOtp={setAadhaarOtp} />
          <p className="otp-hint">Demo: Any 6 digits will pass verification.</p>
          {err.otp && <p className="field-error">{err.otp}</p>}
          <button type="button" className="wauth-btn" style={{ marginTop: 10 }} onClick={confirmVerify}>
            Confirm Aadhaar OTP ✓
          </button>
        </div>
      )}

      {data.aadhaarVerified && (
        <div style={{ background: 'rgba(11,107,70,.06)', border: '1px solid rgba(11,107,70,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#0b6b46', display: 'flex', alignItems: 'center', gap: 8 }}>
          ✅ Aadhaar KYC successfully verified!
        </div>
      )}

      {err.verify && <p className="field-error">{err.verify}</p>}

      <div className="wf-group">
        <label className="wf-label">PAN Card Number (Optional)</label>
        <input
          className="wf-input"
          value={data.panCard}
          onChange={e => setData({ ...data, panCard: e.target.value.toUpperCase().slice(0, 10) })}
          placeholder="e.g. ABCDE1234F"
        />
        <p className="field-note">PAN helps with GST billing for high-income workers.</p>
      </div>

      <div className="step-actions">
        <button type="button" className="wauth-btn wauth-btn-outline" style={{ flex: '0 0 auto', width: 'auto', padding: '14px 20px' }} onClick={onBack}>
          ← Back
        </button>
        <button className="wauth-btn" type="submit" style={{ margin: 0 }}>
          Continue to Skills →
        </button>
      </div>
    </form>
  );
}

// ─── STEP 4: Skills & Experience ──────────────────────────────────────────────
function Step4({ data, setData, onNext, onBack }) {
  const [err, setErr] = useState({});

  const toggleCat = (id) => {
    const cats = data.selectedCategories.includes(id)
      ? data.selectedCategories.filter(c => c !== id)
      : [...data.selectedCategories, id];
    setData({ ...data, selectedCategories: cats });
  };

  const toggleSkill = (skill) => {
    const skills = data.selectedSkills.includes(skill)
      ? data.selectedSkills.filter(s => s !== skill)
      : [...data.selectedSkills, skill];
    setData({ ...data, selectedSkills: skills });
  };

  const validate = () => {
    const e = {};
    if (data.selectedCategories.length === 0) e.cats = 'Select at least one service category.';
    if (!data.experienceLevel) e.exp = 'Please select your experience level.';
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => { e.preventDefault(); if (validate()) onNext(); };

  const activeCats = SERVICE_CATEGORIES.filter(c => data.selectedCategories.includes(c.id));

  return (
    <form onSubmit={submit}>
      <p className="section-eyebrow">Step 4 — Service Categories &amp; Experience</p>

      <div className="wf-group">
        <label className="wf-label">Service Categories You Offer *</label>
        <div className="cat-grid">
          {SERVICE_CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className={`cat-btn ${data.selectedCategories.includes(cat.id) ? 'selected' : ''}`}
              onClick={() => toggleCat(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </div>
          ))}
        </div>
        {err.cats && <p className="field-error">{err.cats}</p>}
      </div>

      {activeCats.length > 0 && (
        <div className="wf-group">
          <label className="wf-label">Specific Skills (Pick all that apply)</label>
          <div className="skill-pills">
            {activeCats.flatMap(c => c.skills).map(skill => (
              <div
                key={skill}
                className={`skill-pill ${data.selectedSkills.includes(skill) ? 'selected' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="wf-group">
        <label className="wf-label">Work Experience *</label>
        <div className="exp-pills">
          {EXPERIENCE_LEVELS.map(lv => (
            <div
              key={lv.value}
              className={`exp-pill ${data.experienceLevel === lv.value ? 'selected' : ''}`}
              onClick={() => setData({ ...data, experienceLevel: lv.value })}
            >
              {lv.label}
            </div>
          ))}
        </div>
        {err.exp && <p className="field-error">{err.exp}</p>}
      </div>

      <div className="wf-group">
        <label className="wf-label">Describe Your Expertise</label>
        <textarea
          className="wf-textarea"
          value={data.experienceDesc}
          onChange={e => setData({ ...data, experienceDesc: e.target.value })}
          placeholder="e.g. 7 years of domestic electrical work. Expert in fan motor repair, MCB fitting, CCTV wiring, and inverter installation across Bengaluru."
        />
      </div>

      {/* CERTIFICATE PHOTO UPLOAD — Optional */}
      <div className="wf-group">
        <label className="wf-label">Certificates / Credentials (Optional)</label>
        <p className="field-note" style={{ marginTop: 0, marginBottom: 8 }}>
          📜 Upload photos of ITI certificates, trade licenses, skill certifications, or any credentials that validate your expertise. This helps build customer trust.
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          id="cert-photo-input"
          style={{ display: 'none' }}
          onChange={(e) => {
            const files = e.target.files;
            if (!files || !files.length) return;
            const certs = [...(data.certificates || [])];
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const reader = new FileReader();
              reader.onload = (ev) => {
                certs.push({
                  id: 'cert_' + Date.now() + '_' + i,
                  name: file.name,
                  dataUrl: ev.target.result,
                });
                setData({ ...data, certificates: [...certs] });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {(data.certificates || []).map(cert => (
            <div key={cert.id} style={{
              position: 'relative', width: 80, height: 80, borderRadius: 10,
              overflow: 'hidden', border: '1.5px solid var(--border)',
              background: 'var(--subtle)',
            }}>
              <img src={cert.dataUrl} alt={cert.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => setData({
                  ...data,
                  certificates: (data.certificates || []).filter(c => c.id !== cert.id),
                })}
                style={{
                  position: 'absolute', top: 3, right: 3,
                  background: 'rgba(220,38,38,.9)', color: '#fff', border: 'none',
                  borderRadius: '50%', width: 20, height: 20, fontSize: 10,
                  cursor: 'pointer', display: 'grid', placeItems: 'center',
                }}
              >✕</button>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,.6)', color: '#fff',
                fontSize: 8, padding: '2px 4px', textAlign: 'center',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {cert.name}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => document.getElementById('cert-photo-input').click()}
            style={{
              padding: '16px 20px', borderRadius: 10,
              border: '2px dashed var(--border)', background: 'var(--subtle)',
              color: 'var(--muted)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, minWidth: 100, textAlign: 'center',
              transition: '.2s',
            }}
          >
            <span style={{ fontSize: 24 }}>📄</span>
            <span>{(data.certificates || []).length > 0 ? '+ Add More' : 'Upload Certificate'}</span>
          </button>
        </div>
        <p className="field-note" style={{ marginTop: 6 }}>
          Accepted: JPG, PNG. Max 5 files. These are shown to admins during verification only.
        </p>
      </div>

      <div className="wf-group">
        <label className="wf-label">Working Hours</label>
        <div className="time-range-row">
          <input
            className="wf-input"
            type="time"
            value={data.availableFrom}
            onChange={e => setData({ ...data, availableFrom: e.target.value })}
            style={{ flex: 1 }}
          />
          <span className="time-sep">to</span>
          <input
            className="wf-input"
            type="time"
            value={data.availableTo}
            onChange={e => setData({ ...data, availableTo: e.target.value })}
            style={{ flex: 1 }}
          />
        </div>
        <p className="field-note">Set your typical working hours. You can update this anytime.</p>
      </div>

      <div className="step-actions">
        <button type="button" className="wauth-btn wauth-btn-outline" style={{ flex: '0 0 auto', width: 'auto', padding: '14px 20px' }} onClick={onBack}>
          ← Back
        </button>
        <button className="wauth-btn" type="submit" style={{ margin: 0 }}>
          Review &amp; Submit →
        </button>
      </div>
    </form>
  );
}

// ─── STEP 5: Confirm & Consent ────────────────────────────────────────────────
function Step5({ data, setData, onSubmit, onBack }) {
  const [err, setErr] = useState('');
  const cats = SERVICE_CATEGORIES.filter(c => data.selectedCategories.includes(c.id));

  const submit = (e) => {
    e.preventDefault();
    if (!data.consented || !data.backgroundCheck) {
      setErr('Please accept both checkboxes to continue.');
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={submit}>
      <p className="section-eyebrow">Step 5 — Review &amp; Confirm</p>

      <div style={{ background: 'var(--subtle)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { l: 'Name', v: data.name },
            { l: 'Phone', v: '+91 ' + data.phone },
            { l: 'Gender', v: data.gender },
            { l: 'DOB', v: data.dob },
            { l: 'City', v: `${data.city}, ${data.state}` },
            { l: 'Pincode', v: data.pincode },
            { l: 'Aadhaar', v: data.aadhaarVerified ? '✅ Verified' : '❌ Not Verified' },
            { l: 'Experience', v: EXPERIENCE_LEVELS.find(l => l.value === data.experienceLevel)?.label || '—' },
          ].map(row => (
            <div key={row.l}>
              <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 2 }}>{row.l}</p>
              <p style={{ fontWeight: 600, color: 'var(--text)' }}>{row.v || '—'}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 6 }}>Service Categories</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <span key={c.id} style={{ background: 'rgba(59,130,246,.15)', border: '1px solid rgba(59,130,246,.3)', borderRadius: 20, padding: '4px 10px', fontSize: 12, color: '#60a5fa' }}>
                {c.icon} {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="consent-box">
        <label className="consent-label">
          <input type="checkbox" checked={data.consented} onChange={e => setData({ ...data, consented: e.target.checked })} />
          <span>I confirm that all the details provided above are accurate and true to the best of my knowledge. I agree to LabouRack's <strong>Terms of Service</strong> and <strong>Worker Code of Conduct</strong>.</span>
        </label>
      </div>

      <div className="consent-box">
        <label className="consent-label">
          <input type="checkbox" checked={data.backgroundCheck} onChange={e => setData({ ...data, backgroundCheck: e.target.checked })} />
          <span>I consent to LabouRack performing a <strong>background verification check</strong> using my Aadhaar KYC data, which is required to protect customer safety.</span>
        </label>
      </div>

      {err && <p className="field-error" style={{ marginBottom: 12 }}>{err}</p>}

      <div className="step-actions">
        <button type="button" className="wauth-btn wauth-btn-outline" style={{ flex: '0 0 auto', width: 'auto', padding: '14px 20px' }} onClick={onBack}>
          ← Back
        </button>
        <button className="wauth-btn" type="submit" style={{ margin: 0, background: 'linear-gradient(135deg,#10b981,#059669)' }}>
          🚀 Submit &amp; Join LabouRack
        </button>
      </div>
    </form>
  );
}

// ─── Register View ────────────────────────────────────────────────────────────
function RegisterView({ onRegistered }) {
  const [data, setData] = useState(INITIAL_REG_STATE);
  const [submitted, setSubmitted] = useState(false);

  const next = () => setData(d => ({ ...d, step: d.step + 1 }));
  const back = () => setData(d => ({ ...d, step: d.step - 1 }));

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => onRegistered(data), 1800);
  };

  if (submitted) {
    return (
      <div className="success-banner">
        <div className="success-icon-big">🎉</div>
        <h2 className="success-title">Registration Submitted!</h2>
        <p className="success-sub">
          Welcome to LabouRack, <strong>{data.name}</strong>! Your profile is being verified.
          You'll receive your first job notification once approved.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 10, color: '#6ee7b7', fontSize: 13 }}>
          ⏳ Redirecting to your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="wauth-body">
      {data.step === 1 && <Step1 data={data} setData={setData} onNext={next} />}
      {data.step === 2 && <Step2 data={data} setData={setData} onNext={next} onBack={back} />}
      {data.step === 3 && <Step3 data={data} setData={setData} onNext={next} onBack={back} />}
      {data.step === 4 && <Step4 data={data} setData={setData} onNext={next} onBack={back} />}
      {data.step === 5 && <Step5 data={data} setData={setData} onSubmit={submit} onBack={back} />}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function WorkerAuthPage({ onAuthenticated, mode = 'both', onBack }) {
  const [tab, setTab] = useState(mode === 'register-only' ? 'register' : 'login');

  return (
    <>
      <StyleOnce />
      <div className="wauth-wrap">
        <div className="wauth-card">
          {/* Brand */}
          <div className="wauth-brand">
            <div className="wauth-logo">L</div>
            <span className="wauth-logo-text">Labou<span>Rack</span></span>
            <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(16,185,129,.15)', color: '#34d399', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>
              Worker Portal
            </span>
          </div>

          {/* Tabs — hidden in register-only mode */}
          {mode !== 'register-only' && (
            <div className="wauth-tabs">
              <button className={`wauth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
                Sign In
              </button>
              <button className={`wauth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
                Register as Worker
              </button>
            </div>
          )}

          {/* Register-only header */}
          {mode === 'register-only' && (
            <div style={{ padding: '16px 32px 0', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
              {onBack && (
                <button
                  onClick={onBack}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontFamily: 'var(--font)', padding: 0 }}
                >
                  ← Back to Sign In
                </button>
              )}
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>WORKER ONBOARDING</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>Create your Gig Worker profile</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Complete all steps to unlock local job requests near you.</p>
            </div>
          )}

          {/* Step Progress */}
          {tab === 'register' && <RegProgress step={1} />}

          {/* Content */}
          {tab === 'login'
            ? <LoginView onLogin={onAuthenticated} />
            : <RegisterView onRegistered={onAuthenticated} />
          }
        </div>
      </div>
    </>
  );
}
