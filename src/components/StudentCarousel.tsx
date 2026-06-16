import React from "react";

interface StudentProfile {
  id: number;
  name: string;
  avatar: string;
  photo: string;
  destination: string;
  destFlag: string;
  countryCode: string;
  resultType: "IELTS" | "PTE" | "Visa Success";
  resultBadgeColor: string;
  resultDetail: string;
  admittedTo: string;
  beforeLoc: string;
  beforeStatus: string;
  quote: string;
  scores: {
    overall: string;
    sub1Label?: string;
    sub1Val?: string;
    sub2Label?: string;
    sub2Val?: string;
    sub3Label?: string;
    sub3Val?: string;
    sub4Label?: string;
    sub4Val?: string;
  };
  timeline: string[];
}

interface D1Story {
  id: number;
  name: string;
  avatar: string;
  destination: string;
  dest_flag: string;
  before_loc: string;
  before_status: string;
  before_ielts: string;
  after_uni: string;
  after_status: string;
  after_salary: string;
  quote: string;
  timeline: string;
}

const countryToCode = (country: string) => {
  const map: Record<string, string> = {
    canada: "ca",
    australia: "au",
    "united kingdom": "gb",
    uk: "gb",
    "united states": "us",
    usa: "us",
    germany: "de",
    ireland: "ie",
    "new zealand": "nz",
    singapore: "sg",
    dubai: "ae",
    uae: "ae",
    malaysia: "my",
    switzerland: "ch",
    europe: "eu",
  };
  return map[country.toLowerCase().trim()] || country.slice(0, 2).toLowerCase();
};

