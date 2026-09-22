import { useRef, useState } from 'react';

export const SESSION_KEY = 'labourack-session';
export const WORKER_PENDING = 'pending';

export const availableLocations = [
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'HSR Layout, Bengaluru',
  'Whitefield, Bengaluru',
  'MG Road, Bengaluru',
  'Jayanagar, Bengaluru',
  'BTM Layout, Bengaluru',
  'Electronic City, Bengaluru',
];

export const workerSkills = [
  'Plumbing',
  'Electrical',
  'Appliance Repair',
  'Carpentry',
  'Cleaning',
  'Painting',
  'Locksmith',
  'Pest Control',
  'Delivery & Helper',
  'Other',
];

export const householdCategories = [
  {
    id: 'plumbing',
    icon: '💧',
    name: 'Water & Plumbing',
    description: 'Leaks, taps, drains, tanks & motors',
    workerLabel: 'Plumbers Near You',
    workerType: 'plumber',
    workerCopy: 'Find trusted & Aadhaar-verified plumbers near your location.',
    badge: 'Popular',
    issues: ['Leaking tap or pipe', 'Blocked drain', 'No water supply', 'Toilet repair', 'Water tank cleaning', 'Pump or motor repair'],
  },
  {
    id: 'electrical',
    icon: '⚡',
    name: 'Electricity & Wiring',
    description: 'Wiring, MCB fuses, lights & fans',
    workerLabel: 'Electricians Near You',
    workerType: 'electrician',
    workerCopy: 'Certified electricians for safe home & office electrical fixes.',
    badge: 'Urgent Help',
    issues: ['Power outage', 'Switch or socket repair', 'Fan installation or repair', 'Light fitting', 'MCB or fuse problem', 'Inverter wiring'],
  },
  {
    id: 'electronics',
    icon: '🔌',
    name: 'Appliance & Electronics',
    description: 'AC, Fridge, TV, Washing Machine & RO',
    workerLabel: 'Appliance Experts Near You',
    workerType: 'appliance expert',
    workerCopy: 'Get prompt diagnostic and repair service for home appliances.',
    badge: 'Top Rated',
    issues: ['Television repair', 'Refrigerator cooling issue', 'Washing machine repair', 'Microwave repair', 'AC service or repair', 'RO water purifier service'],
  },
  {
    id: 'carpentry',
    icon: '🪚',
    name: 'Carpentry & Fittings',
    description: 'Locks, doors, furniture & shelves',
    workerLabel: 'Carpenters Near You',
    workerType: 'carpenter',
    workerCopy: 'Skilled carpenters for custom woodwork, doors, and lock repairs.',
    badge: 'Quick Service',
    issues: ['Door or lock repair', 'Furniture repair', 'Curtain rod fitting', 'Cabinet or drawer repair', 'Bed assembly', 'Wall shelf installation'],
  },
  {
    id: 'cleaning',
    icon: '✨',
    name: 'Deep Cleaning & Care',
    description: 'Kitchen, bathroom, sofa & full home',
    workerLabel: 'Cleaning Experts Near You',
    workerType: 'cleaning expert',
    workerCopy: 'Trained professionals equipped with eco-friendly cleaning tools.',
    badge: 'High Demand',
    issues: ['Kitchen deep cleaning', 'Bathroom cleaning', 'Sofa cleaning', 'Full home deep cleaning', 'Water tank cleaning', 'Move-in cleaning'],
  },
  {
    id: 'painting',
    icon: '🎨',
    name: 'Painting & Touchups',
    description: 'Walls, cracks, tiles & fixtures',
    workerLabel: 'Home Repair Experts Near You',
    workerType: 'home repair expert',
    workerCopy: 'Neat and hassle-free painting and minor masonry touchups.',
    badge: 'Trending',
    issues: ['Wall painting', 'Wall crack repair', 'Bathroom fitting', 'Tile repair', 'Curtain or blind fitting', 'Minor home repairs'],
  },
  {
    id: 'locksmith',
    icon: '🔒',
    name: 'Locksmith & Safety',
    description: 'Door unlock, key duplication & latch repair',
    workerLabel: 'Locksmiths Near You',
    workerType: 'locksmith',
    workerCopy: 'Emergency lock opening and key fitting experts nearby.',
    badge: 'Emergency',
    issues: ['Emergency door unlock', 'Main lock replacement', 'Cabinet lock fitting', 'Digital lock installation'],
  },
  {
    id: 'delivery',
    icon: '🚚',
    name: 'Helper & Errands',
    description: 'Furniture moving, lifting & local errands',
    workerLabel: 'Local Helpers Near You',
    workerType: 'helper',
    workerCopy: 'Reliable local helpers for heavy lifting and quick tasks.',
    badge: 'Fast Match',
    issues: ['Heavy furniture lifting', 'Package pick & drop', 'Carton packing', 'Event setup helper'],
  },
];

