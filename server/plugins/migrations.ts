import { migrate } from "drizzle-orm/mysql2/migrator";

export default defineNitroPlugin(async () => {
	if (!import.meta.dev) return;

	await migrate(await useDrizzle(), {
		migrationsFolder: "server/database/migrations",
	})
		.then(() => {
			console.log("Database migrations done");
		})
		.catch((err) => {
			console.log("Database migrations failed", err);
		});
});
