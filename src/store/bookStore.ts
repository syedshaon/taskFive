import { create } from "zustand";

interface Book {
  index: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  language: string;
  coverImage: string; // Added coverImage property
}
interface BookState {
  seed: number;
  region: string;
  likes: number;
  reviews: number;
  setSeed: (seed: number) => void;
  setRegion: (region: string) => void;
  setLikes: (likes: number) => void;
  setReviews: (reviews: number) => void;
  viewMode: "table" | "gallery";
  setViewMode: (mode: "table" | "gallery") => void;
  coverImage: string;

  isLoading: boolean;
  books: Book[];
  setBooks: (books: Book[]) => void;
  appendBooks: (newBooks: Book[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useBookStore = create<BookState>((set) => ({
  seed: 42,
  region: "en", // Change to match API expectations
  likes: 5,
  reviews: 5,
  setSeed: (seed) => set({ seed }),
  // In your store actions
  setRegion: (region) =>
    set({
      region: region.toLowerCase(),
      books: [], // Clear books when language changes
      isLoading: false,
    }),
  setLikes: (likes) => set({ likes }),
  setReviews: (reviews) => set({ reviews }),
  viewMode: "table",
  setViewMode: (mode) => set({ viewMode: mode }),
  coverImage: "https://picsum.photos/200/300", // Default image

  isLoading: false,
  books: [],
  setBooks: (books) => set({ books }),
  appendBooks: (newBooks) => set((state) => ({ books: [...state.books, ...newBooks] })),
  setLoading: (isLoading) => set({ isLoading }),
}));
