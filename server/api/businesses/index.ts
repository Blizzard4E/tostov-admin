// server/api/business/all.get.ts
import { businesses } from "~/server/database/schema";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	const db = await useDrizzle();
	// Get all businesses, ordered by creation date (newest first)
	const businessList = await db
		.select()
		.from(businesses)
		.orderBy(desc(businesses.createdAt));

	return {
		success: true,
		businesses: businessList,
	};
});
