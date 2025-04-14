// server/api/categories/[category-id].put.ts
import { Category } from "~/composables/types/common";
import { APIResponse } from "~/composables/types/requests";
import { categories } from "~/server/database/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Validation schema for category update
const categoryUpdateSchema = z.object({
	name: z.string().min(1).max(255),
});

export default defineEventHandler(async (event): Promise<APIResponse> => {
	try {
		const categoryId = Number(getRouterParam(event, "category-id"));

		if (isNaN(categoryId) || categoryId <= 0) {
			return {
				status: 400,
				message: "Invalid category ID",
			};
		}

		const body = await readBody(event);

		// Validate input
		const validatedData = categoryUpdateSchema.safeParse(body);
		if (!validatedData.success) {
			return {
				status: 400,
				message:
					"Invalid category data: " + validatedData.error.message,
			};
		}

		const db = await useDrizzle();

		// Check if category exists
		const existingCategory = await db
			.select({ id: categories.id })
			.from(categories)
			.where(eq(categories.id, categoryId))
			.limit(1);

		if (existingCategory.length === 0) {
			return {
				status: 404,
				message: "Category not found",
			};
		}

		// Update category
		const updatedCategory = await db
			.update(categories)
			.set({
				name: validatedData.data.name,
			})
			.where(eq(categories.id, categoryId));

		return {
			status: 200,
			message: "Category updated successfully",
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
			message: "Failed to update category",
		};
	}
});