export const popularHouseholdProblems = [
  { categoryId: 'plumbing', issue: 'Leaking tap or pipe', icon: '💧', label: 'Leaking Tap', description: 'Stop drips & pipe leaks', price: 199, estTime: '15 mins' },
  { categoryId: 'electrical', issue: 'Power outage', icon: '⚡', label: 'Power Cut / Fuse', description: 'Restore power safely', price: 249, estTime: '10 mins' },
  { categoryId: 'electronics', issue: 'AC service or repair', icon: '❄️', label: 'AC Servicing', description: 'Cooling & gas check', price: 499, estTime: '20 mins' },
  { categoryId: 'plumbing', issue: 'Blocked drain', icon: '🚿', label: 'Clogged Drain', description: 'Clear sinks & drain pipes', price: 299, estTime: '15 mins' },
  { categoryId: 'carpentry', issue: 'Door or lock repair', icon: '🔑', label: 'Door & Lock Fix', description: 'Locks, latches & hinges', price: 249, estTime: '15 mins' },
  { categoryId: 'cleaning', issue: 'Kitchen deep cleaning', icon: '✨', label: 'Kitchen Deep Clean', description: 'Degreasing & sanitize', price: 599, estTime: '30 mins' },
];

export const serviceCatalog = [
  // Refrigerator & Appliances
  {
    id: 's_fridge_repair',
    categoryId: 'electronics',
    keywords: ['refrigerator', 'fridge', 'cooling', 'fridge repair', 'refrigerator repair', 'freezer', 'ice'],
    name: 'Refrigerator Repair & Diagnostic',
    icon: '🧊',
    description: 'Comprehensive cooling diagnosis, compressor testing, defrosting issues, PCB and thermostat check.',
    price: 299,
    estTime: '15-20 mins response',
    badge: 'Popular',
    included: ['Multi-point safety & electrical check', 'Thermostat & coil health diagnostic', 'Upfront pricing before work'],
  },
  {
    id: 's_fridge_install',
    categoryId: 'electronics',
    keywords: ['refrigerator', 'fridge', 'installation', 'uninstallation', 'fridge install', 'setup'],
    name: 'Refrigerator Installation & Setup',
    icon: '📦',
    description: 'Safe unboxing, precision leveling, stabilizer connection, and initial cooling performance check.',
    price: 349,
    estTime: '20 mins response',
    badge: 'Verified Pro',
    included: ['Unboxing & floor leveling', 'Stabilizer & socket safety wiring', 'Operational demo & usage tips'],
  },
  {
    id: 's_fridge_gas',
    categoryId: 'electronics',
    keywords: ['refrigerator', 'fridge', 'gas', 'gas refilling', 'freon', 'compressor'],
    name: 'Gas Refilling & Leak Repair',
    icon: '⚙️',
    description: 'High-grade eco refrigerant gas top-up, leak detection, vacuuming, and pressure testing.',
    price: 899,
    estTime: '30 mins response',
    badge: 'Specialist',
    included: ['Nitrogen leak pressure testing', 'Moisture removal & vacuuming', 'Eco-friendly refrigerant refill'],
  },
  {
    id: 's_fridge_clean',
    categoryId: 'electronics',
    keywords: ['refrigerator', 'fridge', 'cleaning', 'clean', 'odor', 'sanitize'],
    name: 'Fridge Deep Sanitization & Cleaning',
    icon: '✨',
    description: 'Shelf removal & wash, antibacterial steam sanitization, food odor neutralizer & condenser dusting.',
    price: 399,
    estTime: '25 mins response',
    badge: 'Hygiene Guard',
    included: ['Removable tray & gasket wash', 'Odor neutralizer treatment', 'Back condenser coil dusting'],
  },

  // Plumbing / Water
  {
    id: 's_tap_repair',
    categoryId: 'plumbing',
    keywords: ['tap', 'pipe', 'leak', 'water', 'plumbing', 'faucet', 'dripping'],
    name: 'Tap & Pipe Leakage Repair',
    icon: '🚰',
    description: 'Fixing leaking taps, broken pipe joints, washer replacements, or brand new tap installation.',
    price: 199,
    estTime: '15 mins response',
    badge: 'Quick Fix',
    included: ['Washer & spindle replacement', 'Thread sealing & pressure test', 'Clean working area'],
  },
  {
    id: 's_drain_clear',
    categoryId: 'plumbing',
    keywords: ['drain', 'block', 'clog', 'sink', 'toilet', 'sewer', 'pipe block'],
    name: 'Sink & Drain Pipe Unclogging',
    icon: '🚿',
    description: 'High-pressure drain snake clearing for kitchen sinks, bathroom floor drains, and waste pipes.',
    price: 299,
    estTime: '20 mins response',
    badge: 'Instant Help',
    included: ['Blockage removal with drain auger', 'S-trap cleaning & flushing', 'Odour trap sealing'],
  },
  {
    id: 's_tank_motor',
    categoryId: 'plumbing',
    keywords: ['tank', 'water tank', 'motor', 'pump', 'water pump', 'sump'],
    name: 'Water Tank & Pump Motor Fix',
    icon: '💧',
    description: 'Water pump starter diagnostic, float valve repair, pressure pump tuning, and tank inspection.',
    price: 499,
    estTime: '30 mins response',
    badge: 'Essential',
    included: ['Motor capacitor & winding test', 'Float switch repair', 'Line pressure check'],
  },

  // Electrical
  {
    id: 's_switch_mcb',
    categoryId: 'electrical',
    keywords: ['switch', 'socket', 'mcb', 'fuse', 'power', 'spark', 'electrical', 'wiring'],
    name: 'Switchboard & MCB Fuse Repair',
    icon: '⚡',
    description: 'Replacing burnt switches, loose sockets, tripping MCB breakers, and fuse replacement.',
    price: 149,
    estTime: '10 mins response',
    badge: 'Safety First',
    included: ['Safety voltage test', 'Heavy-duty switch replacement', 'Panel tightening'],
  },
  {
    id: 's_fan_light',
    categoryId: 'electrical',
    keywords: ['fan', 'light', 'ceiling fan', 'led', 'lamp', 'chandelier', 'wiring'],
    name: 'Ceiling Fan & Light Installation',
    icon: '💡',
    description: 'Ceiling fan assembly & hanging, regulator fixing, LED panel lights, and decorative lighting.',
    price: 199,
    estTime: '15 mins response',
    badge: 'Popular',
    included: ['Fan rod & hook mounting', 'Regulator connection', 'Balancing & speed check'],
  },
  {
    id: 's_short_circuit',
    categoryId: 'electrical',
    keywords: ['power cut', 'short circuit', 'outage', 'wiring', 'inverter'],
    name: 'Short Circuit & Outage Diagnostic',
    icon: '🔌',
    description: 'Tracing hidden wire burns, short circuits, main DB box troubleshooting, and inverter line fix.',
    price: 299,
    estTime: '20 mins response',
    badge: 'Emergency Pro',
    included: ['Complete circuit line checking', 'Faulty line isolation', 'Emergency temporary power restore'],
  },

  // Carpentry
  {
    id: 's_door_lock',
    categoryId: 'carpentry',
    keywords: ['door', 'lock', 'latch', 'handle', 'hinge', 'carpenter', 'key'],
    name: 'Door & Lock Installation / Repair',
    icon: '🔑',
    description: 'Fixing jammed doors, replacing door locks, hinges alignment, handles, and latches.',
    price: 249,
    estTime: '15 mins response',
    badge: 'Security',
    included: ['Lock cylinder fitting', 'Hinge adjustment', 'Smooth closing alignment'],
  },
  {
    id: 's_furniture_fix',
    categoryId: 'carpentry',
    keywords: ['furniture', 'wood', 'table', 'chair', 'bed', 'cabinet', 'drawer', 'shelf'],
    name: 'Furniture Repair & Assembly',
    icon: '🪚',
    description: 'Assembly of flat-pack furniture, bed repair, drawer channel replacement, and cabinet touchups.',
    price: 349,
    estTime: '25 mins response',
    badge: 'Top Choice',
    included: ['Structural reinforcement', 'Channel sliding check', 'Hardware tightening'],
  },

  // Cleaning
  {
    id: 's_deep_clean',
    categoryId: 'cleaning',
    keywords: ['clean', 'cleaning', 'deep clean', 'kitchen', 'bathroom', 'sofa', 'housekeeping'],
    name: 'Kitchen & Bathroom Deep Cleaning',
    icon: '✨',
    description: 'Hard stain removal, grease degreasing, tile scrubbing, and germ sanitization.',
    price: 599,
    estTime: '45 mins response',
    badge: 'High Quality',
    included: ['Industrial degreaser treatment', 'Grout line scrubbing', 'Disinfection spray'],
  },

  // AC & Electronics
  {
    id: 's_ac_service',
    categoryId: 'electronics',
    keywords: ['ac', 'air conditioner', 'cooling', 'ac service', 'filter'],
    name: 'AC Foam Jet Servicing & Filter Clean',
    icon: '❄️',
    description: 'Indoor unit foam jet washing, outdoor unit coil flushing, filter washing & cooling check.',
    price: 499,
    estTime: '30 mins response',
    badge: 'Best Seller',
    included: ['High pressure jet washing', 'Gas pressure measurement', 'Drainage line clearance'],
  },
];

