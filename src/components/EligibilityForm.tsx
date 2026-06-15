import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Landmark, Award, Globe, Phone, Mail, User, 
  ArrowRight, ArrowLeft, Loader2, Star, MapPin, Sparkles, AlertCircle 
} from "lucide-react";

interface ProfileFormData {
  score: number;
  ielts: number;
  budget: number;
  destination: string;
  name: string;
  email: string;
  phone: string;
}

interface UniversityMatch {
  id: number;
  name: string;
  country: string;
  code: string;
  rank: number;
  domain: string;
  city: string;
  established: number;
  students: string;
  tuition_fee_min: number;
  tuition_fee_max: number;
  min_gpa_percent: number;
  min_ielts: number;
  highlights: string; // JSON string
}

const COUNTRIES = [
  { value: "all", label: "All Destinations", flag: "🌎" },
  { value: "us", label: "USA", flag: "🇺🇸" },
  { value: "uk", label: "United Kingdom", flag: "🇬🇧" },
  { value: "ca", label: "Canada", flag: "🇨🇦" },
  { value: "au", label: "Australia", flag: "🇦🇺" },
  { value: "de", label: "Germany", flag: "🇩🇪" },
  { value: "ie", label: "Ireland", flag: "🇮🇪" },
  { value: "nz", label: "New Zealand", flag: "🇳🇿" },
  { value: "sg", label: "Singapore", flag: "🇸🇬" },
  { value: "ae", label: "Dubai", flag: "🇦🇪" },
];

