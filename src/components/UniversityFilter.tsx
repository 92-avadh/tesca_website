import React, { useState, useEffect } from "react";
import { Globe, GraduationCap, ArrowRight, Search, X, Compass, Award, RefreshCw, Star, MapPin } from "lucide-react";

interface University {
  id: number;
  name: string;
  country: string;
  code: string;
  min_cgpa_percent: string;
  
  // Backward compatibility fields
  tuition_fees?: string | null;
  intake?: string | null;
  ielts_pte_req?: string | null;
  moi_accepted?: string | null;
  courses?: string | null;
  photo?: string | null;
  ug_fees?: string | null;
  pg_fees?: string | null;
  ug_ielts_pte_req?: string | null;
  pg_ielts_pte_req?: string | null;
  ug_moi_accepted?: string | null;
  pg_moi_accepted?: string | null;
  ug_intake?: string | null;
  pg_intake?: string | null;

  // New schema fields
  image_url?: string | null;
  ug_tuition_fees?: string | null;
  ug_intakes?: string | null;
  ug_ielts_pte?: string | null;
  ug_moi?: string | null;
  ug_courses?: string | null;
  pg_tuition_fees?: string | null;
  pg_intakes?: string | null;
  pg_ielts_pte?: string | null;
  pg_moi?: string | null;
  pg_courses?: string | null;
}

const countries = [
  { name: "All Destinations", code: "all" },
  { name: "USA", code: "us" },
  { name: "United Kingdom", code: "uk" },
  { name: "Canada", code: "ca" },
  { name: "Australia", code: "au" },
  { name: "Germany", code: "de" },
  { name: "New Zealand", code: "nz" },
  { name: "Ireland", code: "ie" },
  { name: "Singapore", code: "sg" },
  { name: "Switzerland", code: "ch" },
  { name: "Malaysia", code: "my" },
  { name: "Dubai", code: "ae" },
  { name: "Europe", code: "eu" },
];

const countryLabels: Record<string, string> = {
  us: "USA", uk: "United Kingdom", ca: "Canada", au: "Australia",
  de: "Germany", nz: "New Zealand", ie: "Ireland", sg: "Singapore",
  ch: "Switzerland", my: "Malaysia", ae: "Dubai", eu: "Europe",
};