export const workerProfiles = [
  { id: 'w1', name: 'Rohit Kumar', age: 28, rating: 4.9, reviews: 142, distance: 0.8, time: 5, status: 'Available now', rate: 300, hue: 'orange', verified: true, completedJobs: 184, experience: '5 years', skills: ['Plumbing', 'Pipe Repair', 'Drainage'] },
  { id: 'w2', name: 'Suresh Yadav', age: 42, rating: 4.7, reviews: 108, distance: 1.4, time: 8, status: 'Available now', rate: 250, hue: 'blue', verified: true, completedJobs: 210, experience: '12 years', skills: ['Electrical', 'Wiring', 'Switch Repair'] },
  { id: 'w3', name: 'Amit Sharma', age: 31, rating: 4.9, reviews: 235, distance: 2.1, time: 12, status: 'Busy now', rate: 350, hue: 'mint', verified: true, completedJobs: 310, experience: '8 years', skills: ['AC Repair', 'Appliance Fix', 'Refrigeration'] },
  { id: 'w4', name: 'Imran Khan', age: 26, rating: 4.8, reviews: 89, distance: 2.8, time: 15, status: 'Available now', rate: 300, hue: 'gold', verified: true, completedJobs: 95, experience: '4 years', skills: ['Carpentry', 'Door Locks', 'Furniture'] },
  { id: 'w5', name: 'Mahesh Singh', age: 45, rating: 4.6, reviews: 74, distance: 3.4, time: 18, status: 'Busy now', rate: 280, hue: 'violet', verified: true, completedJobs: 130, experience: '15 years', skills: ['Wall Painting', 'Tile Repair', 'Waterproofing'] },
  { id: 'w6', name: 'Pooja Verma', age: 29, rating: 4.9, reviews: 160, distance: 1.1, time: 7, status: 'Available now', rate: 320, hue: 'mint', verified: true, completedJobs: 175, experience: '6 years', skills: ['Deep Cleaning', 'Sanitization', 'Housekeeping'] },
];

