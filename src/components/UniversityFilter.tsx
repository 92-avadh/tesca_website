import React, { useState, useEffect } from "react";
import { Globe, MapPin, Star, GraduationCap, ArrowRight } from "lucide-react";

interface University {
  name: string;
  country: string;
  code: string;
  rank: number;
  domain: string;
  city: string;
  established: number;
  students: string;
}

const countries = [
  { name: "All", code: "all" },
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



function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="relative p-6 pb-4 flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 shimmer shrink-0" />
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 bg-slate-100 rounded w-3/4 shimmer" />
            <div className="h-5 bg-slate-100 rounded-full w-12 shimmer shrink-0" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-1/3 shimmer" />
        </div>
      </div>
      <div className="px-6 pb-4 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-1/2 shimmer" />
        <div className="h-3.5 bg-slate-100 rounded w-5/6 shimmer" />
      </div>
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <div className="h-3.5 bg-slate-100 rounded w-1/4 shimmer" />
      </div>
    </div>
  );
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

export default function UniversityFilter({ universities = [] }: { universities?: University[] }) {
  const [activeCountry, setActiveCountry] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const country = params.get("country") || "all";
    setActiveCountry(country);
    setVisibleCount(12);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const handleFilter = (code: string) => {
    setIsLoading(true);
    setActiveCountry(code);
    setVisibleCount(12);
    const url = code === "all" ? "/universities" : `/universities?country=${code}`;
    window.history.replaceState({}, "", url);
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  };

  const filtered = activeCountry === "all"
    ? universities
    : universities.filter(u => u.code === activeCountry);

  return (
    <>
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-accent-blue" />
          <h2 className="text-lg font-bold font-display text-slate-800 tracking-tight">Filter by Country</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {countries.map(c => {
            const isActive = activeCountry === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => handleFilter(c.code)}
                className={`px-4 py-2 rounded-full text-sm font-medium font-sans transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? "bg-accent-blue text-white border-accent-blue shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-accent-blue/30 hover:text-accent-blue hover:bg-accent-blue/5"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        {isLoading ? (
          <div className="h-5 bg-slate-100 rounded w-32 shimmer animate-pulse" />
        ) : (
          <p className="text-sm text-slate-500 font-sans font-medium">
            <span className="font-bold text-slate-800">{filtered.length}</span> {filtered.length === 1 ? "university" : "universities"} found
          </p>
        )}
        {!isLoading && activeCountry !== "all" && (
          <button
            type="button"
            onClick={() => handleFilter("all")}
            className="text-sm text-accent-blue hover:underline font-sans font-semibold cursor-pointer"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : (
          filtered.slice(0, visibleCount).map((uni) => (
            <div key={uni.name} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 overflow-hidden group">
              <div className="relative p-6 pb-4 flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm bg-white">
                  <UniversityLogo domain={uni.domain} name={uni.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold font-display text-slate-800 leading-snug line-clamp-2">{uni.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full shrink-0 font-sans">
                      <Star className="w-3 h-3" />
                      #{uni.rank}
                    </div>
                  </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                    <img
                      src={`https://flagcdn.com/w20/${uni.code === "uk" ? "gb" : uni.code}.png`}
                      alt={`${uni.country} flag`}
                      className="w-4 h-3 rounded-sm object-cover"
                      loading="lazy"
                    />
                    <span className="text-xs text-slate-500 font-sans font-medium truncate">{uni.country}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{uni.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Est. {uni.established} &middot; {uni.students} students</span>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <a
                  href={`/countries#${uni.code}`}
                  className="text-xs font-semibold text-accent-blue hover:underline inline-flex items-center gap-1 font-sans"
                >
                  {countryLabels[uni.code] || uni.country} <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && filtered.length > visibleCount && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 bg-white text-slate-700 font-semibold text-sm rounded-full shadow-sm hover:border-accent-blue/30 hover:text-accent-blue transition-all duration-200 cursor-pointer hover:scale-[1.02]"
          >
            Load More Universities
          </button>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold font-display text-slate-600">No universities found</h3>
          <p className="text-sm text-slate-400 font-sans font-normal">Try selecting a different country filter.</p>
        </div>
      )}

      {!isLoading && activeCountry !== "all" && filtered.length > 0 && (
        <div className="mt-16 text-center">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/50 p-8 md:p-12 shadow-sm">
            <h2 className="text-[24px] sm:text-[28px] font-bold font-display text-slate-800 tracking-tight mb-3">
              Ready to start your journey?
            </h2>
            <p className="text-sm text-slate-600 font-sans font-normal max-w-md mx-auto mb-6">
              Get personalised guidance on applications, scholarships, and visa processes for your chosen universities.
            </p>
            <button
              type="button"
              onClick={() => (window as any).openCounsellorForm?.()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-white font-semibold text-sm rounded-full shadow-md hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              Speak to Our Counsellor <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