const universityDomainMap: Record<string, string> = {
  "Stanford University": "stanford.edu",
  "Massachusetts Institute of Technology": "mit.edu",
  "Harvard University": "harvard.edu",
  "University of California, Berkeley": "berkeley.edu",
  "California Institute of Technology": "caltech.edu",
  "University of Oxford": "ox.ac.uk",
  "University of Cambridge": "cam.ac.uk",
  "Imperial College London": "imperial.ac.uk",
  "London School of Economics": "lse.ac.uk",
  "UCL": "ucl.ac.uk",
  "Leeds Beckett University": "leedsbeckett.ac.uk",
  "London Metropolitan University": "londonmet.ac.uk",
  "University of East London": "uel.ac.uk",
  "University of Wales Trinity Saint David": "uwtsd.ac.uk",
  "University of Hertfordshire": "herts.ac.uk",
  "University of West London": "uwl.ac.uk",
  "University of Hull": "hull.ac.uk",
  "University of Bedfordshire": "beds.ac.uk",
  "Birmingham City University": "bcu.ac.uk",
  "Brunel University of London": "brunel.ac.uk",
  "Glasgow Caledonian University": "gcu.ac.uk",
  "London South Bank University": "lsbu.ac.uk",
  "Nottingham Trent University": "ntu.ac.uk",
  "University of Essex": "essex.ac.uk",
  "University of Central Lancashire (UCLan)": "uclan.ac.uk",
  "University of Lincoln": "lincoln.ac.uk",
  "University of Wolverhampton": "wlv.ac.uk",
  "De Montfort University": "dmu.ac.uk",
  "University of Bradford": "bradford.ac.uk",
  "Arden University": "arden.ac.uk",
  "University of Greenwich": "gre.ac.uk",
  "Coventry University": "coventry.ac.uk",
  "Anglia Ruskin University": "aru.ac.uk",
  "Ravensbourne University London": "ravensbourne.ac.uk",
  "Edinburgh Napier University": "napier.ac.uk",
  "University of East Anglia": "uea.ac.uk",
  "University of York": "york.ac.uk",
  "University of Gloucestershire": "glos.ac.uk",
  "University of Sunderland": "sunderland.ac.uk",
  "University of Leicester": "le.ac.uk",
  "Teesside University": "tees.ac.uk",
  "Regent College London": "rcl.ac.uk",
  "University of Chester": "chester.ac.uk",
  "University of the West of Scotland": "uws.ac.uk",
  "University of Northampton": "northampton.ac.uk",
  "Swansea University": "swansea.ac.uk",
  "Southampton Solent University": "solent.ac.uk",
  "Aston University": "aston.ac.uk",
  "University of Roehampton": "roehampton.ac.uk",
  "Buckinghamshire New University": "bucks.ac.uk",
  "Northumbria University": "northumbria.ac.uk",
  "Royal Holloway, University of London": "royalholloway.ac.uk",
  "Middlesex University": "mdx.ac.uk",
  "Ulster University": "ulster.ac.uk",
  "University of Huddersfield": "hud.ac.uk",
  "The University of Law": "law.ac.uk",
  "University of Toronto": "utoronto.ca",
  "University of Waterloo": "uwaterloo.ca",
  "University of British Columbia": "ubc.ca",
  "McGill University": "mcgill.ca",
  "University of Alberta": "ualberta.ca",
  "University of Melbourne": "unimelb.edu.au",
  "University of Sydney": "sydney.edu.au",
  "Australian National University": "anu.edu.au",
  "UNSW Sydney": "unsw.edu.au",
  "Monash University": "monash.edu",
  "Technical University of Munich": "tum.de",
  "Heidelberg University": "uni-heidelberg.de",
  "RWTH Aachen University": "rwth-aachen.de",
  "LMU Munich": "lmu.de",
  "Karlsruhe Institute of Technology": "kit.edu",
  "University of Auckland": "auckland.ac.nz",
  "University of Otago": "otago.ac.nz",
  "Victoria University of Wellington": "wgtn.ac.nz",
  "Trinity College Dublin": "tcd.ie",
  "University College Dublin": "ucd.ie",
  "University of Galway": "universityofgalway.ie",
  "National University of Singapore": "nus.edu.sg",
  "Nanyang Technological University": "ntu.edu.sg",
  "ETH Zurich": "ethz.ch",
  "EPFL": "epfl.ch",
  "University of Zurich": "uzh.ch",
  "University of Malaya": "um.edu.my",
  "Universiti Kebangsaan Malaysia": "ukm.edu.my",
  "Universiti Sains Malaysia": "usm.my",
  "University of Dubai": "ud.ac.ae",
  "Khalifa University": "ku.ac.ae",
  "University of Amsterdam": "uva.nl",
  "Delft University of Technology": "tudelft.nl",
  "University of Copenhagen": "ku.dk"
};

function resolveUniversityDomain(name: string): string {
  if (universityDomainMap[name]) {
    return universityDomainMap[name];
  }
  const clean = name.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  return clean.split(/\s+/).slice(0, 2).join("") + ".edu";
}

function UniversityLogo({ domain, name }: { domain: string; name: string }) {
  const [imgSrc, setImgSrc] = useState(`https://logo.clearbit.com/${domain}`);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(`https://www.google.com/s2/favicons?sz=128&domain=${domain}`);
      setHasError(true);
    } else {
      setImgSrc("");
    }
  };

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={`${name} logo`}
        className="w-full h-full object-contain p-2"
        onError={handleError}
      />
    );
  }

  return (
    <span className="text-lg font-bold text-accent-blue font-display">
      {name.charAt(0)}
    </span>
  );
}

const PAGE_SIZE = 12;

