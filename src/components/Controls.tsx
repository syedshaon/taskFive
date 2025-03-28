"use client";

import { useBookStore } from "@/store/bookStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FaTable } from "react-icons/fa";
import { BsGrid1X2Fill } from "react-icons/bs";
import { FaCloudDownloadAlt } from "react-icons/fa";

import Papa from "papaparse";

// <FaCloudDownloadAlt />
export default function Controls() {
  const { seed, region, likes, reviews, setSeed, setRegion, setLikes, setReviews, viewMode, setViewMode, books } = useBookStore();

  const handleExportCSV = () => {
    if (books.length === 0) {
      alert("No books to export!");
      return;
    }
    // Prepare the data for CSV
    const csvData = books.map((book) => ({
      ISBN: book.isbn,
      Title: book.title,
      Author: book.author,
      Publisher: book.publisher,
      Language: book.language || "Unknown",
    }));

    // Create CSV
    const csv = Papa.unparse(csvData, {
      header: true,
      delimiter: ",",
    });

    // Create download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `books_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-3 mb-3">
      <CardContent className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
        <div className="flex items-center gap-2">
          {/* Region Select */}
          <Select
            value={region}
            onValueChange={(value) => {
              console.log("Selected region:", value);
              setRegion(value);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (USA)</SelectItem>
              <SelectItem value="es">Spanish (Spain)</SelectItem>
              <SelectItem value="it">Italian (Italy)</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="seed-input" className="whitespace-nowrap">
            Seed:
          </Label>
          <Input id="seed-input" type="number" value={seed} onChange={(e) => setSeed(parseInt(e.target.value) || 0)} className="w-24" placeholder="Random seed" />
        </div>
        {/* Random Seed Button */}
        <Button onClick={() => setSeed(Math.floor(Math.random() * 100000))} variant="outline">
          🔀 Randomize Seed
        </Button>

        {/* Likes Slider */}
        <div className="flex flex-col lg:flex-row items-center  gap-2 w-48 mx-3">
          <Label>Likes</Label>
          <Slider min={0} max={10} step={0.1} value={[likes]} onValueChange={(value) => setLikes(value[0])} />
        </div>

        {/* Reviews Input */}
        <div className="flex flex-col lg:flex-row items-center gap-2 w-32">
          <Label>Reviews</Label>
          <Input type="number" min="0" max="10" step="0.1" value={reviews} onChange={(e) => setReviews(parseFloat(e.target.value))} />
        </div>
      </CardContent>
      {/* View Toggle */}
      <div className="flex gap-2 md:ml-auto justify-center md:justify-end md:mt-0 mt-4">
        <Button variant="outline" onClick={handleExportCSV} className="gap-2 mr-5">
          <FaCloudDownloadAlt className="h-4 w-4" />
          Export CSV
        </Button>
        <Button className="cursor-pointer" variant={viewMode === "table" ? "default" : "outline"} onClick={() => setViewMode("table")} size="icon">
          <FaTable className="h-6 w-6" />
        </Button>
        <Button className="cursor-pointer" variant={viewMode === "gallery" ? "default" : "outline"} onClick={() => setViewMode("gallery")} size="icon">
          <BsGrid1X2Fill className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