export default function EligibilityForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    matches: UniversityMatch[];
    reachMatches: UniversityMatch[];
  } | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      score: 75,
      ielts: 6.5,
      budget: 20,
      destination: "all",
    }
  });

  const selectedDestination = watch("destination");
  const currentBudget = watch("budget");
  const currentScore = watch("score");
  const currentIelts = watch("ielts");

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    // Validate Step 1 fields
    if (currentScore < 50 || currentScore > 100) return;
    if (currentIelts < 4.0 || currentIelts > 9.0) return;
    if (currentBudget < 2 || currentBudget > 100) return;
    setStep(2);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setResults({
          matches: resData.matches,
          reachMatches: resData.reachMatches,
        });
        setStep(3);
      } else {
        alert(resData.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Match submission failed:", err);
      alert("Failed to query eligible universities. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[500px]">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: ACADEMIC & FINANCIAL PROFILE */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-slate-200/80 bg-white shadow-xl text-left"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Step 1 of 2</span>
                <h2 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight leading-tight">Your Academic & Budget Profile</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Sliders */}
              <div className="space-y-6">
                {/* Academic Score Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 font-sans">Academic Score (Percentage/GPA)</label>
                    <span className="text-sm font-extrabold text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full font-sans">{currentScore}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="100" 
                    step="1"
                    {...register("score", { required: true, min: 50, max: 100 })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">
                    <span>Pass (50%)</span>
                    <span>Excellent (100%)</span>
                  </div>
                </div>

                {/* IELTS/TOEFL Band Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 font-sans">IELTS Band (or TOEFL Equivalent)</label>
                    <span className="text-sm font-extrabold text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full font-sans">{parseFloat(currentIelts.toString()).toFixed(1)} Band</span>
                  </div>
                  <input 
                    type="range" 
                    min="4.5" 
                    max="9.0" 
                    step="0.5"
                    {...register("ielts", { required: true, min: 4.5, max: 9.0 })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">
                    <span>4.5 Band</span>
                    <span>9.0 Band</span>
                  </div>
                </div>

                {/* Budget Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 font-sans">Yearly Tuition Budget (in Lakhs INR)</label>
                    <span className="text-sm font-extrabold text-[#F08A00] bg-[#FFE5CC] px-3 py-1 rounded-full font-sans">{currentBudget} Lakhs/yr</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="1"
                    {...register("budget", { required: true, min: 5, max: 50 })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#F08A00]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">
                    <span>5 Lakhs (~$6K)</span>
                    <span>50 Lakhs (~$60K)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Destination Grid */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 font-sans block">Preferred Destination</label>
                <div className="grid grid-cols-2 gap-3">
                  {COUNTRIES.map(c => {
                    const isSelected = selectedDestination === c.value;
                    return (
                      <label 
                        key={c.value} 
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-accent-blue/10 border-accent-blue text-accent-blue shadow-sm" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <input 
                          type="radio" 
                          value={c.value} 
                          {...register("destination")} 
                          className="sr-only"
                        />
                        <span className="text-lg">{c.flag}</span>
                        <span className="font-sans text-[13px]">{c.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-[#F08A00] hover:bg-[#C06E00] text-white font-bold text-sm rounded-full shadow-md hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 cursor-pointer font-sans tracking-wide"
              >
                <span>Continue to Contact Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: LEAD CAPTURE FORM */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-slate-200/80 bg-white shadow-xl text-left max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Step 2 of 2</span>
                <h2 className="text-2xl font-extrabold font-display text-slate-800 tracking-tight leading-tight">Where should we send your matches?</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("name", { required: "Full name is required" })}
                    className={`w-full bg-white border ${errors.name ? "border-red-400" : "border-slate-200"} rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all font-sans`}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-red-500 font-sans font-medium">{errors.name.message}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="john.doe@email.com"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: { value: /\S+@\S+\.\S+/, message: "Please enter a valid email" }
                    })}
                    className={`w-full bg-white border ${errors.email ? "border-red-400" : "border-slate-200"} rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all font-sans`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-sans font-medium">{errors.email.message}</p>}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="10 Digit Mobile Number"
                    maxLength={10}
                    {...register("phone", { 
                      required: "Mobile number is required",
                      pattern: { value: /^[0-9]{10}$/, message: "Phone number must be exactly 10 digits" }
                    })}
                    className={`w-full bg-white border ${errors.phone ? "border-red-400" : "border-slate-200"} rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all font-sans`}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-sans font-medium">{errors.phone.message}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-full border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer font-sans flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-grow py-3 bg-[#F08A00] hover:bg-[#C06E00] disabled:bg-[#F08A00]/60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-full shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Matching Profile...
                    </>
                  ) : (
                    <>
                      <span>Find Eligible Universities</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        )}

        {/* STEP 3: MATCH RESULTS DASHBOARD */}
        {step === 3 && results && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="space-y-10 text-left"
          >
            {/* Header Result Summary Banner */}
            <div className="glass-card rounded-[2rem] p-8 bg-gradient-to-br from-[#E6F2F3] to-white border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 font-sans">
                  <Sparkles className="w-3.5 h-3.5" />
                  Profile Analyzed Successfully
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold font-display text-slate-800 tracking-tight leading-none">
                  Your Eligible Universities
                </h2>
                <p className="text-sm text-slate-500 font-sans max-w-xl">
                  Matched against academic threshold: <strong className="text-slate-800">{currentScore}%</strong>, English proficiency: <strong className="text-slate-800">{currentIelts} IELTS</strong>, and yearly budget: <strong className="text-slate-800">{currentBudget} Lakhs</strong>.
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-sm shrink-0 font-sans cursor-pointer hover:scale-[1.02]"
              >
                Re-calculate Profile
              </button>
            </div>

            {/* Exact matches list */}
            {results.matches.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent-cyan fill-accent-cyan" />
                  <h3 className="text-lg font-bold font-display text-slate-800">Exact Database Matches ({results.matches.length})</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.matches.map(uni => (
                    <UniversityCard key={uni.id} uni={uni} />
                  ))}
                </div>
              </div>
            ) : (
              // Empty matched state
              <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-10 text-center space-y-4 max-w-xl mx-auto font-sans">
                <AlertCircle className="w-16 h-16 text-[#F08A00] mx-auto animate-pulse" />
                <h3 className="text-xl font-bold font-display text-slate-700">No Direct Matches Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We couldn't find universities that fit exactly within your tuition budget or score brackets. Try checking our **Reach Recommendations** below or consult with our experts.
                </p>
              </div>
            )}

            {/* Reach matches list */}
            {results.reachMatches.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-blue" />
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-800">Reach Recommendations ({results.reachMatches.length})</h3>
                    <p className="text-[11px] text-slate-400 font-sans">These universities require slightly higher scores or budget, but offer excellent programs for your destination preference.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
                  {results.reachMatches.map(uni => (
                    <UniversityCard key={uni.id} uni={uni} isReach={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Final CTA Banner */}
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 shadow-lg text-center text-white relative overflow-hidden font-sans">
              <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-accent-blue/10 to-transparent pointer-events-none"></div>
              <div className="space-y-4 relative z-10">
                <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight leading-tight">
                  Unlock your global pathway with personalized guidance
                </h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
                  Every application has unique opportunities. Our expert counsellors help students secure visa approvals, negotiate scholarships, and compile stellar profiles.
                </p>
                <button
                  onClick={() => (window as any).openCounsellorForm?.()}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#F08A00] hover:bg-[#C06E00] text-white font-semibold text-sm rounded-full shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] font-sans"
                >
                  Speak to Our Counsellor <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// Single University Card Component
function UniversityCard({ uni, isReach = false }: { uni: UniversityMatch; isReach?: boolean }) {
  const highlightsList = uni.highlights ? JSON.parse(uni.highlights) : [];
  
  return (
    <div className={`rounded-2xl border ${isReach ? "border-amber-200 bg-amber-50/10 shadow-xs" : "border-slate-200 bg-white shadow-sm"} flex flex-col justify-between overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300 group`}>
      <div className="p-5 flex items-start gap-4">
        
        {/* Logo box */}
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm bg-white p-1">
          <img 
            src={`https://logo.clearbit.com/${uni.domain}`}
            alt={`${uni.name} logo`}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?sz=64&domain=${uni.domain}`;
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h4 className="text-sm font-bold font-display text-slate-800 leading-snug line-clamp-2">{uni.name}</h4>
            <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full shrink-0 font-sans">
              #{uni.rank}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-sans">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{uni.city}, {uni.country}</span>
          </div>
        </div>

      </div>

      {/* Highlights & Details */}
      <div className="px-5 pb-4 space-y-3 flex-grow text-xs">
        
        {/* Tuition Fee Range */}
        <div className="bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl flex items-center justify-between font-sans">
          <span className="text-slate-400 font-medium">Estimated Tuition</span>
          <span className="font-bold text-slate-800">
            {uni.tuition_fee_min === 0 ? "Free / Low" : `$${(uni.tuition_fee_min/1000).toFixed(0)}k - $${(uni.tuition_fee_max/1000).toFixed(0)}k /yr`}
          </span>
        </div>

        {/* Custom requirements badges */}
        <div className="flex flex-wrap gap-1.5 font-sans">
          <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full text-[9px] border border-slate-200">
            Min GPA: {uni.min_gpa_percent}%
          </span>
          <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full text-[9px] border border-slate-200">
            IELTS: {uni.min_ielts}
          </span>
        </div>

        {/* Highlight points */}
        {highlightsList.length > 0 && (
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-sans space-y-1 leading-relaxed">
            {highlightsList.map((h: string, idx: number) => (
              <div key={idx} className="flex items-start gap-1">
                <span className="text-[#F08A00] mt-0.5">•</span>
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Button Action */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => (window as any).openCounsellorForm?.()}
          className="text-xs font-bold text-accent-blue hover:underline inline-flex items-center gap-1 font-sans cursor-pointer"
        >
          <span>Get Consultation for {uni.name.split(" ")[0]}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
