import { Category } from "~/composables/types/common";
import { APIResponse } from "~/composables/types/requests";
import { categories } from "~/server/database/schema";

export default defineEventHandler(
	async (event): Promise<APIResponse<Category[]>> => {
		try {
			const db = await useDrizzle();
			const allCategories = await db.select().from(categories);
			return {
				status: 200,
				message: "Categories fetched successfully",
				data: allCategories,
			};
		} catch (error) {
			return {
				status: 200,
				message: "Failed to fetch categories",
			};
		}
	}
);
