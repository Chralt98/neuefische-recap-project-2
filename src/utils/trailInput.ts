import sanitizeHtml from "sanitize-html";
import { type Trail, type TrailFormData } from "../models/trailModel";

type TrailInput = {
  regionId?: string | number;
  title?: string;
  difficulty?: string;
  distanceKm?: string | number;
  description?: string;
  imageUrl?: string;
  slug?: string;
};

export const trailDifficulties: Trail["difficulty"][] = [
  "easy",
  "moderate",
  "hard",
];

export function isTrailDifficulty(
  value: unknown,
): value is Trail["difficulty"] {
  return (
    typeof value === "string" &&
    trailDifficulties.includes(value as Trail["difficulty"])
  );
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanText(value: string | undefined): string {
  return sanitizeHtml(value ?? "", {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

function cleanHtml(value: string | undefined): string {
  return sanitizeHtml(value ?? "", {
    allowedTags: ["p", "strong", "em", "ul", "ol", "li", "br"],
    allowedAttributes: {},
  }).trim();
}

export function buildTrailFormData(
  input: TrailInput,
  slugStrategy: "generate" | "preserve",
): TrailFormData {
  const title = cleanText(input.title);
  const difficulty = isTrailDifficulty(input.difficulty)
    ? input.difficulty
    : "easy";

  return {
    regionId: Number(input.regionId),
    title,
    slug:
      slugStrategy === "generate" ? createSlug(title) : cleanText(input.slug),
    difficulty,
    distanceKm: Number(input.distanceKm),
    description: cleanHtml(input.description),
    imageUrl: cleanText(input.imageUrl),
  };
}
