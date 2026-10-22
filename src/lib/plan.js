import { addDays } from "./calc.js";

export const uid = () => Math.random().toString(36).slice(2, 10);
export const EVENT_TYPES = ["Fundraiser", "Workshop", "Social", "Conference", "Charity Run"];

// [title, category, days before the event (negative = after)]
const COMMON = [
  ["Confirm date, venue and booking", "Planning", 35],
  ["Set budget and approval limits", "Planning", 35],
  ["Assign roles to committee and volunteers", "People", 28],
  ["Create promotion materials", "Promotion", 21],
  ["Open registration or ticketing", "Promotion", 21],
  ["Send invitations and reminders", "Promotion", 7],
  ["Complete risk assessment and safety checks", "Logistics", 7],
  ["Hold final volunteer briefing", "People", 2],
  ["Set up venue and welcome desk", "Event day", 0],
  ["Collect feedback and attendance data", "Follow-up", -1],
  ["Thank volunteers, partners and attendees", "Follow-up", -2],
  ["Complete event report", "Follow-up", -5],
];
const EXTRA = {
  Fundraiser: { tasks: [["Secure sponsors or donated prizes", "Planning", 28], ["Set up donation and payment collection", "Logistics", 14], ["Send donor thank-you messages", "Follow-up", -2]], res: ["Donation collection method", "Sponsor and donor list", "Auction or raffle items"] },
  Workshop: { tasks: [["Prepare slides and exercises", "Planning", 14], ["Book equipment and Wi-Fi access", "Logistics", 10], ["Test demos on venue equipment", "Logistics", 1]], res: ["Projector or screen", "Laptops or lab access", "Printed handouts"] },
  Social: { tasks: [["Arrange food, drinks and dietary options", "Logistics", 10], ["Agree entertainment or activities", "Planning", 14], ["Check licensing and age rules", "Logistics", 14]], res: ["Food and drink order", "Entertainment plan", "Clean-up plan"] },
  Conference: { tasks: [["Invite and confirm speakers", "Planning", 42], ["Publish agenda and timings", "Promotion", 21], ["Print badges and signage", "Logistics", 5]], res: ["Speaker confirmations", "Microphones and AV", "Name badges", "Accessibility arrangements"] },
  "Charity Run": { tasks: [["Agree and map the route", "Planning", 35], ["Obtain permissions and insurance", "Planning", 28], ["Arrange marshals and water stations", "People", 10], ["Prepare race numbers and timing sheets", "Logistics", 3]], res: ["Route permission", "Insurance cover", "Water and cups", "Race numbers", "Marshal vests"] },
};
const BASE_RES = ["Venue confirmation", "Volunteer rota", "First aid kit", "Signage and posters"];

export function generatePlan(type, date) {
  const x = EXTRA[type] || { tasks: [], res: [] };
  const tasks = [...COMMON, ...x.tasks]
    .map(([title, category, d]) => ({ id: uid(), title, category, due: addDays(date, -d), status: "todo" }))
    .sort((a, b) => a.due.localeCompare(b.due));
  const resources = [...BASE_RES, ...x.res].map((label) => ({ id: uid(), label, have: false }));
  return { tasks, resources };
}
