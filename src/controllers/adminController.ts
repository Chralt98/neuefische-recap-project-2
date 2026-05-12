import { type Request, type Response } from "express";
import { getAllRegions } from "../models/regionModel";
import {
  addTrail,
  deleteTrail,
  getAllTrails,
  getTrailById,
  updateTrail,
} from "../models/trailModel";
import {
  buildTrailFormData,
  trailDifficulties as difficulties,
} from "../utils/trailInput";

type TrailFormBody = {
  regionId?: string;
  title?: string;
  difficulty?: string;
  distanceKm?: string;
  description?: string;
  imageUrl?: string;
};

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
    await addTrail(buildTrailFormData(req.body, "generate"));
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
    await updateTrail(
      Number(req.params.id),
      buildTrailFormData(req.body, "generate"),
    );
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
