// server/api/admin/profile.get.ts

import { adminSessions, admins } from "~/server/database/schema";
import { and, eq, gt } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	try {
		// Get the admin_token from cookies
		const db = await useDrizzle();
		const adminToken = getCookie(event, "admin_token");

		// If no token is present, return unauthorized
		if (!adminToken) {
			return {
				status: 401,
				message: "Unauthorized: No admin token provided",
				data: null,
			};
		}

		// Get current date for session expiry check
		const now = new Date();

		// Find valid session by token
		const sessionResult = await db
			.select({
				id: adminSessions.id,
				adminId: adminSessions.adminId,
				expiresAt: adminSessions.expiresAt,
			})
			.from(adminSessions)
			.where(
				and(
					eq(adminSessions.token, adminToken),
					gt(adminSessions.expiresAt, now)
				)
			)
			.limit(1);

		// If no valid session found
		if (!sessionResult.length) {
			return {
				status: 401,
				message: "Unauthorized: Invalid or expired session",
				data: null,
			};
		}

		const session = sessionResult[0];

		// Get admin details using the adminId from the session
		const adminResult = await db
			.select({
				id: admins.id,
				name: admins.name,
				email: admins.email,
				role: admins.role,
				isSuper: admins.isSuper,
				createdAt: admins.createdAt,
			})
			.from(admins)
			.where(eq(admins.id, session.adminId))
			.limit(1);

		// If admin not found (should never happen if foreign keys are enforced)
		if (!adminResult.length) {
			return {
				status: 404,
				message: "Admin account not found",
				data: null,
			};
		}

		const admin = adminResult[0];

		// Return success with admin profile data
		return {
			status: 200,
			message: "Admin profile retrieved successfully",
			data: admin,
		};
	} catch (error) {
		console.error("Error fetching admin profile:", error);

		// Return server error
		return {
			status: 500,
			message: "Internal server error",
			data: null,
		};
	}
});
