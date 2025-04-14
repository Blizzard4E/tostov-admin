// server/api/location/create.post.ts
import {
	locations,
	images,
	videos,
	categoryOnLocations,
} from "~/server/database/schema";
import { ServerFile } from "nuxt-file-storage";

export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig();
	try {
		const db = await useDrizzle();
		const formData = await readMultipartFormData(event);

		if (!formData) {
			return createError({
				statusCode: 400,
				statusMessage: "Invalid form data",
			});
		}

		// Extract location data
		const locationData = {
			name: "",
			address: "",
			gmapLink: "",
			description: "",
			businessId: 0,
			categoryId: 0, // Single category ID
		};

		const imageFiles: ServerFile[] = [];
		const videoFiles: ServerFile[] = [];

		// Process form fields and files
		for (const part of formData) {
			if (
				part.type?.startsWith("application/json") &&
				part.name === "locationData"
			) {
				try {
					const parsedData = JSON.parse(
						Buffer.from(part.data).toString()
					);
					locationData.name = parsedData.name;
					locationData.address = parsedData.address;
					locationData.gmapLink = parsedData.gmapLink;
					locationData.description = parsedData.description;
					locationData.businessId = parseInt(parsedData.businessId);

					// Get category ID from JSON data if present
					if (parsedData.categoryId) {
						const categoryId = parseInt(
							parsedData.categoryId.toString()
						);
						if (!isNaN(categoryId)) {
							locationData.categoryId = categoryId;
						}
					}
				} catch (e) {
					return createError({
						statusCode: 400,
						statusMessage: "Invalid location data format",
					});
				}
			} else if (part.name === "images" && part.filename) {
				// Handle image files
				const fileContent = Buffer.from(part.data).toString("base64");
				imageFiles.push({
					name: part.filename,
					content: `data:${part.type};base64,${fileContent}`,
					size: part.data.length.toString(),
					type: part.type || "application/octet-stream",
					lastModified: new Date().toISOString(),
				});
			} else if (part.name === "videos" && part.filename) {
				// Handle video files
				const fileContent = Buffer.from(part.data).toString("base64");
				videoFiles.push({
					name: part.filename,
					content: `data:${part.type};base64,${fileContent}`,
					size: part.data.length.toString(),
					type: part.type || "application/octet-stream",
					lastModified: new Date().toISOString(),
				});
			} else if (part.name === "categoryId") {
				// Handle category ID from form field
				const value = Buffer.from(part.data).toString();
				const categoryId = parseInt(value);
				if (!isNaN(categoryId)) {
					locationData.categoryId = categoryId;
				}
			} else if (part.name) {
				// Handle regular form fields
				const value = Buffer.from(part.data).toString();
				switch (part.name) {
					case "name":
						locationData.name = value;
						break;
					case "address":
						locationData.address = value;
						break;
					case "gmapLink":
						locationData.gmapLink = value;
						break;
					case "description":
						locationData.description = value;
						break;
					case "businessId":
						locationData.businessId = parseInt(value);
						break;
				}
			}
		}

		// Validate required fields
		if (
			!locationData.name ||
			!locationData.address ||
			!locationData.businessId
		) {
			return createError({
				statusCode: 400,
				statusMessage: "Missing required location data",
			});
		}

		// Create the location
		const [newLocation] = await db
			.insert(locations)
			.values({
				name: locationData.name,
				address: locationData.address,
				gmapLink: locationData.gmapLink,
				description: locationData.description,
				businessId: locationData.businessId,
			})
			.$returningId();

		// Create category relationship if categoryId is provided
		let categoryId = null;
		if (locationData.categoryId > 0) {
			// Create category-location relation
			await db.insert(categoryOnLocations).values({
				locationId: newLocation.id,
				categoryId: locationData.categoryId,
				assignedAt: new Date(),
			});

			categoryId = locationData.categoryId;
		}

		// Store images and add to database
		const uploadedImages = [];
		for (const file of imageFiles) {
			const fileName = `${Date.now()}-${Math.random()
				.toString(36)
				.substring(2, 15)}`;
			const storedFile = await storeFileLocally(
				file,
				fileName,
				runtimeConfig.imagesLocation
			);

			// Get the URL path for the stored file
			const filePath = await getFileLocally(
				fileName,
				runtimeConfig.imagesLocation
			);

			// Create image record in database
			const [imageRecord] = await db
				.insert(images)
				.values({
					url: filePath,
					locationId: newLocation.id,
				})
				.$returningId();

			uploadedImages.push({
				id: imageRecord.id,
				url: filePath,
			});
		}

		// Store videos and add to database
		const uploadedVideos = [];
		for (const file of videoFiles) {
			const fileName = `${Date.now()}-${Math.random()
				.toString(36)
				.substring(2, 15)}`;
			const storedFile = await storeFileLocally(
				file,
				fileName,
				runtimeConfig.videosLocation
			);

			// Get the URL path for the stored file
			const filePath = await getFileLocally(
				fileName,
				runtimeConfig.videosLocation
			);

			// Create video record in database
			const [videoRecord] = await db
				.insert(videos)
				.values({
					url: filePath,
					locationId: newLocation.id,
				})
				.$returningId();

			uploadedVideos.push({
				id: videoRecord.id,
				url: filePath,
			});
		}

		return {
			success: true,
			location: newLocation,
			categoryId: categoryId,
			images: uploadedImages,
			videos: uploadedVideos,
		};
	} catch (error) {
		console.error("Create location error:", error);
		return createError({
			statusCode: 500,
			statusMessage: "Failed to create location",
		});
	}
});
