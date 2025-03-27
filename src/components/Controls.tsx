"use client";
import { useBookStore } from "@/store/bookStore";

export default function Controls() {
  const { seed, region, likes, reviews, setSeed, setRegion, setLikes, setReviews } = useBookStore();

  return (
    <div className="flex gap-4 p-4">
      <button onClick={() => setSeed(Math.floor(Math.random() * 100000))}>🔀 Random Seed</button>
      <input type="number" value={seed} onChange={(e) => setSeed(parseInt(e.target.value))} />
      <select
        value={region}
        onChange={(e) => {
          console.log("Selected region:", e.target.value); // Add this
          setRegion(e.target.value);
        }}
      >
        <option value="en">English (USA)</option>
        <option value="es">Spanish (Spain)</option>
        <option value="it">Italian (Italy)</option>
      </select>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <span>Likes</span>
        <input type="range" min="0" max="10" step="0.1" value={likes} onChange={(e) => setLikes(parseFloat(e.target.value))} />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <span>Reviews</span>
        <input type="number" min="0" max="10" step="0.1" value={reviews} onChange={(e) => setReviews(parseFloat(e.target.value))} />
      </div>
    </div>
  );
}
