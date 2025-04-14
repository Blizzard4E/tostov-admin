// server/api/categories/[category-id].delete.ts
import { APIResponse } from "~/composables/types/requests";
import { categories } from "~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<APIResponse> => {
	try {
		const categoryId = Number(getRouterParam(event, "category-id"));

		if (isNaN(categoryId) || categoryId <= 0) {
			return {
				status: 400,
				message: "Invalid category ID",
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

		// Delete the category
		await db.delete(categories).where(eq(categories.id, categoryId));

		return {
			status: 200,
			message: "Category successfully deleted",
		};
	} catch (error) {
		// Handle foreign key constraint errors
		if (
			error instanceof Error &&
			error.message.includes("foreign key constraint")
		) {
			return {
				status: 409,
				message: "This category is being used by one or more locations",
			};
		}

		return {
			status: 500,
			message: "Failed to delete category",
		};
	}
});