export default function UniversityFilter() {
  const [activeCountry, setActiveCountry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<'UG' | 'PG'>('UG');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  // Sync state from query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const country = params.get("country") || "all";
    const validCountry = countries.some(c => c.code === country.toLowerCase());
    if (validCountry) {
      setActiveCountry(country.toLowerCase());
    } else {
      setActiveCountry("all");
    }
  }, []);

  // Fetch universities when country selection changes
  useEffect(() => {
    const fetchUnis = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/universities?country=${activeCountry}`);
        if (res.ok) {
          const data = await res.json();
          setUniversities(data);
        } else {
          console.error("Failed to load universities");
        }
      } catch (e) {
        console.error("Error fetching universities:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnis();
    setVisibleCount(PAGE_SIZE);
  }, [activeCountry]);

  const handleFilter = (code: string) => {
    setActiveCountry(code);
    const url = new URL(window.location.href);
    if (code === "all") {
      url.searchParams.delete("country");
    } else {
      url.searchParams.set("country", code);
    }
    window.history.pushState({}, "", url.toString());
  };

  const filtered = universities.filter(uni => {
    const coursesStr = selectedLevel === 'UG'
      ? (uni.ug_courses || uni.courses || "")
      : (uni.pg_courses || "");
    const matchesKeyword = !searchQuery.trim() ||
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coursesStr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesKeyword;
  });

  const displayed = filtered.slice(0, visibleCount);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.ceil(visibleCount / PAGE_SIZE);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filtered.length));
  };

  return (
    <div className="space-y-8">
      
      {/* Country Filtering Buttons */}
      <div className="space-y-4 animate-fade-in text-left">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent-blue" />
          <h2 className="text-lg font-bold font-display text-slate-800 tracking-tight">Filter Study Destination</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {countries.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleFilter(c.code)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans transition-all duration-200 border cursor-pointer flex items-center gap-2 ${
                activeCountry === c.code
                  ? "bg-accent-blue text-white border-accent-blue shadow-md scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-accent-blue/30 hover:text-accent-blue hover:bg-accent-blue/5"
              }`}
            >
              {c.code !== "all" && (
                <img
                  src={`https://flagcdn.com/w20/${c.code === "uk" ? "gb" : c.code}.png`}
                  alt="Flag"
                  className="w-4 h-3 rounded-sm object-cover"
                />
              )}
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Refine Filters panel */}
      <div className="bg-slate-50 rounded-[2rem] border border-slate-200/50 p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-6 space-y-1.5 text-left">
          <label htmlFor="course-search" className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Search Course / Keyword</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="course-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Computer Science, MBA, Harvard..."
              className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent-blue"
            />
          </div>
        </div>

        <div className="md:col-span-4 space-y-1.5 text-left">
          <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Select Level</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedLevel('UG')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === 'UG'
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Undergraduate (UG)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('PG')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLevel === 'PG'
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Postgraduate (PG)
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setSelectedLevel('UG'); }}
            className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        {isLoading ? (
          <div className="h-4 bg-slate-100 rounded w-48 animate-pulse" />
        ) : (
          <p>
            Found <span className="font-bold text-slate-800">{filtered.length}</span> matching universities in {activeCountry === "all" ? "All destinations" : countryLabels[activeCountry]} for {selectedLevel === 'UG' ? 'Undergraduate (UG)' : 'Postgraduate (PG)'}
          </p>
        )}
        {!isLoading && filtered.length > PAGE_SIZE && (
          <span className="text-[10px] text-slate-400">
            Showing {displayed.length} of {filtered.length}
          </span>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-accent-blue animate-spin" />
          <p className="text-sm font-semibold text-slate-500 font-sans">Fetching universities...</p>
        </div>
      )}

      {/* Universities list */}
      {!isLoading && (
        filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-white border border-slate-200 rounded-[2rem]">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold font-display text-slate-700">No matching universities found</h3>
            <p className="text-xs text-slate-400 font-sans max-w-xs mx-auto">Try loosening your search keywords or choosing a different level/country filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map(uni => {
                const fees = selectedLevel === 'UG' 
                  ? (uni.ug_tuition_fees || uni.ug_fees || uni.tuition_fees || "N/A") 
                  : (uni.pg_tuition_fees || uni.pg_fees || "N/A");
                const intake = selectedLevel === 'UG' 
                  ? (uni.ug_intakes || uni.ug_intake || uni.intake || "N/A") 
                  : (uni.pg_intakes || uni.pg_intake || "N/A");
                const ielts = selectedLevel === 'UG' 
                  ? (uni.ug_ielts_pte || uni.ug_ielts_pte_req || uni.ielts_pte_req || "N/A") 
                  : (uni.pg_ielts_pte || uni.pg_ielts_pte_req || "N/A");
                const moi = selectedLevel === 'UG' 
                  ? (uni.ug_moi || uni.ug_moi_accepted || uni.moi_accepted || "Yes") 
                  : (uni.pg_moi || uni.pg_moi_accepted || "Yes");
                const courses = selectedLevel === 'UG' 
                  ? (uni.ug_courses || uni.courses || "") 
                  : (uni.pg_courses || "");

                return (
                  <div 
                    key={uni.id} 
                    onClick={() => setSelectedUniversity(uni)}
                    className="rounded-3xl border border-slate-200 bg-white hover:border-accent-blue hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer group hover:-translate-y-1 text-left"
                  >
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 flex items-center justify-center shrink-0 overflow-hidden shadow-sm bg-white p-1">
                            <UniversityLogo domain={resolveUniversityDomain(uni.name)} name={uni.name} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-bold font-display text-slate-800 leading-snug group-hover:text-accent-blue transition-colors line-clamp-2">{uni.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <img
                                src={`https://flagcdn.com/w20/${uni.code === "uk" ? "gb" : uni.code}.png`}
                                alt="Flag"
                                className="w-4 h-3 rounded-sm object-cover"
                              />
                              <span className="text-xs text-slate-500 font-sans font-medium">{uni.country}</span>
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 ml-1">
                                {selectedLevel === 'UG' ? 'UG' : 'PG'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Requirements grid */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-sans text-slate-600 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Tuition Fees</span>
                            <span className="font-bold text-slate-700 truncate block">{fees}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Intake</span>
                            <span className="font-bold text-slate-700 truncate block">{intake}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">Min Score Req</span>
                            <span className="font-bold text-slate-700 truncate block">{uni.min_cgpa_percent}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">MOI Accepted</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold mt-0.5 ${
                              moi.toLowerCase() === "yes" 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                : "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}>
                              {moi}
                            </span>
                          </div>
                          <div className="col-span-2 border-t border-slate-100 pt-2">
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide">English Requirement</span>
                            <span className="font-bold text-slate-700 block whitespace-normal truncate">{ielts}</span>
                          </div>
                        </div>

                        {courses && (
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-semibold tracking-wide mb-1">Key Courses</span>
                            <div className="flex flex-wrap gap-1">
                              {courses.split(",").slice(0, 4).map((c, i) => (
                                <span key={i} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                  {c.trim()}
                                </span>
                              ))}
                              {courses.split(",").length > 4 && (
                                <span className="text-[9px] font-semibold bg-slate-50 text-slate-400 px-2 py-0.5 rounded">
                                  +{courses.split(",").length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* View details CTA */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-accent-blue group-hover:underline inline-flex items-center gap-1 font-sans ml-auto">
                          View details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < filtered.length && (
              <div className="flex flex-col items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-white border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )
      )}

      {/* University Detail Modal Overlay */}
      {selectedUniversity && (() => {
        const ugFees = selectedUniversity.ug_tuition_fees || selectedUniversity.ug_fees || selectedUniversity.tuition_fees || "N/A";
        const pgFees = selectedUniversity.pg_tuition_fees || selectedUniversity.pg_fees || "N/A";
        const ugIntakes = selectedUniversity.ug_intakes || selectedUniversity.ug_intake || selectedUniversity.intake || "N/A";
        const pgIntakes = selectedUniversity.pg_intakes || selectedUniversity.pg_intake || "N/A";
        const ugIelts = selectedUniversity.ug_ielts_pte || selectedUniversity.ug_ielts_pte_req || selectedUniversity.ielts_pte_req || "N/A";
        const pgIelts = selectedUniversity.pg_ielts_pte || selectedUniversity.pg_ielts_pte_req || "N/A";
        const ugMoi = selectedUniversity.ug_moi || selectedUniversity.ug_moi_accepted || selectedUniversity.moi_accepted || "Yes";
        const pgMoi = selectedUniversity.pg_moi || selectedUniversity.pg_moi_accepted || "N/A";
        const ugCourses = (selectedUniversity.ug_courses || selectedUniversity.courses || "").split(",").map(c => c.trim()).filter(Boolean);
        const pgCourses = (selectedUniversity.pg_courses || "").split(",").map(c => c.trim()).filter(Boolean);
        const domain = resolveUniversityDomain(selectedUniversity.name);
        const flagCode = selectedUniversity.code === "uk" ? "gb" : selectedUniversity.code;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.72)", backdropFilter: "blur(12px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedUniversity(null); }}
          >
            <div
              className="relative bg-white w-full max-w-[680px] rounded-[2rem] shadow-[0_32px_80px_-8px_rgba(0,0,0,0.32)] overflow-hidden flex flex-col"
              style={{ maxHeight: "90vh", animation: "cardPop 0.22s cubic-bezier(.34,1.56,.64,1) both" }}
            >
              <style>{`
                @keyframes cardPop {
                  from { opacity:0; transform:scale(0.94) translateY(24px); }
                  to   { opacity:1; transform:scale(1) translateY(0); }
                }
              `}</style>

              {/* ── Hero banner ── */}
              <div className="relative h-52 shrink-0 overflow-hidden">
                {selectedUniversity.image_url || selectedUniversity.photo ? (
                  <img
                    src={selectedUniversity.image_url || selectedUniversity.photo || ""}
                    alt={selectedUniversity.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, #4f46e5 0%, #0ea5e9 50%, #06b6d4 100%)`
                    }}
                  >
                    <GraduationCap className="w-20 h-20 text-white/30" />
                  </div>
                )}
                {/* gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.32) 55%, transparent 100%)" }}
                />

                {/* Close button */}
                <button
                  onClick={() => setSelectedUniversity(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all cursor-pointer border border-white/20 hover:scale-105"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Bottom overlay identity */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end gap-4">
                  {/* Logo bubble */}
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xl border-2 border-white/60 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <UniversityLogo domain={domain} name={selectedUniversity.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <img src={`https://flagcdn.com/w20/${flagCode}.png`} alt="Flag" className="w-4 h-3 rounded-sm object-cover" />
                      <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">{selectedUniversity.country}</span>
                      <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-white/20">
                        {selectedUniversity.code.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight font-display line-clamp-2">
                      {selectedUniversity.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* ── Min score ribbon ── */}
              <div className="shrink-0 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3">
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Minimum Score Required</span>
                </div>
                <span className="text-white font-extrabold text-sm font-mono">{selectedUniversity.min_cgpa_percent}</span>
              </div>

              {/* ── Scrollable body ── */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6">

                {/* UG + PG side-by-side panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* UG Panel */}
                  <div className="rounded-2xl border border-indigo-200/60 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-indigo-600">
                      <GraduationCap className="w-3.5 h-3.5 text-white" />
                      <span className="text-[11px] font-bold text-white uppercase tracking-widest">Undergraduate (UG)</span>
                    </div>
                    <div className="p-4 space-y-2.5 bg-indigo-50/30">
                      {[
                        { label: "Tuition Fees", value: ugFees },
                        { label: "Intakes", value: ugIntakes },
                        { label: "IELTS / PTE", value: ugIelts },
                        {
                          label: "MOI Accepted",
                          value: ugMoi,
                          badge: true,
                          isYes: ugMoi.toLowerCase() !== "no"
                        }
                      ].map((row) => (
                        <div key={row.label} className="flex items-start justify-between gap-2 text-xs">
                          <span className="text-slate-500 font-medium shrink-0">{row.label}</span>
                          {row.badge ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${row.isYes ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                              {row.isYes ? "✓" : "✗"} {row.value}
                            </span>
                          ) : (
                            <span className="font-bold text-slate-800 text-right">{row.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {ugCourses.length > 0 && (
                      <div className="px-4 pb-4 bg-indigo-50/30">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Key Programmes</p>
                        <div className="flex flex-wrap gap-1">
                          {ugCourses.slice(0, 6).map((c, i) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200/60">
                              {c}
                            </span>
                          ))}
                          {ugCourses.length > 6 && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                              +{ugCourses.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PG Panel */}
                  <div className="rounded-2xl border border-emerald-200/60 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-600">
                      <Award className="w-3.5 h-3.5 text-white" />
                      <span className="text-[11px] font-bold text-white uppercase tracking-widest">Postgraduate (PG)</span>
                    </div>
                    <div className="p-4 space-y-2.5 bg-emerald-50/30">
                      {[
                        { label: "Tuition Fees", value: pgFees },
                        { label: "Intakes", value: pgIntakes },
                        { label: "IELTS / PTE", value: pgIelts },
                        {
                          label: "MOI Accepted",
                          value: pgMoi,
                          badge: true,
                          isYes: pgMoi.toLowerCase() !== "no" && pgMoi !== "N/A"
                        }
                      ].map((row) => (
                        <div key={row.label} className="flex items-start justify-between gap-2 text-xs">
                          <span className="text-slate-500 font-medium shrink-0">{row.label}</span>
                          {row.badge ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${row.isYes ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                              {row.isYes ? "✓" : "✗"} {row.value}
                            </span>
                          ) : (
                            <span className="font-bold text-slate-800 text-right">{row.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {pgCourses.length > 0 ? (
                      <div className="px-4 pb-4 bg-emerald-50/30">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Key Programmes</p>
                        <div className="flex flex-wrap gap-1">
                          {pgCourses.slice(0, 6).map((c, i) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200/60">
                              {c}
                            </span>
                          ))}
                          {pgCourses.length > 6 && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                              +{pgCourses.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 pb-4 bg-emerald-50/30">
                        <span className="text-[10px] text-slate-400 italic">No PG programmes listed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Footer CTA ── */}
              <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ready to apply?</p>
                  <p className="text-xs font-bold text-slate-700">Our counsellors can guide your application</p>
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedUniversity(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUniversity(null);
                      (window as any).openCounsellorForm?.();
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:scale-[1.02] cursor-pointer transition-all"
                    style={{ background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)" }}
                  >
                    Speak to Counsellor
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
