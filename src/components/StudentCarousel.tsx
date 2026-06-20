import React from "react";
import SocialCards, { type CardItem } from "./ui/card-fan-carousel";

interface D1Story {
  id: number;
  name: string;
  photo: string;
  type: string; // "Visa Success", "IELTS", "PTE", or "Video"
  score?: string | null;
  country?: string | null;
  video_url?: string | null;
  is_video?: boolean;
}

const fallbackStories: D1Story[] = [
  {
    id: 1,
    name: "Aarav Patel",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&h=600&auto=format&fit=crop",
    type: "IELTS",
    score: "8.0",
    country: null
  },
  {
    id: 2,
    name: "Sneha Reddy",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=600&auto=format&fit=crop",
    type: "PTE",
    score: "84",
    country: null
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=600&auto=format&fit=crop",
    type: "Visa Success",
    score: null,
    country: "United Kingdom"
  },
  {
    id: 4,
    name: "Meera Krishnan",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=600&auto=format&fit=crop",
    type: "IELTS",
    score: "7.5",
    country: null
  },
  {
    id: 5,
    name: "Kabir Mehra",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=600&auto=format&fit=crop",
    type: "PTE",
    score: "79",
    country: null
  },
  {
    id: 6,
    name: "Jaspreet Kaur",
    photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&h=600&auto=format&fit=crop",
    type: "Visa Success",
    score: null,
    country: "Canada"
  },
  {
    id: 7,
    name: "Rohan Desai",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&h=600&auto=format&fit=crop",
    type: "IELTS",
    score: "8.5",
    country: null
  },
  {
    id: 8,
    name: "Priya Sharma",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=600&auto=format&fit=crop",
    type: "Visa Success",
    score: null,
    country: "Australia"
  },
  {
    id: 9,
    name: "Arjun Nair",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=600&auto=format&fit=crop",
    type: "PTE",
    score: "90",
    country: null
  }
];

/** Convert D1Story data to CardItem format for the fan carousel */
function storiesToCards(stories: D1Story[]): CardItem[] {
  return stories.map((s) => ({
    imgUrl: s.photo,
    alt: s.name,
    linkUrl: s.is_video && s.video_url ? s.video_url : undefined,
  }));
}

export default function StudentCarousel({ stories = [] }: { stories?: D1Story[] }) {
  const activeStories = stories && stories.length > 0 ? stories : fallbackStories;
  const cards = storiesToCards(activeStories);

  return (
    <div className="w-full py-10 bg-white overflow-hidden font-sans border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-4 text-center">
        <span className="text-xs font-semibold tracking-wider text-[#F08A00] uppercase bg-[#FFE5CC] px-4 py-1.5 rounded-full border border-[#F08A00]/20 font-sans">
          TESCA Success Stories
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-800 mt-4 tracking-tight">
          Real Students. Real Approvals. Real Futures.
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto font-sans font-normal mt-2 leading-relaxed">
          Explore recent visa approvals and language proficiency achievements from our successful candidates.
        </p>
      </div>

      <SocialCards cards={cards} />
    </div>
  );
}
