import { type RegionizedTrail } from "../models/trailModel";
import { formatDate } from "./formatDate";

export type TrailViewModel = RegionizedTrail & {
  formattedCreatedAt: string;
};

export function toTrailViewModel(trail: RegionizedTrail): TrailViewModel {
  return {
    ...trail,
    formattedCreatedAt: formatDate(trail.createdAt),
  };
}