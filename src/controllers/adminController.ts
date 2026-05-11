import { type Request, type Response } from "express";
import sanitizeHtml from "sanitize-html";
import { getAllRegions } from "../models/regionModel";
import {
  addTrail,
  deleteTrail,
  getAllTrails,
  getTrailById,
  updateTrail,
  type Trail,
  type TrailFormData,
} from "../models/trailModel";

type TrailFormBody = {
  regionId?: string;
  title?: string;
  difficulty?: string;
  distanceKm?: string;
  description?: string;
  imageUrl?: string;
};

const difficulties: Trail["difficulty"][] = ["easy", "moderate", "hard"];

function createSlug(title: string): string {
  // g means global replacement
  return (
    title
      .toLowerCase()
      .trim()
      // Replaces every group of characters that is not a lowercase letter or number with -.
      .replace(/[^a-z0-9]+/g, "-")
      // Removes dashes from the start or end of the string.
      .replace(/^-+|-+$/g, "")
  );
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

function getTrailData(body: TrailFormBody): TrailFormData {
  const title = cleanText(body.title);
  const difficulty = difficulties.includes(
    body.difficulty as Trail["difficulty"],
  )
    ? (body.difficulty as Trail["difficulty"])
    : "easy";

  return {
    regionId: Number(body.regionId),
    title,
    slug: createSlug(title),
    difficulty,
    distanceKm: Number(body.distanceKm),
    description: cleanHtml(body.description),
    imageUrl: cleanText(body.imageUrl),
  };
}

export async function showAdminTrailList(req: Request, res: Response) {
  try {
    const trails = await getAllTrails();
    res.render("admin/list.html", { trails });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch trails");
  }
}

export async function showNewTrailForm(req: Request, res: Response) {
  try {
    const regions = await getAllRegions();
    res.render("admin/form.html", {
      action: "/admin/trails",
      formTitle: "Add trail",
      regions,
      trail: undefined,
      difficulties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load trail form");
  }
}

// Request<Params, ResponseBody, RequestBody, Query>
export async function createTrail(
  req: Request<{}, {}, TrailFormBody>,
  res: Response,
) {
  try {
    await addTrail(getTrailData(req.body));
    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create trail");
  }
}

export async function showEditTrailForm(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const trail = await getTrailById(Number(req.params.id));
    if (!trail) {
      return res.status(404).send("Trail not found");
    }

    const regions = await getAllRegions();
    res.render("admin/form.html", {
      action: `/admin/trails/${trail.id}`,
      formTitle: "Edit trail",
      regions,
      trail,
      difficulties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load trail form");
  }
}

export async function saveTrail(
  req: Request<{ id: string }, {}, TrailFormBody>,
  res: Response,
) {
  try {
    await updateTrail(Number(req.params.id), getTrailData(req.body));
    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update trail");
  }
}

export async function removeTrail(req: Request<{ id: string }>, res: Response) {
  try {
    await deleteTrail(Number(req.params.id));
    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to delete trail");
  }
}
