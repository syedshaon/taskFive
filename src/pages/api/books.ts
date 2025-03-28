import { NextApiRequest, NextApiResponse } from "next";
import { faker } from "@faker-js/faker";

import { faker as fakerES } from "@faker-js/faker/locale/es";
import { faker as fakerIT } from "@faker-js/faker/locale/it";

import { generateSpanishTitle, generateEnglishTitle, generateItalianTitle } from "./titleGenerator";

// Helper function to normalize the region
const normalizeRegion = (region: string): string => {
  const regionMap: Record<string, string> = {
    en: "English",
    es: "Spanish",
    it: "Italian",
  };
  return regionMap[region] || region; // Default to original input if not mapped
};

// Function to create a deterministic hash (optional)
const deterministicSeed = (seed: number, index: number) => seed + index * 31;

// Language-specific description generators
const generateDescription = (language: string, seed: number) => {
  faker.seed(seed); // Re-seed for consistency
  switch (language) {
    case "Spanish":
      return fakerES.lorem.paragraphs(2);
    case "Italian":
      return fakerIT.lorem.paragraphs(2);
    default:
      return faker.lorem.paragraphs(2);
  }
};

// Main generator functions
const generateBookTitle = (language: string, seed: number): string => {
  faker.seed(seed);
  switch (language) {
    case "Spanish":
      return generateSpanishTitle();
    case "Italian":
      return generateItalianTitle();
    default:
      return generateEnglishTitle();
  }
};

const generateAuthorName = (language: string, seed: number): string => {
  faker.seed(seed);
  switch (language) {
    case "Spanish":
      return `${fakerES.person.firstName()} ${fakerES.person.lastName()}`;
    case "Italian":
      return `${fakerIT.person.firstName()} ${fakerIT.person.lastName()}`;
    default:
      return `${faker.person.firstName()} ${faker.person.lastName()}`;
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { seed, page, region, likes, reviews, isbn } = req.query;

  const languageToGenerate = normalizeRegion(typeof region === "string" ? region : "");

  // Convert query params
  const pageNum = Number(page) || 1;
  const seedValue = Number(seed) || 42;
  const likesProbability = Number(likes) || 0;
  const reviewsProbability = Number(reviews) || 0;

  // Handle single book details by ISBN
  if (isbn) {
    const bookSeed = deterministicSeed(seedValue, 0);
    const bookDetails = {
      isbn,
      title: generateBookTitle(languageToGenerate, bookSeed),
      author: generateAuthorName(languageToGenerate, bookSeed),
      publisher: faker.company.name(),
      description: generateDescription(languageToGenerate, bookSeed),
      publishedDate: faker.date.past().toISOString().split("T")[0],
      pageCount: faker.number.int({ min: 100, max: 500 }),
      language: languageToGenerate,
      coverImage: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      reviews: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }).map(() => {
        const reviewSeed = deterministicSeed(bookSeed, Math.random() * 1000);
        faker.seed(reviewSeed);
        return {
          reviewer: faker.person.fullName(),
          comment: faker.lorem.sentence(),
          rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
        };
      }),
    };
    return res.status(200).json(bookDetails);
  }

  // Handle paginated book list
  let books = Array.from({ length: 20 }).map((_, i) => {
    const bookSeed = deterministicSeed(seedValue, i + (pageNum - 1) * 20);
    faker.seed(bookSeed); // Re-seed for each book
    return {
      index: (pageNum - 1) * 20 + i + 1,
      isbn: faker.string.numeric(10),
      title: generateBookTitle(languageToGenerate, bookSeed),
      author: generateAuthorName(languageToGenerate, bookSeed),
      publisher: faker.company.name(),
      coverImage: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
      language: languageToGenerate,
      likes: Math.random() < likesProbability / 10 ? Math.floor(Math.random() * 10) : 0,
      reviews: Math.random() < reviewsProbability / 10 ? Math.floor(Math.random() * 10) : 0,
    };
  });

  // Apply language filter
  if (region && typeof region === "string") {
    books = books.filter((book) => book.language.toLowerCase() === languageToGenerate.toLowerCase());
  }

  res.status(200).json(books);
}