export default function StudentCarousel({ stories: d1Stories }: { stories?: D1Story[] }) {

  const hardcoded: StudentProfile[] = [
    {
      id: 1,
      name: "Aarav Patel",
      avatar: "👨‍🎓",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
      destination: "Canada",
      destFlag: "🇨🇦",
      countryCode: "ca",
      resultType: "IELTS",
      resultBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      resultDetail: "8.0 Band (IELTS)",
      admittedTo: "University of Waterloo (M.Eng in IT)",
      beforeLoc: "Surat, Gujarat",
      beforeStatus: "B.Tech IT Graduate, 1 yr visa gap",
      quote: "I had a previous visa refusal from another agency. TESCA thoroughly audited my file, pinpointed the explanation gaps, and helped me secure both my Waterloo admission and Canadian visa approval in just 12 days.",
      scores: {
        overall: "8.0",
        sub1Label: "Listening", sub1Val: "8.5",
        sub2Label: "Reading", sub2Val: "8.0",
        sub3Label: "Writing", sub3Val: "7.0",
        sub4Label: "Speaking", sub4Val: "8.0"
      },
      timeline: ["Visa Refused (Late 2024)", "Joined TESCA (Jan 2025)", "Waterloo Admission (Mar 2025)", "Canada SDS Visa Approved"]
    },
    {
      id: 2,
      name: "Sneha Reddy",
      avatar: "👩‍💻",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      destination: "Australia",
      destFlag: "🇦🇺",
      countryCode: "au",
      resultType: "PTE",
      resultBadgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      resultDetail: "84 Score (PTE Academic)",
      admittedTo: "University of Melbourne (MS Data Science)",
      beforeLoc: "Hyderabad, Telangana",
      beforeStatus: "BCA Graduate, fresh candidate",
      quote: "The PTE training at TESCA was outstanding! Their mock tests and automated audio analysis helped me fix my speaking speed and pronunciation errors. Scoring 84 overall was beyond my expectations.",
      scores: {
        overall: "84",
        sub1Label: "Speaking", sub1Val: "87",
        sub2Label: "Listening", sub2Val: "83",
        sub3Label: "Reading", sub3Val: "85",
        sub4Label: "Writing", sub4Val: "81"
      },
      timeline: ["PTE Diagnostic (62 Score)", "TESCA PTE Coaching (8 weeks)", "Scored 84 Overall", "Admitted with Partial Waiver"]
    },
    {
      id: 3,
      name: "Vikram Malhotra",
      avatar: "👨‍💼",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      destination: "United Kingdom",
      destFlag: "🇬🇧",
      countryCode: "gb",
      resultType: "Visa Success",
      resultBadgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      resultDetail: "UK Study Visa Approved",
      admittedTo: "Coventry University (MSc Business Management)",
      beforeLoc: "Vadodara, Gujarat",
      beforeStatus: "B.Com Graduate, 3-year career gap",
      quote: "My 3-year career gap made me highly anxious about my UK visa. TESCA's dedicated writing team structured my Statement of Purpose beautifully to justify my work and internship history. Visa arrived in 9 days!",
      scores: {
        overall: "Approved",
        sub1Label: "Intake", sub1Val: "Sept 2025",
        sub2Label: "Duration", sub2Val: "1 Year",
        sub3Label: "Interview", sub3Val: "Waived",
        sub4Label: "Processing", sub4Val: "9 Days"
      },
      timeline: ["SOP Preparation", "Fintech Loan Approval", "CAS Received (Coventry)", "Priority Visa Submission", "Visa Approved"]
    },
    {
      id: 4,
      name: "Meera Krishnan",
      avatar: "👩‍🔬",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
      destination: "Germany",
      destFlag: "🇩🇪",
      countryCode: "de",
      resultType: "IELTS",
      resultBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      resultDetail: "7.5 Band (IELTS)",
      admittedTo: "Technical University of Munich (MS Informatics)",
      beforeLoc: "Chennai, Tamil Nadu",
      beforeStatus: "B.Sc CS, academic distinction",
      quote: "Navigating the German APS certification and setting up the Blocked Account (Sperrkonto) seemed extremely complicated. TESCA guided me step-by-step through the German system and audited my admissions documents.",
      scores: {
        overall: "7.5",
        sub1Label: "Listening", sub1Val: "8.0",
        sub2Label: "Reading", sub2Val: "7.5",
        sub3Label: "Writing", sub3Val: "6.5",
        sub4Label: "Speaking", sub4Val: "7.5"
      },
      timeline: ["APS Registration", "IELTS Preparation", "TUM Admission Letter", "Blocked Account Setup", "German Student Visa Approved"]
    },
    {
      id: 5,
      name: "Kabir Mehra",
      avatar: "👨‍💻",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      destination: "United States",
      destFlag: "🇺🇸",
      countryCode: "us",
      resultType: "PTE",
      resultBadgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      resultDetail: "79 Score (PTE Academic)",
      admittedTo: "Northeastern University (MS Information Systems)",
      beforeLoc: "Mumbai, Maharashtra",
      beforeStatus: "BE Electrical, 1.5 yrs work exp",
      quote: "Securing a US F1 visa felt like a huge barrier due to the visa interview. TESCA held 4 rounds of realistic mock visa interviews with senior visa experts. That practice kept me confident, and I cleared it on my first attempt.",
      scores: {
        overall: "79",
        sub1Label: "Speaking", sub1Val: "83",
        sub2Label: "Listening", sub2Val: "77",
        sub3Label: "Reading", sub3Val: "80",
        sub4Label: "Writing", sub4Val: "76"
      },
      timeline: ["I-20 Form Received", "Mock Visa Drills", "SEVIS Fee Lodgement", "F1 Interview (Mumbai Cons.)", "Visa Approved"]
    },
    {
      id: 6,
      name: "Jaspreet Kaur",
      avatar: "👩‍🎓",
      photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop",
      destination: "Canada",
      destFlag: "🇨🇦",
      countryCode: "ca",
      resultType: "Visa Success",
      resultBadgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      resultDetail: "Canada SDS Visa Approved",
      admittedTo: "Seneca College (PG Diploma in Project Management)",
      beforeLoc: "Amritsar, Punjab",
      beforeStatus: "BBA Graduate, tight timeline",
      quote: "TESCA's CRM portal and responsive consultants kept me updated constantly. They took care of everything from SDS tuition fee transfer to setting up my GIC account, making the entire journey completely stress-free.",
      scores: {
        overall: "Approved",
        sub1Label: "Category", sub1Val: "SDS",
        sub2Label: "College", sub2Val: "Seneca",
        sub3Label: "GIC Status", sub3Val: "Cleared",
        sub4Label: "Biometrics", sub4Val: "Completed"
      },
      timeline: ["College Admission Match", "GIC Account Setup", "SDS File Preparation", "Biometrics Appointment", "Passport Stamped (11 Days)"]
    },
    {
      id: 7,
      name: "Rohit Verma",
      avatar: "👨‍🎓",
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
      destination: "Ireland",
      destFlag: "🇮🇪",
      countryCode: "ie",
      resultType: "IELTS",
      resultBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      resultDetail: "7.0 Band (IELTS)",
      admittedTo: "Trinity College Dublin (MSc Finance)",
      beforeLoc: "Pune, Maharashtra",
      beforeStatus: "BAF Graduate, profile with sports merits",
      quote: "I wanted to study in Ireland but didn't know how to secure funding. TESCA helped me build a stellar application that secured a €5,000 sports merit scholarship at Trinity College, and handled my visa filing flawlessly.",
      scores: {
        overall: "7.0",
        sub1Label: "Listening", sub1Val: "7.5",
        sub2Label: "Reading", sub2Val: "7.0",
        sub3Label: "Writing", sub3Val: "6.5",
        sub4Label: "Speaking", sub4Val: "7.0"
      },
      timeline: ["Profile Selection", "Trinity Application Submission", "€5,000 Scholarship Award", "Irish Visa Submission", "Visa Stamped"]
    },
    {
      id: 8,
      name: "Ananya Sen",
      avatar: "👩‍💼",
      photo: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400&auto=format&fit=crop",
      destination: "United Kingdom",
      destFlag: "🇬🇧",
      countryCode: "gb",
      resultType: "Visa Success",
      resultBadgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      resultDetail: "UK Student & Spouse Visa Approved",
      admittedTo: "University of East London (MBA with Placement Year)",
      beforeLoc: "Kolkata, West Bengal",
      beforeStatus: "HR Professional, married applicant",
      quote: "Applying for a study visa as a married student requires double caution to avoid refusals. TESCA guided us through the complex joint financial proofs and filed our applications together. Both visas approved in 3 weeks!",
      scores: {
        overall: "Approved",
        sub1Label: "Type", sub1Val: "Joint (Spouse)",
        sub2Label: "Course", sub2Val: "MBA",
        sub3Label: "Work Rights", sub3Val: "Included",
        sub4Label: "Processing", sub4Val: "18 Days"
      },
      timeline: ["Joint Financial Auditing", "MBA Admission Offer", "Spouse Dependency Filing", "Biometrics Appointment", "Dual Visas Approved"]
    }
  ];

  const fromD1: StudentProfile[] = (d1Stories || []).map(s => ({
    id: s.id,
    name: s.name,
    avatar: s.avatar,
    photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0A7880&color=fff&size=200`,
    destination: s.destination,
    destFlag: s.dest_flag,
    countryCode: countryToCode(s.destination),
    resultType: "Visa Success" as const,
    resultBadgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    resultDetail: s.after_status,
    admittedTo: s.after_uni,
    beforeLoc: s.before_loc,
    beforeStatus: s.before_status,
    quote: s.quote,
    scores: { overall: "Approved" },
    timeline: []
  }));

  const d1Ids = new Set(fromD1.map(s => s.name.toLowerCase().trim()));
  const students: StudentProfile[] = [
    ...fromD1,
    ...hardcoded.filter(s => !d1Ids.has(s.name.toLowerCase().trim()))
  ];

  return (
    <div className="w-full py-16 bg-white overflow-hidden font-sans border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10 text-center">
        <span className="text-xs font-semibold tracking-wider text-[#F08A00] uppercase bg-[#FFE5CC] px-4 py-1.5 rounded-full border border-[#F08A00]/20 font-sans">
          TESCA Success Stories
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-800 mt-4 tracking-tight">
         Real Students. Real Approvals. Real Futures.
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto font-sans font-normal mt-2 leading-relaxed">
          Explore recent visa approvals, IELTS/PTE achievements, and inspiring journeys from students who made their global dreams a reality.
        </p>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative w-full overflow-hidden select-none py-2">
        {/* Soft fading overlays on left and right borders for premium glass-depth look */}
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling wrapper */}
        <div className="flex w-max gap-6 animate-scroll hover:[animation-play-state:paused]">
          {/* Double map for seamless loop */}
          {[...students, ...students].map((student, idx) => (
            <div
              key={`${student.id}-${idx}`}
              className="flex-shrink-0 w-[230px] rounded-[1.5rem] border border-slate-200 bg-white hover:border-[#0A7880]/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left relative group shadow-sm flex flex-col overflow-hidden"
            >
              {/* Photo Box Container (medium size) */}
              <div className="relative w-full h-[160px] overflow-hidden bg-slate-50 shrink-0">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 select-none"
                  loading="lazy"
                />
                
                {/* Country Flag overlay on Top Right corner */}
                {student.resultType === "Visa Success" && student.countryCode && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-[2px] p-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center justify-center">
                    <img
                      src={`https://flagcdn.com/w40/${student.countryCode}.png`}
                      alt={`${student.destination} flag`}
                      className="w-5 h-3.5 rounded-xs object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Info Text Area (at bottom) */}
              <div className="p-4 flex flex-col justify-between flex-grow bg-white border-t border-slate-50">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 font-display truncate leading-snug group-hover:text-[#0A7880] transition-colors">
                    {student.name}
                  </h4>
                  
                  {student.resultType === "Visa Success" ? (
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
                      Visa: {student.destination}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
                      {student.resultType} Overall: {student.scores.overall}
                    </p>
                  )}
                </div>

                {/* Score badge at bottom */}
                <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100">
                  <span className="text-[12px] font-extrabold text-[#0A7880] font-display">
                    {student.resultType === "Visa Success" ? "Approved" : student.scores.overall}
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                    {student.resultType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
