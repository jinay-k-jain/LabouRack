# LabouRack React frontend

A responsive React prototype for a local gig-work platform.

## Run locally

Run `npm install`, then `npm run dev`. Open the local URL Vite prints in the terminal.

## Structure

- `index.html` is the only HTML entry point.
- `src/App.jsx` contains all UI screens: sign in, OTP, registration, success, pending review, and role dashboards.
- `src/appLogic.js` contains shared frontend helpers and browser-session handling.
- `src/styles.css` contains the app styling.

All authentication, OTP, and verification interactions are mocked for this prototype.
