// server/api/categories/index.post.ts
import { Category } from "~/composables/types/common";
import { APIResponse } from "~/composables/types/requests";
import { categories } from "~/server/database/schema";
import { z } from "zod";

// Validation schema for category
const categorySchema = z.object({
	name: z.string().min(1).max(255),
});

export default defineEventHandler(async (event): Promise<APIResponse> => {
	try {
		const body = await readBody(event);

		// Validate input
		const validatedData = categorySchema.safeParse(body);
		if (!validatedData.success) {
			return {
				status: 400,
				message:
					"Invalid category data: " + validatedData.error.message,
			};
		}

		const db = await useDrizzle();

		// Insert new category
		const newCategory = await db.insert(categories).values({
			name: validatedData.data.name,
		});

		return {
			status: 201,
			message: "Category created successfully",
		};
	} catch (error) {
		// Check for unique constraint violation
		if (
			error instanceof Error &&
			error.message.includes("Duplicate entry")
		) {
			return {
				status: 409,
				message: "A category with this name already exists",
			};
		}

		return {
			status: 500,
			message: "Failed to create category",
		};
	}
});
