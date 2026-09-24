import React, { useState } from 'react';

// ─── Service category definitions ───────────────────────────────────────────
export const SERVICE_CATEGORIES = [
  {
    id: 'plumbing',
    icon: '🔧',
    label: 'Plumbing',
    color: '#3b82f6',
    skills: ['Pipe Repair', 'Leakage Fix', 'Tap Replacement', 'Drainage Cleaning', 'Water Pump', 'Geyser Install'],
  },
  {
    id: 'electrical',
    icon: '⚡',
    label: 'Electrical',
    color: '#f59e0b',
    skills: ['Fan Repair', 'Wiring', 'Switchboard', 'MCB/Fuse', 'Light Install', 'AC Wiring'],
  },
  {
    id: 'appliance',
    icon: '🖥️',
    label: 'Appliance Repair',
    color: '#8b5cf6',
    skills: ['Fridge Repair', 'Washing Machine', 'AC Servicing', 'Microwave', 'TV Repair', 'Water Purifier'],
  },
  {
    id: 'carpentry',
    icon: '🪚',
    label: 'Carpentry',
    color: '#d97706',
    skills: ['Door Repair', 'Furniture Fix', 'Cabinet Install', 'Window Frames', 'Wood Polishing'],
  },
  {
    id: 'painting',
    icon: '🎨',
    label: 'Painting',
    color: '#ec4899',
    skills: ['Wall Painting', 'Wood Painting', 'Waterproofing', 'Texture Finish', 'Putty Work'],
  },
  {
    id: 'cleaning',
    icon: '✨',
    label: 'Deep Cleaning',
    color: '#10b981',
    skills: ['Kitchen Deep Clean', 'Bathroom Sanitize', 'Sofa Cleaning', 'Tank Cleaning', 'Office Cleaning'],
  },
  {
    id: 'pest',
    icon: '🐛',
    label: 'Pest Control',
    color: '#6b7280',
    skills: ['Cockroach Control', 'Termite Treatment', 'Bed Bug', 'Rat Control', 'Mosquito Spray'],
  },
  {
    id: 'masonry',
    icon: '🧱',
    label: 'Masonry / Civil',
    color: '#92400e',
    skills: ['Wall Crack Fix', 'Tile Laying', 'Waterproofing', 'Plastering', 'Grout Repair'],
  },
];

// ─── Experience levels ───────────────────────────────────────────────────────
export const EXPERIENCE_LEVELS = [
  { value: '0-1', label: 'Fresher (0–1 year)' },
  { value: '1-3', label: 'Junior (1–3 years)' },
  { value: '3-5', label: 'Experienced (3–5 years)' },
  { value: '5-10', label: 'Senior (5–10 years)' },
  { value: '10+', label: 'Expert (10+ years)' },
];

// ─── Indian states ───────────────────────────────────────────────────────────
export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

// ─── Initial registration state ──────────────────────────────────────────────
export const INITIAL_REG_STATE = {
  step: 1,
  // Step 1 – Personal
  name: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  // Step 2 – Address
  houseNo: '',
  street: '',
  landmark: '',
  locality: '',
  city: '',
  pincode: '',
  state: '',
  // Step 3 – Aadhaar KYC
  aadhaar: '',
  aadhaarName: '',
  aadhaarOtp: '',
  aadhaarVerified: false,
  panCard: '',
  // Step 4 – Service & Experience
  selectedCategories: [],
  selectedSkills: [],
  experienceLevel: '',
  experienceDesc: '',
  languages: [],
  availableFrom: '08:00',
  availableTo: '20:00',
  // Step 5 – Consent
  photoId: '',
  consented: false,
  backgroundCheck: false,
};

// ─── Dummy job requests ──────────────────────────────────────────────────────
export const DUMMY_JOB_REQUESTS = [
  {
    id: 'job-001',
    category: 'electrical',
    categoryIcon: '⚡',
    issue: 'Ceiling Fan Not Working',
    description: 'Fan running slow and making noise, might need condenser or bearing replacement.',
    customer: 'Priya Sharma',
    customerRating: 4.7,
    address: '12th Cross, Indiranagar, Bengaluru - 560038',
    distance: 0.8,
    eta: '~7 mins',
    postedAgo: '3 mins ago',
    urgency: 'urgent',
    estimatedPay: 350,
    status: 'pending',
    materials: [
      { name: 'Capacitor / Condenser (2.5µF)', required: true, price: 80 },
      { name: 'Fan Bearing Set', required: false, price: 120 },
      { name: 'Fan Regulator', required: false, price: 200 },
      { name: 'Blade Set', required: false, price: 250 },
    ],
  },
  {
    id: 'job-002',
    category: 'plumbing',
    categoryIcon: '🔧',
    issue: 'Kitchen Sink Leaking Pipe',
    description: 'Water dripping from under-sink pipe joint. May need pipe replacement or sealant.',
    customer: 'Rohit Verma',
    customerRating: 4.5,
    address: '4th Block, Koramangala, Bengaluru - 560034',
    distance: 2.1,
    eta: '~18 mins',
    postedAgo: '12 mins ago',
    urgency: 'normal',
    estimatedPay: 280,
    status: 'pending',
    materials: [
      { name: 'PVC Pipe (1/2 inch, 1 meter)', required: true, price: 60 },
      { name: 'Pipe Sealant / Thread Tape', required: true, price: 30 },
      { name: 'Elbow Joint Connector', required: false, price: 40 },
      { name: 'Wrench Set (carry own)', required: false, price: 0 },
    ],
  },
  {
    id: 'job-003',
    category: 'appliance',
    categoryIcon: '🖥️',
    issue: 'Refrigerator Not Cooling',
    description: 'Fridge compressor making noise but not cooling. May need gas refill or thermostat.',
    customer: 'Aarti Nair',
    customerRating: 4.9,
    address: 'HSR Layout Sector 4, Bengaluru - 560102',
    distance: 3.4,
    eta: '~25 mins',
    postedAgo: '28 mins ago',
    urgency: 'normal',
    estimatedPay: 600,
    status: 'pending',
    materials: [
      { name: 'Refrigerant Gas (R600a / R134a)', required: true, price: 450 },
      { name: 'Thermostat Sensor', required: false, price: 180 },
      { name: 'Start Relay Capacitor', required: false, price: 120 },
      { name: 'Compressor Oil', required: false, price: 80 },
    ],
  },
];
