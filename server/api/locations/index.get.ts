// server/api/locations/index.get.ts
import {
	locations,
	images,
	videos,
	categoryOnLocations,
	categories,
} from "~/server/database/schema";
import { desc, inArray, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	try {
		const db = await useDrizzle();
		// Fetch all locations, newest first
		const locationsList = await db
			.select()
			.from(locations)
			.orderBy(desc(locations.createdAt));

		// Get location IDs to fetch related media and categories
		const locationIds = locationsList.map((location) => location.id);

		// If no locations found, return early
		if (locationIds.length === 0) {
			return {
				success: true,
				locations: [],
			};
		}

		// Fetch related images
		const locationImages = await db
			.select()
			.from(images)
			.where(inArray(images.locationId, locationIds));

		// Fetch related videos
		const locationVideos = await db
			.select()
			.from(videos)
			.where(inArray(videos.locationId, locationIds));

		// Fetch related categories through the junction table
		const categoryRelations = await db
			.select({
				locationId: categoryOnLocations.locationId,
				categoryId: categoryOnLocations.categoryId,
				assignedAt: categoryOnLocations.assignedAt,
				categoryName: categories.name,
			})
			.from(categoryOnLocations)
			.innerJoin(
				categories,
				eq(categoryOnLocations.categoryId, categories.id)
			)
			.where(inArray(categoryOnLocations.locationId, locationIds));

		// Map images, videos, and categories to their respective locations
		const locationsWithMediaAndCategories = locationsList.map(
			(location) => {
				const locationImagesFiltered = locationImages.filter(
					(img) => img.locationId === location.id
				);

				const locationVideosFiltered = locationVideos.filter(
					(vid) => vid.locationId === location.id
				);

				const locationCategoriesFiltered = categoryRelations
					.filter((cat) => cat.locationId === location.id)
					.map((relation) => ({
						id: relation.categoryId,
						name: relation.categoryName,
						assignedAt: relation.assignedAt,
					}));

				return {
					...location,
					images: locationImagesFiltered,
					videos: locationVideosFiltered,
					categories: locationCategoriesFiltered,
				};
			}
		);

		return {
			success: true,
			locations: locationsWithMediaAndCategories,
		};
	} catch (error) {
		console.error("Get all locations error:", error);
		return createError({
			statusCode: 500,
			statusMessage: "Failed to fetch locations",
		});
	}
});
