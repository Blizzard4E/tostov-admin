CREATE TABLE `admin_sessions` (
	`id` varchar(36) NOT NULL,
	`token` varchar(255) NOT NULL,
	`admin_id` int NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(50) DEFAULT 'admin',
	`is_super` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `business_sessions` (
	`id` varchar(36) NOT NULL,
	`token` varchar(255) NOT NULL,
	`business_id` int NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `business_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `business_sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `businesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businesses_id` PRIMARY KEY(`id`),
	CONSTRAINT `businesses_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `category_on_locations` (
	`location_id` int NOT NULL,
	`category_id` int NOT NULL,
	`assigned_at` timestamp DEFAULT (now()),
	CONSTRAINT `category_on_locations_location_id_category_id_pk` PRIMARY KEY(`location_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`location_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`gmap_link` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`business_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opening_hours` (
	`id` int AUTO_INCREMENT NOT NULL,
	`day_of_week` int NOT NULL,
	`open_time` varchar(5) NOT NULL,
	`close_time` varchar(5) NOT NULL,
	`is_closed` boolean DEFAULT false,
	`location_id` int NOT NULL,
	CONSTRAINT `opening_hours_id` PRIMARY KEY(`id`),
	CONSTRAINT `opening_hours_location_id_day_of_week_unique` UNIQUE(`location_id`,`day_of_week`)
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`value` int NOT NULL,
	`user_id` int NOT NULL,
	`location_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`),
	CONSTRAINT `ratings_user_id_location_id_unique` UNIQUE(`user_id`,`location_id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`user_id` int NOT NULL,
	`location_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tag_on_locations` (
	`location_id` int NOT NULL,
	`tag_id` int NOT NULL,
	`assigned_at` timestamp DEFAULT (now()),
	CONSTRAINT `tag_on_locations_location_id_tag_id_pk` PRIMARY KEY(`location_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` varchar(36) NOT NULL,
	`token` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`location_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE INDEX `admin_id_idx` ON `admin_sessions` (`admin_id`);--> statement-breakpoint
CREATE INDEX `business_id_idx` ON `business_sessions` (`business_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `user_sessions` (`user_id`);