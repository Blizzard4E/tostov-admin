// server/api/business/create.post.ts
import { businesses } from "~/server/database/schema";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
	try {
		const db = await useDrizzle();
		const body = await readBody(event);

		// Validate required fields
		if (!body.name || !body.email || !body.password) {
			return createError({
				statusCode: 400,
				statusMessage: "Name, email, and password are required",
			});
		}

		// Hash the password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(body.password, saltRounds);

		// Create the business with hashed password
		const [newBusiness] = await db
			.insert(businesses)
			.values({
				name: body.name,
				email: body.email,
				password: hashedPassword, // Store the hashed password
			})
			.$returningId();
		return {
			success: true,
			business: newBusiness,
		};
	} catch (error) {
		console.error("Create business error:", error);
		return createError({
			statusCode: 500,
			statusMessage: "Failed to create business",
		});
	}
});
