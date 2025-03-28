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

// Language-specific description generators
const generateEnglishDescription = () => {
  return faker.lorem.paragraphs(2);
};

const generateSpanishDescription = () => {
  return fakerES.lorem.paragraphs(2);
};

const generateItalianDescription = () => {
  return fakerIT.lorem.paragraphs(2);
};

// Main generator functions
const generateBookTitle = (language: string): string => {
  switch (language) {
    case "Spanish":
      return generateSpanishTitle();
    case "Italian":
      return generateItalianTitle();
    default:
      return generateEnglishTitle();
  }
};

const generateBookDetails = (language: string): string => {
  switch (language) {
    case "Spanish":
      return generateSpanishDescription();
    case "Italian":
      return generateItalianDescription();
    default:
      return generateEnglishDescription();
  }
};

const generateAuthorName = (language: string): string => {
  switch (language) {
    case "Spanish":
      return `${fakerES.person.firstName()} ${fakerES.person.lastName()}`;
    case "Italian":
      return `${fakerIT.person.firstName()} ${fakerIT.person.lastName()}`;
    default:
      return `${faker.person.firstName()} ${faker.person.lastName()}`;
  }
};

// Rest of your handler remains the same...

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { seed, page, region, likes, reviews, isbn } = req.query;

  // console.log("Request Query:", req.query);

  const languageToGenerate = normalizeRegion(typeof region === "string" ? region : "");
  // console.log("Normalized Language:", normalizeRegion(languageToGenerate));

  // If an ISBN is provided, return details for that specific book
  if (isbn) {
    const bookDetails = {
      isbn,
      title: generateBookTitle(languageToGenerate),
      author: generateAuthorName(languageToGenerate),
      publisher: faker.company.name(),
      description: generateBookDetails(languageToGenerate),
      publishedDate: faker.date.past().toISOString().split("T")[0],
      pageCount: faker.number.int({ min: 100, max: 500 }),
      language: normalizeRegion(languageToGenerate),
      coverImage: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      reviews: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }).map(() => ({
        reviewer: faker.person.fullName(),
        comment: faker.lorem.sentence(),
        rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      })),
    };

    return res.status(200).json(bookDetails);
  }

  // Handle paginated book list requests
  const pageNum = Number(page) || 1;
  const seedValue = Number(seed) || 42;
  const likesProbability = Number(likes) || 0;
  const reviewsProbability = Number(reviews) || 0;

  faker.seed(seedValue + pageNum); // Seed for consistent results

  let books = Array.from({ length: 20 }).map((_, i) => ({
    index: (pageNum - 1) * 20 + i + 1,
    isbn: faker.string.numeric(10),
    title: generateBookTitle(languageToGenerate),
    author: generateAuthorName(languageToGenerate),
    publisher: faker.company.name(),
    coverImage: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
    language: languageToGenerate,
    likes: Math.random() < likesProbability / 10 ? Math.floor(Math.random() * 10) : 0,
    reviews: Math.random() < reviewsProbability / 10 ? Math.floor(Math.random() * 10) : 0,
  }));

  // Apply language filter based on region
  if (region && typeof region === "string") {
    books = books.filter((book) => book.language.toLowerCase() === normalizeRegion(region).toLowerCase());
  }

  // If the number of books found is less than 20, generate more of the same language
  if (books.length < 20) {
    const remainingBooksToGenerate = 20 - books.length;

    // Generate additional books of the same language
    const additionalBooks = Array.from({ length: remainingBooksToGenerate }).map((_, i) => ({
      index: books.length + i + 1,
      isbn: faker.string.numeric(10),
      title: generateBookTitle(languageToGenerate),
      author: generateAuthorName(languageToGenerate),
      publisher: faker.company.name(),
      coverImage: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
      language: languageToGenerate, // Ensure these are of the same language
      likes: Math.random() < likesProbability / 10 ? Math.floor(Math.random() * 10) : 0,
      reviews: Math.random() < reviewsProbability / 10 ? Math.floor(Math.random() * 10) : 0,
    }));

    // Append the additional books to the existing ones
    books = [...books, ...additionalBooks];
  }

  res.status(200).json(books);
}
