export { sql, eq, and, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../database/schema";
import mysql from "mysql2/promise";

const runtimeConfig = useRuntimeConfig();
export const tables = schema;

async function createMySQLConnection() {
	const connection = await mysql.createConnection({
		host: runtimeConfig.mysqlHost,
		port: Number(runtimeConfig.mysqlPort),
		user: runtimeConfig.mysqlUser,
		password: runtimeConfig.mysqlPassword,
		database: runtimeConfig.mysqlDatabase,
	});
	return connection;
}

export async function useDrizzle() {
	const connection = await createMySQLConnection();
	return drizzle(connection, { schema, mode: "default" });
}

export type User = typeof schema.users.$inferSelect;
