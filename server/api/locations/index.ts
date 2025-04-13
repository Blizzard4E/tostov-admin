// server/api/locations/index.get.ts
import { locations, images, videos } from "~/server/database/schema";
import { desc, inArray, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	try {
		const db = await useDrizzle();

		// Fetch all locations, newest first
		const locationsList = await db
			.select()
			.from(locations)
			.orderBy(desc(locations.createdAt));

		// Get location IDs to fetch related media
		const locationIds = locationsList.map((location) => location.id);

		// If no locations found, return early
		if (locationIds.length === 0) {
			return {
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

		// Map images and videos to their respective locations
		const locationsWithMedia = locationsList.map((location) => {
			const locationImagesFiltered = locationImages.filter(
				(img) => img.locationId === location.id
			);

			const locationVideosFiltered = locationVideos.filter(
				(vid) => vid.locationId === location.id
			);

			return {
				...location,
				images: locationImagesFiltered,
				videos: locationVideosFiltered,
			};
		});

		return {
			success: true,
			locations: locationsWithMedia,
		};
	} catch (error) {
		console.error("Get all locations error:", error);
		return createError({
			statusCode: 500,
			statusMessage: "Failed to fetch locations",
		});
	}
});
