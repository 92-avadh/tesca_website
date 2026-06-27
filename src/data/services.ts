import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  detailedContent: string[];
}

export const SERVICES: Service[] = [
{
id: "counselling",
title: "Career Counselling",
desc: "Personalized guidance to choose the right course, university, and country for your future.",
icon: "User",
color: "text-slate-800 bg-accent-blue/5",
detailedContent: [
"One-on-one sessions with experienced study abroad advisors.",
"Assessment of academic background, interests, and career goals.",
"Personalized country, course, and university recommendations.",
"Guidance on career opportunities and post-study pathways."
]
},
{
id: "admission",
title: "University Admissions",
desc: "Complete application support to maximize your chances of admission.",
icon: "GraduationCap",
color: "text-accent-indigo bg-accent-indigo/5",
detailedContent: [
"University and course shortlisting based on your profile.",
"Application preparation and submission support.",
"Document verification before submission.",
"Offer letter tracking and admission acceptance guidance."
]
},
{
id: "sop",
title: "SOP & Documentation",
desc: "Build a strong application with professionally reviewed documents.",
icon: "FileText",
color: "text-highlight-purple bg-highlight-purple/5",
detailedContent: [
"Statement of Purpose (SOP) review and enhancement.",
"Guidance for Letters of Recommendation (LORs).",
"Resume and CV optimization for international admissions.",
"Document checks aligned with university and visa requirements."
]
},
{
id: "scholarships",
title: "Scholarships & Funding",
desc: "Discover funding opportunities that make studying abroad more affordable.",
icon: "Award",
color: "text-accent-cyan bg-accent-cyan/5",
detailedContent: [
"Scholarship matching based on academic profile.",
"Guidance for scholarship applications and essays.",
"Support for grants, bursaries, and tuition waivers.",
"Strategies to maximize funding opportunities."
]
},
{
id: "testprep",
title: "Test Preparation",
desc: "Expert coaching for IELTS, PTE, TOEFL, and other entrance exams.",
icon: "BookOpen",
color: "text-slate-800 bg-accent-blue/5",
detailedContent: [
"Structured preparation programs led by experienced trainers.",
"Mock tests with detailed performance analysis.",
"Targeted improvement strategies for each test section.",
"Study materials and practice resources for higher scores."
]
},
{
id: "visa",
title: "Visa Success Support",
desc: "End-to-end visa assistance designed to improve approval confidence.",
icon: "Briefcase",
color: "text-accent-indigo bg-accent-indigo/5",
detailedContent: [
"Guidance for student visa applications and requirements.",
"Financial document and eligibility verification.",
"Visa interview preparation and mock sessions.",
"Complete application review before submission."
]
},
{
id: "insurance",
title: "Student Health Cover",
desc: "Health insurance solutions that meet university and visa requirements.",
icon: "Heart",
color: "text-highlight-purple bg-highlight-purple/5",
detailedContent: [
"Guidance on mandatory student insurance plans.",
"Comparison of coverage options and benefits.",
"Assistance with policy selection and registration.",
"Support for understanding claims and medical coverage."
]
},
{
id: "financial",
title: "Education Finance",
desc: "Financial planning support for loans, sponsorships, and study expenses.",
icon: "Landmark",
color: "text-accent-cyan bg-accent-cyan/5",
detailedContent: [
"Education loan assistance through trusted banking partners.",
"Guidance for blocked accounts and financial documentation.",
"Support with sponsor and funding declarations.",
"Advice on managing tuition and living expenses abroad."
]
},
{
id: "accommodation",
title: "Student Housing",
desc: "Find safe and comfortable accommodation near your university.",
icon: "Home",
color: "text-slate-800 bg-accent-blue/5",
detailedContent: [
"Guidance for on-campus and off-campus housing options.",
"Access to verified student accommodation providers.",
"Support with rental agreements and housing procedures.",
"Assistance with settling into your new destination."
]
},
{
id: "departure",
title: "Pre-Departure Support",
desc: "Everything you need before leaving for your study destination.",
icon: "Plane",
color: "text-accent-indigo bg-accent-indigo/5",
detailedContent: [
"Pre-departure orientation and travel guidance.",
"Information on accommodation, banking, and local essentials.",
"Packing, travel, and arrival preparation support.",
"Guidance for a smooth transition to student life abroad."
]
},
{
id: "passport",
title: "Passport Assistance",
desc: "End-to-end guidance for fresh passport applications, renewals, name/address corrections, and tatkaal services.",
icon: "FileText",
color: "text-highlight-purple bg-highlight-purple/5",
detailedContent: [
"Guidance on passport application forms and online appointments.",
"Required document checklist verification (birth proof, address proof).",
"Support for fresh passport applications and fast-track Tatkaal options.",
"Assistance with renewals, booklet extensions, and correction updates."
]
},
{
id: "tickets",
title: "Air Ticketing & Travel",
desc: "Assistance in booking flights at discounted student rates, route planning, and baggage allowance consultation.",
icon: "Plane",
color: "text-slate-800 bg-accent-blue/5",
detailedContent: [
"Discounted flight booking options tailored for international students.",
"Route optimization and layover recommendations for long journeys.",
"Guidance on baggage rules, airline allowances, and student travel deals.",
"Airport pick-up coordination and transit accommodation assistance."
]
}
];


export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find(s => s.id === slug);
}
