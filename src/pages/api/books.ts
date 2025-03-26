import { NextApiRequest, NextApiResponse } from "next";
import { faker } from "@faker-js/faker";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { seed, page, region, likes, reviews } = req.query;
  const pageNum = Number(page) || 1;
  const seedValue = Number(seed) || 42;
  const likesProbability = Number(likes) || 0;
  const reviewsProbability = Number(reviews) || 0;

  // Set seed for faker (deprecated in new versions, ensure you have correct version)
  faker.seed(seedValue + pageNum);

  // Set locale manually using locale-specific imports
  let localizedFaker = faker;
  if (region === "fr") localizedFaker = require("@faker-js/faker/locale/fr").faker;
  else if (region === "de") localizedFaker = require("@faker-js/faker/locale/de").faker;

  const books = Array.from({ length: 20 }).map((_, i) => ({
    index: (pageNum - 1) * 20 + i + 1,
    isbn: localizedFaker.string.numeric(10),
    title: localizedFaker.lorem.words(3),
    author: localizedFaker.person.fullName(),
    publisher: localizedFaker.company.name(),
    likes: Math.random() < likesProbability / 10 ? Math.floor(Math.random() * 10) : 0,
    reviews: Math.random() < reviewsProbability / 10 ? Math.floor(Math.random() * 10) : 0,
  }));

  res.status(200).json(books);
}
