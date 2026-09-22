import type { HouseholdCategory, PopularProblem, WorkerProfile } from '../types';

export const workerSkills = ['Home repairs', 'Delivery', 'Cleaning', 'Beauty & care', 'Driving', 'Tutoring', 'Photography', 'Other'];

export const householdCategories: HouseholdCategory[] = [
  { id: 'plumbing', icon: '💧', name: 'Water & plumbing', description: 'Leaks, taps, drains and water supply', workerLabel: 'Plumbers Near You', workerType: 'plumber', workerCopy: 'Find trusted plumbers for your home.', issues: ['Leaking tap or pipe', 'Blocked drain', 'No water supply', 'Toilet repair', 'Water tank cleaning', 'Pump or motor repair'] },
  { id: 'electrical', icon: '⚡', name: 'Electricity', description: 'Wiring, switches, lights and power', workerLabel: 'Electricians Near You', workerType: 'electrician', workerCopy: 'Find trusted electricians for your home or office.', issues: ['Power outage', 'Switch or socket repair', 'Fan installation or repair', 'Light fitting', 'MCB or fuse problem', 'Inverter wiring'] },
  { id: 'electronics', icon: '🔌', name: 'Electronics', description: 'TV, fridge, washing machine and more', workerLabel: 'Appliance Experts Near You', workerType: 'appliance expert', workerCopy: 'Get reliable help for your household appliances.', issues: ['Television repair', 'Refrigerator cooling issue', 'Washing machine repair', 'Microwave repair', 'AC service or repair', 'RO water purifier service'] },
  { id: 'carpentry', icon: '🪚', name: 'Carpentry', description: 'Doors, furniture, locks and fittings', workerLabel: 'Carpenters Near You', workerType: 'carpenter', workerCopy: 'Find skilled carpenters for repairs and fittings.', issues: ['Door or lock repair', 'Furniture repair', 'Curtain rod fitting', 'Cabinet or drawer repair', 'Bed assembly', 'Wall shelf installation'] },
  { id: 'cleaning', icon: '✨', name: 'Cleaning', description: 'Deep cleaning and regular home care', workerLabel: 'Home Cleaning Experts Near You', workerType: 'cleaning expert', workerCopy: 'Book experienced professionals for a clean home.', issues: ['Kitchen deep cleaning', 'Bathroom cleaning', 'Sofa cleaning', 'Full home deep cleaning', 'Water tank cleaning', 'Move-in cleaning'] },
  { id: 'painting', icon: '🎨', name: 'Painting & fixtures', description: 'Walls, fittings and small home upgrades', workerLabel: 'Home Repair Experts Near You', workerType: 'home repair expert', workerCopy: 'Find professionals for painting and home fixes.', issues: ['Wall painting', 'Wall crack repair', 'Bathroom fitting', 'Tile repair', 'Curtain or blind fitting', 'Minor home repairs'] },
];

export const popularHouseholdProblems: PopularProblem[] = [
  { categoryId: 'plumbing', issue: 'Leaking tap or pipe', icon: '💧', label: 'Leaking tap', description: 'Stop drips and pipe leaks' },
  { categoryId: 'electrical', issue: 'Power outage', icon: '⚡', label: 'Power outage', description: 'Restore power safely' },
  { categoryId: 'electronics', issue: 'AC service or repair', icon: '❄️', label: 'AC service', description: 'Cooling and servicing help' },
  { categoryId: 'plumbing', issue: 'Blocked drain', icon: '🚿', label: 'Blocked drain', description: 'Clear sinks and drains' },
];

const workerProfiles: Omit<WorkerProfile, 'skills'>[] = [
  { name: 'Rohit Kumar', age: 28, rating: 4.8, reviews: 124, distance: 1.2, time: 5, status: 'Available now', rate: 300, hue: 'orange' },
  { name: 'Suresh Yadav', age: 42, rating: 4.6, reviews: 98, distance: 2.5, time: 10, status: 'Available now', rate: 250, hue: 'blue' },
  { name: 'Amit Sharma', age: 31, rating: 4.9, reviews: 210, distance: 3.8, time: 15, status: 'Busy now', rate: 350, hue: 'mint' },
  { name: 'Imran Khan', age: 26, rating: 4.7, reviews: 76, distance: 4.1, time: 18, status: 'Available now', rate: 300, hue: 'gold' },
  { name: 'Mahesh Singh', age: 45, rating: 4.5, reviews: 62, distance: 4.8, time: 20, status: 'Busy now', rate: 280, hue: 'violet' },
];

export function getMatchingWorkers(category: HouseholdCategory | null, issue: string): WorkerProfile[] {
  if (!category) return [];
  const relatedIssues = category.issues.filter(item => item !== issue);
  return workerProfiles.map((worker, index) => ({ ...worker, skills: [issue, relatedIssues[index % relatedIssues.length], relatedIssues[(index + 2) % relatedIssues.length]] }));
}
