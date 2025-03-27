import { NextApiRequest, NextApiResponse } from "next";
import { faker } from "@faker-js/faker";

const normalizeRegion = (region: string): string => {
  const regionMap: Record<string, string> = {
    en: "English",
    fr: "French",
    de: "German",
  };
  return regionMap[region] || region; // Default to original input if not mapped
};

// const filteredBooks = allBooks.filter((book) => book.language.toLowerCase() === normalizeRegion(region).toLowerCase());

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { seed, page, region, likes, reviews, isbn } = req.query;

  // If an ISBN is provided, return details for that specific book
  if (isbn) {
    const bookDetails = {
      isbn,
      title: faker.lorem.words(3),
      author: faker.person.fullName(),
      publisher: faker.company.name(),
      description: faker.lorem.paragraph(),
      publishedDate: faker.date.past().toISOString().split("T")[0],
      pageCount: faker.number.int({ min: 100, max: 500 }),
      language: faker.helpers.arrayElement(["English", "French", "German"]), // ✅ Make sure this is included
      coverImage: faker.image.urlPicsumPhotos({ width: 200, height: 300 }), // Book cover
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
    title: faker.lorem.words(3),
    author: faker.person.fullName(),
    publisher: faker.company.name(),
    coverImage: faker.image.urlPicsumPhotos({ width: 200, height: 300 }), // Book cover
    language: faker.helpers.arrayElement(["English", "French", "German"]), // ✅ Add language field
    likes: Math.random() < likesProbability / 10 ? Math.floor(Math.random() * 10) : 0,
    reviews: Math.random() < reviewsProbability / 10 ? Math.floor(Math.random() * 10) : 0,
  }));

  // ✅ Apply filtering only if `region` is provided
  if (region && typeof region === "string") {
    books = books.filter((book) => book.language.toLowerCase() === normalizeRegion(region).toLowerCase());
  }

  res.status(200).json(books);
}
