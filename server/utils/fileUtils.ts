// server/utils/fileUtils.ts
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { ServerFile } from "nuxt-file-storage";

/**
 * Ensure directory exists
 */
export function ensureDirectoryExists(dirPath: string): void {
	const absolutePath = path.resolve(process.cwd(), "public", dirPath);
	if (!fs.existsSync(absolutePath)) {
		fs.mkdirSync(absolutePath, { recursive: true });
	}
}

/**
 * Parse a data URL and extract binary data and file extension
 */
export function parseDataUrl(dataUrl: string): {
	binaryString: Buffer;
	ext: string;
} {
	// Extract the base64 data and MIME type
	const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);

	if (!matches) {
		throw new Error("Invalid data URL format");
	}

	const mimeType = matches[1];
	const base64Data = matches[2];
	const binaryString = Buffer.from(base64Data, "base64");

	// Determine file extension from MIME type
	let ext = "";
	switch (mimeType.toLowerCase()) {
		case "image/jpeg":
		case "image/jpg":
			ext = "jpg";
			break;
		case "image/png":
			ext = "png";
			break;
		case "image/gif":
			ext = "gif";
			break;
		case "image/webp":
			ext = "webp";
			break;
		case "video/mp4":
			ext = "mp4";
			break;
		case "video/webm":
			ext = "webm";
			break;
		default:
			// Extract extension from mime type (e.g., 'application/pdf' -> 'pdf')
			const parts = mimeType.split("/");
			if (parts.length > 1) {
				ext = parts[1];
			}
	}

	return { binaryString, ext };
}

/**
 * Store a file locally
 */
export async function storeFileLocally(
	file: ServerFile,
	fileNameOrLength: string | number = 8,
	folderPath: string = "/uploads"
): Promise<{ filePath: string; fileName: string }> {
	// Ensure the directory exists
	ensureDirectoryExists(folderPath);

	// Parse the data URL
	const { binaryString, ext } = parseDataUrl(file.content);

	// Generate file name
	let fileName: string;
	if (typeof fileNameOrLength === "string") {
		fileName = fileNameOrLength;
	} else {
		fileName = randomUUID().slice(0, fileNameOrLength);
	}

	// Add extension if needed
	if (ext && !fileName.endsWith(`.${ext}`)) {
		fileName = `${fileName}.${ext}`;
	}

	// Create full path
	const absolutePath = path.resolve(
		process.cwd(),
		"public",
		folderPath,
		fileName
	);

	// Write file
	await fs.promises.writeFile(absolutePath, binaryString);

	// Generate public URL path
	const filePath = path.join(folderPath, fileName).replace(/\\/g, "/");

	return { filePath, fileName };
}

/**
 * Get file path locally
 */
export async function getFileLocally(
	fileName: string,
	folderPath: string = "/uploads"
): Promise<string> {
	const relativePath = path.join(folderPath, fileName).replace(/\\/g, "/");
	return relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
}

/**
 * Get all files in a folder
 */
export async function getFilesLocally(
	folderPath: string = "/uploads"
): Promise<string[]> {
	ensureDirectoryExists(folderPath);
	const absolutePath = path.resolve(process.cwd(), "public", folderPath);
	try {
		const files = await fs.promises.readdir(absolutePath);
		return files;
	} catch (error) {
		console.error(`Error reading directory ${folderPath}:`, error);
		return [];
	}
}

/**
 * Delete a file
 */
export async function deleteFile(
	fileName: string,
	folderPath: string = "/uploads"
): Promise<boolean> {
	const absolutePath = path.resolve(
		process.cwd(),
		"public",
		folderPath,
		fileName
	);
	try {
		await fs.promises.unlink(absolutePath);
		return true;
	} catch (error) {
		console.error(`Error deleting file ${fileName}:`, error);
		return false;
	}
}