export function getMatchingWorkers(category, issue) {
  if (!category) return [];
  const relatedIssues = category.issues.filter(item => item !== issue);
  return workerProfiles.map((worker, index) => ({
    ...worker,
    skills: [issue, relatedIssues[index % relatedIssues.length], relatedIssues[(index + 2) % relatedIssues.length]],
  }));
}

export function loadSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function normalizePhone(value) {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function phoneIsValid(value) {
  return normalizePhone(value).length === 10;
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ME';
}

export function formatPhone(value) {
  return value ? '+91 ' + value.slice(0, 5) + ' ' + value.slice(5) : 'your mobile number';
}

export function emptyOtp() {
  return ['', '', '', '', '', ''];
}

export function otpIsComplete(otp) {
  return otp.every(digit => digit);
}

function emptyCustomerRegistration() {
  return { step: 1, name: '', phone: '', otpSent: false };
}

function emptyWorkerRegistration() {
  return {
    step: 1,
    name: '',
    phone: '',
    otpSent: false,
    aadhaar: '',
    aadhaarOtp: '',
    aadhaarVerified: false,
    skills: [],
    experience: '',
    consented: false,
  };
}

function getDashboardContent(role, searchTitle) {
  return {
    heading: role === 'worker'
      ? 'Your next opportunity is waiting.'
      : role === 'admin'
        ? 'Platform at a glance.'
        : searchTitle
          ? 'Help for “' + searchTitle + '”'
          : 'Find trusted help nearby.',
    copy: role === 'worker'
      ? 'Discover local work that matches your skills and availability.'
      : role === 'admin'
        ? 'Review new profiles and keep your local network thriving.'
        : searchTitle
          ? 'We’ll match you with trusted local professionals for this task.'
          : 'Search for a service or browse recommendations for your next task.',
    taskTitle: role === 'worker'
      ? 'Jobs matching your skills'
      : role === 'admin'
        ? '12 profiles are ready for review'
        : searchTitle
          ? 'Top matches for ' + searchTitle
          : 'Home & repairs',
    taskText: role === 'worker'
      ? 'See verified requests close to your current location.'
      : role === 'admin'
        ? 'Open the verification queue to continue.'
        : searchTitle
          ? 'Verified workers near your current location.'
          : 'Find skilled local professionals.',
  };
}

/**
 * Application controller. It keeps all state transitions, validation, and
 * interaction behaviour out of the React view file so App.jsx stays focused
 * on rendering the interface.
 */
export function useLabouRackApp() {
  const [page, setPage] = useState('login');
  const [role, setRole] = useState('customer');
  const [session, setSession] = useState(loadSession);
  const [phone, setPhone] = useState('');
  const [admin, setAdmin] = useState({ id: '', password: '' });
  const [otp, setOtp] = useState(emptyOtp);
  const [toast, setToast] = useState('');
  const [customerRegistration, setCustomerRegistration] = useState(emptyCustomerRegistration);
  const [workerRegistration, setWorkerRegistration] = useState(emptyWorkerRegistration);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [homeRepair, setHomeRepair] = useState({ view: 'home', category: null, issue: '', filter: 'all', serviceFilter: 'all', serviceSort: 'relevance', hasMatches: true });
  const [selectedLocation, setSelectedLocation] = useState('Indiranagar, Bengaluru');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState({
    open: false,
    step: 'payment',
    worker: null,
    issue: '',
    category: null,
    visitingFee: 99,
    safetyFee: 20,
    discount: 50,
    paymentMethod: 'upi',
    autoAssigned: false,
  });
  const [savedWorkers, setSavedWorkers] = useState(['Rohit Kumar']);
  const [activeBookings, setActiveBookings] = useState([
    {
      id: 'b-101',
      workerName: 'Rohit Kumar',
      issue: 'Leaking Tap Fix',
      categoryIcon: '💧',
      status: 'En route',
      eta: '7 mins away',
      rate: 300,
      timestamp: 'Just now',
    },
  ]);
  const [bookingModal, setBookingModal] = useState({
    open: false,
    worker: null,
    issue: '',
    category: null,
    date: 'Today, ASAP',
    timeSlot: 'Immediate (within 15 mins)',
    address: 'Indiranagar, Bengaluru',
    note: '',
  });

  const toastTimer = useRef();
  const otpRefs = useRef([]);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2800);
  }

  function updateSession(values) {
    const next = { ...session, ...values };
    setSession(next);
    saveSession(next);
  }

  function toggleSaveWorker(workerName) {
    setSavedWorkers(prev => {
      const exists = prev.includes(workerName);
      if (exists) {
        showToast('Removed ' + workerName + ' from favorites.');
        return prev.filter(name => name !== workerName);
      } else {
        showToast('Saved ' + workerName + ' to favorites!');
        return [...prev, workerName];
      }
    });
  }

  function openLocationModal() {
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    setLocationModalOpen(false);
  }

  function selectLocation(loc) {
    setSelectedLocation(loc);
    updateSession({ location: loc });
    setLocationModalOpen(false);
    showToast('Location updated to ' + loc);
  }

  function openBookingModal(worker, issue = '', category = null) {
    setBookingModal({
      open: true,
      worker,
      issue: issue || (category ? category.issues[0] : 'General Service'),
      category: category || homeRepair.category,
      date: 'Today, ASAP',
      timeSlot: 'Immediate (within 15 mins)',
      address: selectedLocation,
      note: '',
    });
  }

  function closeBookingModal() {
    setBookingModal(prev => ({ ...prev, open: false }));
  }

  function confirmBooking(event) {
    if (event) event.preventDefault();
    if (!bookingModal.worker) return;
    const assignedWorker = bookingModal.worker;
    const taskIssue = bookingModal.issue || 'Home Service';
    const taskCat = bookingModal.category || homeRepair.category;
    
    setBookingModal(prev => ({ ...prev, open: false }));
    setPaymentModal({
      open: true,
      step: 'payment',
      worker: assignedWorker,
      issue: taskIssue,
      category: taskCat,
      visitingFee: 99,
      safetyFee: 20,
      discount: 50,
      paymentMethod: 'upi',
      autoAssigned: false,
    });
  }

  function expressAutoAssign(item) {
    const issueName = typeof item === 'string' ? item : (item && (item.name || item.issue) ? (item.name || item.issue) : 'Home Service');
    const cat = (item && item.categoryId) ? householdCategories.find(c => c.id === item.categoryId) : (homeRepair.category || householdCategories[0]);
    
    const matchedWorkers = getMatchingWorkers(cat, issueName);
    const autoWorker = (matchedWorkers.length > 0) ? matchedWorkers[0] : (workerProfiles[0] || { name: 'Rohit Kumar', rate: 300, distance: 0.8, time: 5, hue: 'orange', rating: 4.9, reviews: 142 });
    
    setPaymentModal({
      open: true,
      step: 'payment',
      worker: autoWorker,
      issue: issueName,
      category: cat,
      visitingFee: 99,
      safetyFee: 20,
      discount: 50,
      paymentMethod: 'upi',
      autoAssigned: true,
    });
  }

  function confirmPaymentAndDispatch(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (!paymentModal.worker) return;

    setPaymentModal(prev => ({ ...prev, step: 'assigning' }));

    setTimeout(() => {
      const assignedWorker = paymentModal.worker;
      const newBooking = {
        id: 'b-' + Math.floor(1000 + Math.random() * 9000),
        workerName: assignedWorker.name,
        issue: paymentModal.issue || 'Household Service',
        categoryIcon: paymentModal.category ? paymentModal.category.icon : '✦',
        status: 'En route',
        eta: (assignedWorker.time || 5) + ' mins away',
        rate: assignedWorker.rate || 300,
        timestamp: 'Just now',
      };
      
      setActiveBookings(prev => [newBooking, ...prev]);
      setPaymentModal(prev => ({ ...prev, step: 'success' }));
      showToast('⚡ Visiting Fee Paid (₹69)! ' + assignedWorker.name + ' auto-dispatched (ETA ' + (assignedWorker.time || 5) + ' mins).');

      setTimeout(() => {
        setPaymentModal(prev => ({ ...prev, open: false }));
        setHomeRepair(prev => ({ ...prev, view: 'home' }));
      }, 2000);
    }, 1500);
  }

  function closePaymentModal() {
    setPaymentModal(prev => ({ ...prev, open: false }));
  }

  function setPaymentMethod(method) {
    setPaymentModal(prev => ({ ...prev, paymentMethod: method }));
  }

  function cancelBooking(bookingId) {
    setActiveBookings(prev => prev.filter(b => b.id !== bookingId));
    showToast('Booking cancelled successfully.');
  }

  function setOtpInputRef(index, node) {
    otpRefs.current[index] = node;
  }

  function setOtpDigit(index, value) {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && otpRefs.current[index + 1]) otpRefs.current[index + 1].focus();
  }

  function pasteOtp(event) {
    event.preventDefault();
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    setOtp([...digits, ...emptyOtp()].slice(0, 6));
    const lastIndex = Math.min(digits.length, 5);
    if (otpRefs.current[lastIndex]) otpRefs.current[lastIndex].focus();
  }

  function focusPreviousOtp(index, isEmpty) {
    if (isEmpty && otpRefs.current[index - 1]) otpRefs.current[index - 1].focus();
  }

  function login(event) {
    event.preventDefault();
    if (role === 'admin') {
      if (!admin.id.trim() || !admin.password) return showToast('Enter your admin ID and password to continue.');
      updateSession({ role: 'admin', name: 'LabouRack administrator' });
      return setPage('dashboard');
    }
    if (!phoneIsValid(phone)) return showToast('Please enter a valid 10-digit mobile number.');
    updateSession({ role, phone });
    setOtp(emptyOtp());
    setPage('otp');
  }

  function startRegistration() {
    setOtp(emptyOtp());
    if (role === 'worker') {
      setWorkerRegistration(emptyWorkerRegistration());
      setPage('worker-registration');
    } else {
      setCustomerRegistration(emptyCustomerRegistration());
      setPage('customer-registration');
    }
  }

  function verifyLoginOtp(event) {
    event.preventDefault();
    if (!otpIsComplete(otp)) return showToast('Enter the complete 6-digit OTP.');
    if (role === 'worker' && session.workerVerification === WORKER_PENDING) return setPage('worker-pending');
    setPage('dashboard');
  }

  function updateCustomerRegistration(values) {
    setCustomerRegistration(current => ({ ...current, ...values }));
  }

  function setCustomerName(name) {
    updateCustomerRegistration({ name });
  }

  function setCustomerPhone(value) {
    updateCustomerRegistration({ phone: normalizePhone(value), otpSent: false });
  }

  function sendCustomerOtp() {
    if (!phoneIsValid(customerRegistration.phone)) return showToast('Enter a valid 10-digit mobile number first.');
    updateCustomerRegistration({ otpSent: true });
    setOtp(emptyOtp());
    showToast('OTP sent to your mobile number.');
  }

  function submitCustomerRegistration(event) {
    event.preventDefault();
    if (customerRegistration.step === 1) {
      if (!customerRegistration.name.trim()) return showToast('Please enter your full name.');
      if (!phoneIsValid(customerRegistration.phone)) return showToast('Enter a valid 10-digit mobile number.');
      if (!customerRegistration.otpSent) return showToast('Send an OTP to verify your mobile number.');
      return updateCustomerRegistration({ step: 2 });
    }
    if (!otpIsComplete(otp)) return showToast('Enter the complete 6-digit OTP.');
    updateSession({ role: 'customer', name: customerRegistration.name.trim(), phone: customerRegistration.phone, location: selectedLocation, workerVerification: null });
    setRole('customer');
    setPage('success');
  }

  function updateWorkerRegistration(values) {
    setWorkerRegistration(current => ({ ...current, ...values }));
  }

  function setWorkerName(name) {
    updateWorkerRegistration({ name });
  }

  function setWorkerPhone(value) {
    updateWorkerRegistration({ phone: normalizePhone(value), otpSent: false });
  }

  function setWorkerAadhaar(value) {
    updateWorkerRegistration({ aadhaar: value.replace(/\D/g, '').slice(0, 12), aadhaarVerified: false });
  }

  function setWorkerAadhaarOtp(value) {
    updateWorkerRegistration({ aadhaarOtp: value.replace(/\D/g, '').slice(0, 6) });
  }

  function setWorkerExperience(experience) {
    updateWorkerRegistration({ experience });
  }

  function setWorkerConsent(consented) {
    updateWorkerRegistration({ consented });
  }

  function sendWorkerOtp() {
    if (!phoneIsValid(workerRegistration.phone)) return showToast('Enter a valid 10-digit mobile number first.');
    updateWorkerRegistration({ otpSent: true });
    setOtp(emptyOtp());
    showToast('OTP sent to your mobile number.');
  }

  function verifyAadhaar() {
    if (workerRegistration.aadhaar.length !== 12) return showToast('Enter a valid 12-digit Aadhaar number first.');
    updateWorkerRegistration({ aadhaarVerified: true });
    showToast('Aadhaar number verified.');
  }

  function toggleWorkerSkill(skill) {
    const skills = workerRegistration.skills.includes(skill)
      ? workerRegistration.skills.filter(item => item !== skill)
      : [...workerRegistration.skills, skill];
    updateWorkerRegistration({ skills });
  }

  function submitWorkerRegistration(event) {
    event.preventDefault();
    if (workerRegistration.step === 1) {
      if (!workerRegistration.name.trim()) return showToast('Please enter your full name.');
      if (!phoneIsValid(workerRegistration.phone)) return showToast('Enter a valid 10-digit mobile number.');
      if (!workerRegistration.otpSent) return showToast('Send an OTP to verify your mobile number.');
      return updateWorkerRegistration({ step: 2 });
    }
    if (workerRegistration.step === 2) {
      if (!otpIsComplete(otp)) return showToast('Enter the complete 6-digit OTP.');
      return updateWorkerRegistration({ step: 3 });
    }
    if (workerRegistration.step === 3) {
      if (!workerRegistration.aadhaarVerified) return showToast('Verify your Aadhaar number to continue.');
      if (workerRegistration.aadhaarOtp.length !== 6) return showToast('Enter the 6-digit Aadhaar verification code.');
      return updateWorkerRegistration({ step: 4 });
    }
    if (!workerRegistration.skills.length) return showToast('Choose at least one skill.');
    if (!workerRegistration.experience.trim()) return showToast('Tell us a little about your experience.');
    if (!workerRegistration.consented) return showToast('Please confirm your information to submit your profile.');
    updateSession({ role: 'worker', name: workerRegistration.name.trim(), phone: workerRegistration.phone, location: selectedLocation, skills: workerRegistration.skills, experience: workerRegistration.experience.trim(), workerVerification: WORKER_PENDING });
    setRole('worker');
    setPage('worker-pending');
  }

  function searchDashboard(event, queryOverride) {
    if (event && event.preventDefault) event.preventDefault();
    const activeQuery = (typeof queryOverride === 'string' ? queryOverride : searchQuery).trim();
    if (!activeQuery) return showToast('Tell us what you need help with.');
    
    if (typeof queryOverride === 'string') {
      setSearchQuery(queryOverride);
    }
    
    const term = activeQuery.toLowerCase();
    setSearchTitle(activeQuery);

    // 1. Find matching services in serviceCatalog
    const matchedServices = serviceCatalog.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      (s.keywords && s.keywords.some(k => k.toLowerCase().includes(term)))
    );

    // 2. Find matching category
    let matchedCategory = householdCategories.find(c => 
      c.name.toLowerCase().includes(term) || 
      c.description.toLowerCase().includes(term) ||
      c.issues.some(i => i.toLowerCase().includes(term))
    );

    if (!matchedCategory && matchedServices.length > 0) {
      matchedCategory = householdCategories.find(c => c.id === matchedServices[0].categoryId);
    }

    const hasMatches = (matchedServices.length > 0) || Boolean(matchedCategory);

    if (!matchedCategory) {
      matchedCategory = householdCategories.find(c => c.id === 'electronics') || householdCategories[0];
    }

    // Prepare display services
    const displayServices = matchedServices.length > 0
      ? matchedServices
      : matchedCategory.issues.map((issueName, idx) => ({
          id: 'gen_' + idx,
          categoryId: matchedCategory.id,
          name: issueName,
          icon: matchedCategory.icon,
          description: `Professional ${issueName.toLowerCase()} by Aadhaar-verified local experts.`,
          price: 249 + (idx * 50),
          estTime: '15 mins response',
          badge: idx === 0 ? 'Popular Choice' : 'Verified Pro',
          included: ['Multi-point diagnostic & safety check', 'Transparent rate before work', '30-day service warranty']
        }));

    setHomeRepair({
      view: 'services',
      category: matchedCategory,
      query: activeQuery,
      services: displayServices,
      issue: '',
      filter: 'all',
      serviceFilter: 'all',
      serviceSort: 'relevance',
      hasMatches,
    });
  }

  function searchByQuery(queryStr) {
    searchDashboard(null, queryStr);
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchTitle('');
    setHomeRepair(current => ({
      ...current,
      query: '',
      serviceFilter: 'all',
      serviceSort: 'relevance',
    }));
  }

  function openHomeRepair() {
    setHomeRepair({ view: 'categories', category: null, query: '', services: [], issue: '', filter: 'all' });
  }

  function chooseHouseholdCategory(category) {
    const catServices = serviceCatalog.filter(s => s.categoryId === category.id);
    const displayServices = catServices.length > 0
      ? catServices
      : category.issues.map((issueName, idx) => ({
          id: 'cat_' + idx,
          categoryId: category.id,
          name: issueName,
          icon: category.icon,
          description: `Professional ${issueName.toLowerCase()} by Aadhaar-verified local experts.`,
          price: 249 + (idx * 50),
          estTime: '15 mins response',
          badge: idx === 0 ? 'Popular Choice' : 'Verified Pro',
          included: ['Multi-point diagnostic & safety check', 'Transparent rate before work', '30-day service warranty']
        }));

    setHomeRepair({
      view: 'services',
      category,
      query: category.name,
      services: displayServices,
      issue: '',
      filter: 'all',
    });
  }

  function chooseHouseholdIssue(issue) {
    setHomeRepair(current => ({ ...current, view: 'workers', issue }));
  }

  function chooseService(service) {
    const category = householdCategories.find(c => c.id === service.categoryId) || homeRepair.category || householdCategories[0];
    setHomeRepair(current => ({
      ...current,
      view: 'workers',
      category,
      issue: service.name,
      selectedService: service,
      filter: 'all',
    }));
  }

  function openPopularProblem(categoryId, issue) {
    const category = householdCategories.find(item => item.id === categoryId);
    const service = serviceCatalog.find(s => s.categoryId === categoryId && s.name.toLowerCase().includes(issue.toLowerCase()));
    if (service) {
      chooseService(service);
    } else {
      if (category) setHomeRepair({ view: 'workers', category, issue, filter: 'all' });
    }
  }

  function goBackInHomeRepair() {
    setHomeRepair(current => {
      if (current.view === 'workers') {
        return {
          ...current,
          view: current.services && current.services.length ? 'services' : 'categories',
          issue: '',
          filter: 'all'
        };
      }
      if (current.view === 'services') return { ...current, view: 'categories', category: null, query: '', services: [], issue: '', filter: 'all' };
      if (current.view === 'issues') return { ...current, view: 'categories', category: null, issue: '', filter: 'all' };
      return { view: 'home', category: null, query: '', services: [], issue: '', filter: 'all' };
    });
  }

  function closeHomeRepair() {
    setHomeRepair({ view: 'home', category: null, issue: '', filter: 'all' });
  }

  function setWorkerFilter(filter) {
    setHomeRepair(current => ({ ...current, filter }));
  }

  function setServiceFilter(serviceFilter) {
    setHomeRepair(current => ({ ...current, serviceFilter }));
  }

  function setServiceSort(serviceSort) {
    setHomeRepair(current => ({ ...current, serviceSort }));
  }

  function bookWorker(worker) {
    openBookingModal(worker, homeRepair.issue || 'Home Service', homeRepair.category);
  }

  function notifyWorker(worker) {
    showToast('We’ll notify you as soon as ' + worker.name + ' becomes available!');
  }

  const matchingWorkers = getMatchingWorkers(homeRepair.category, homeRepair.issue).filter(worker => {
    if (homeRepair.filter === 'nearby') return worker.distance <= 3;
    if (homeRepair.filter === 'rated') return worker.rating >= 4.8;
    if (homeRepair.filter === 'available') return worker.status === 'Available now';
    return true;
  });

  return {
    state: {
      page,
      role,
      session,
      phone,
      admin,
      otp,
      toast,
      customerRegistration,
      workerRegistration,
      profileOpen,
      searchQuery,
      selectedLocation,
      locationModalOpen,
      savedWorkers,
      activeBookings,
      bookingModal,
      paymentModal,
      availableLocations,
      workerProfiles,
      dashboard: getDashboardContent(role, searchTitle),
      homeRepair: { ...homeRepair, workers: matchingWorkers },
    },
    actions: {
      setRole,
      setPhone: value => setPhone(normalizePhone(value)),
      setAdminId: id => setAdmin(current => ({ ...current, id })),
      setAdminPassword: password => setAdmin(current => ({ ...current, password })),
      setOtp,
      setOtpInputRef,
      setOtpDigit,
      pasteOtp,
      focusPreviousOtp,
      login,
      startRegistration,
      verifyLoginOtp,
      resendOtp: () => showToast('A fresh code is on its way.'),
      showToast,
      goToLogin: () => setPage('login'),
      updateCustomerRegistration,
      setCustomerName,
      setCustomerPhone,
      sendCustomerOtp,
      submitCustomerRegistration,
      backCustomerRegistration: () => updateCustomerRegistration({ step: 1 }),
      updateWorkerRegistration,
      setWorkerName,
      setWorkerPhone,
      setWorkerAadhaar,
      setWorkerAadhaarOtp,
      setWorkerExperience,
      setWorkerConsent,
      sendWorkerOtp,
      verifyAadhaar,
      toggleWorkerSkill,
      submitWorkerRegistration,
      backWorkerRegistration: () => updateWorkerRegistration({ step: workerRegistration.step - 1 }),
      continueToDashboard: () => setPage('dashboard'),
      toggleProfile: () => setProfileOpen(open => !open),
      signOut: () => {
        setProfileOpen(false);
        setPage('login');
      },
      setSearchQuery,
      searchDashboard,
      searchByQuery,
      clearSearch,
      setServiceFilter,
      setServiceSort,
      openHomeRepair,
      chooseHouseholdCategory,
      chooseHouseholdIssue,
      chooseService,
      openPopularProblem,
      goBackInHomeRepair,
      closeHomeRepair,
      setWorkerFilter,
      bookWorker,
      notifyWorker,
      openLocationModal,
      closeLocationModal,
      selectLocation,
      toggleSaveWorker,
      openBookingModal,
      closeBookingModal,
      confirmBooking,
      expressAutoAssign,
      confirmPaymentAndDispatch,
      closePaymentModal,
      setPaymentMethod,
      cancelBooking,
      setBookingModalField: (field, val) => setBookingModal(prev => ({ ...prev, [field]: val })),
    },
  };
}

