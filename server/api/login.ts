// server/api/admin/login.post.ts
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";
import { admins, adminSessions } from "~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	try {
		const db = await useDrizzle();
		// Parse request body
		const { email, password } = await readBody(event);

		if (!email || !password) {
			return createError({
				statusCode: 400,
				statusMessage: "Email and password are required",
			});
		}

		// Find admin by email
		const adminResult = await db
			.select()
			.from(admins)
			.where(eq(admins.email, email))
			.limit(1);

		const admin = adminResult[0];

		if (!admin) {
			return createError({
				statusCode: 401,
				statusMessage: "Invalid credentials",
			});
		}

		// Verify password
		const isPasswordValid = await compare(password, admin.password);

		if (!isPasswordValid) {
			return createError({
				statusCode: 401,
				statusMessage: "Invalid credentials",
			});
		}

		// Generate token and create session
		const token = uuidv4();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

		// Create a new session
		const [session] = await db
			.insert(adminSessions)
			.values({
				id: uuidv4(),
				token,
				adminId: admin.id,
				expiresAt,
			})
			.$returningId();

		// Set HTTP-only cookie
		setCookie(event, "admin_token", token, {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
			expires: expiresAt,
			path: "/",
		});

		// Return admin data (excluding sensitive info)
		return {
			success: true,
			admin: {
				id: admin.id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
				isSuper: admin.isSuper,
			},
		};
	} catch (error) {
		console.error("Login error:", error);
		return createError({
			statusCode: 500,
			statusMessage: "Internal server error",
		});
	}
});
