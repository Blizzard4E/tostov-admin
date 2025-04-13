import {
	mysqlTable,
	int,
	varchar,
	text,
	timestamp,
	boolean,
	primaryKey,
	unique,
	index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// User model
export const users = mysqlTable("users", {
	id: int("id").primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	reviews: many(reviews),
	ratings: many(ratings),
	sessions: many(userSessions),
}));

// UserSession model
export const userSessions = mysqlTable(
	"user_sessions",
	{
		id: varchar("id", { length: 36 }).primaryKey(),
		token: varchar("token", { length: 255 }).notNull().unique(),
		userId: int("user_id").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(table) => {
		return {
			userIdIdx: index("user_id_idx").on(table.userId),
		};
	}
);

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
	user: one(users, {
		fields: [userSessions.userId],
		references: [users.id],
	}),
}));

// Business model
export const businesses = mysqlTable("businesses", {
	id: int("id").primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const businessesRelations = relations(businesses, ({ many }) => ({
	locations: many(locations),
	sessions: many(businessSessions),
}));

// BusinessSession model
export const businessSessions = mysqlTable(
	"business_sessions",
	{
		id: varchar("id", { length: 36 }).primaryKey(),
		token: varchar("token", { length: 255 }).notNull().unique(),
		businessId: int("business_id").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(table) => {
		return {
			businessIdIdx: index("business_id_idx").on(table.businessId),
		};
	}
);

export const businessSessionsRelations = relations(
	businessSessions,
	({ one }) => ({
		business: one(businesses, {
			fields: [businessSessions.businessId],
			references: [businesses.id],
		}),
	})
);

// Admin model
export const admins = mysqlTable("admins", {
	id: int("id").primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	role: varchar("role", { length: 50 }).default("admin"),
	isSuper: boolean("is_super").default(false),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const adminsRelations = relations(admins, ({ many }) => ({
	sessions: many(adminSessions),
}));

// Location model
export const locations = mysqlTable("locations", {
	id: int("id").primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull(),
	address: varchar("address", { length: 255 }).notNull(),
	gmapLink: varchar("gmap_link", { length: 255 }).notNull(),
	description: text("description").notNull(),
	businessId: int("business_id").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const locationsRelations = relations(locations, ({ one, many }) => ({
	business: one(businesses, {
		fields: [locations.businessId],
		references: [businesses.id],
	}),
	images: many(images),
	videos: many(videos),
	ratings: many(ratings),
	reviews: many(reviews),
	categories: many(categoryOnLocations),
	tags: many(tagOnLocations),
	hours: many(openingHours),
}));

// OpeningHours model
export const openingHours = mysqlTable(
	"opening_hours",
	{
		id: int("id").primaryKey().autoincrement(),
		dayOfWeek: int("day_of_week").notNull(), // 0 for Sunday, 1 for Monday, etc.
		openTime: varchar("open_time", { length: 5 }).notNull(), // Format: "HH:MM"
		closeTime: varchar("close_time", { length: 5 }).notNull(), // Format: "HH:MM"
		isClosed: boolean("is_closed").default(false),
		locationId: int("location_id").notNull(),
	},
	(table) => {
		return {
			locationDayUnique: unique().on(table.locationId, table.dayOfWeek),
		};
	}
);

export const openingHoursRelations = relations(openingHours, ({ one }) => ({
	location: one(locations, {
		fields: [openingHours.locationId],
		references: [locations.id],
	}),
}));

// Image model
export const images = mysqlTable("images", {
	id: int("id").primaryKey().autoincrement(),
	url: varchar("url", { length: 255 }).notNull(),
	locationId: int("location_id").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const imagesRelations = relations(images, ({ one }) => ({
	location: one(locations, {
		fields: [images.locationId],
		references: [locations.id],
	}),
}));

// Video model
export const videos = mysqlTable("videos", {
	id: int("id").primaryKey().autoincrement(),
	url: varchar("url", { length: 255 }).notNull(),
	locationId: int("location_id").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const videosRelations = relations(videos, ({ one }) => ({
	location: one(locations, {
		fields: [videos.locationId],
		references: [locations.id],
	}),
}));

// Category model
export const categories = mysqlTable("categories", {
	id: int("id").primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	locations: many(categoryOnLocations),
}));

// CategoryOnLocation model (junction table)
export const categoryOnLocations = mysqlTable(
	"category_on_locations",
	{
		locationId: int("location_id").notNull(),
		categoryId: int("category_id").notNull(),
		assignedAt: timestamp("assigned_at").defaultNow(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.categoryId] }),
		};
	}
);

export const categoryOnLocationsRelations = relations(
	categoryOnLocations,
	({ one }) => ({
		location: one(locations, {
			fields: [categoryOnLocations.locationId],
			references: [locations.id],
		}),
		category: one(categories, {
			fields: [categoryOnLocations.categoryId],
			references: [categories.id],
		}),
	})
);

// Tag model
export const tags = mysqlTable("tags", {
	id: int("id").primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
	locations: many(tagOnLocations),
}));

// TagOnLocation model (junction table)
export const tagOnLocations = mysqlTable(
	"tag_on_locations",
	{
		locationId: int("location_id").notNull(),
		tagId: int("tag_id").notNull(),
		assignedAt: timestamp("assigned_at").defaultNow(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.locationId, table.tagId] }),
		};
	}
);

export const tagOnLocationsRelations = relations(tagOnLocations, ({ one }) => ({
	location: one(locations, {
		fields: [tagOnLocations.locationId],
		references: [locations.id],
	}),
	tag: one(tags, {
		fields: [tagOnLocations.tagId],
		references: [tags.id],
	}),
}));

// Rating model
export const ratings = mysqlTable(
	"ratings",
	{
		id: int("id").primaryKey().autoincrement(),
		value: int("value").notNull(),
		userId: int("user_id").notNull(),
		locationId: int("location_id").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(table) => {
		return {
			userLocationUnique: unique().on(table.userId, table.locationId),
		};
	}
);

export const ratingsRelations = relations(ratings, ({ one }) => ({
	user: one(users, {
		fields: [ratings.userId],
		references: [users.id],
	}),
	location: one(locations, {
		fields: [ratings.locationId],
		references: [locations.id],
	}),
}));

// Review model
export const reviews = mysqlTable("reviews", {
	id: int("id").primaryKey().autoincrement(),
	content: text("content").notNull(),
	userId: int("user_id").notNull(),
	locationId: int("location_id").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").onUpdateNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id],
	}),
	location: one(locations, {
		fields: [reviews.locationId],
		references: [locations.id],
	}),
}));

// AdminSession model
export const adminSessions = mysqlTable(
	"admin_sessions",
	{
		id: varchar("id", { length: 36 }).primaryKey(),
		token: varchar("token", { length: 255 }).notNull().unique(),
		adminId: int("admin_id").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(table) => {
		return {
			adminIdIdx: index("admin_id_idx").on(table.adminId),
		};
	}
);

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
	admin: one(admins, {
		fields: [adminSessions.adminId],
		references: [admins.id],
	}),
}));
