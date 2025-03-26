import { create } from "zustand";

interface BookState {
  seed: number;
  region: string;
  likes: number;
  reviews: number;
  setSeed: (seed: number) => void;
  setRegion: (region: string) => void;
  setLikes: (likes: number) => void;
  setReviews: (reviews: number) => void;
}

export const useBookStore = create<BookState>((set) => ({
  seed: 42,
  region: "en",
  likes: 5,
  reviews: 5,
  setSeed: (seed) => set({ seed }),
  setRegion: (region) => set({ region }),
  setLikes: (likes) => set({ likes }),
  setReviews: (reviews) => set({ reviews }),
}));
