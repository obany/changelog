import path from 'node:path';
import fs from 'node:fs/promises';

export async function gatherDirectoryNames(dir) {
	const dirNames = [];

	if (await directoryExists(dir)) {
		const fullDir = path.resolve(dir);
		const allEntries = await fs.readdir(fullDir, { withFileTypes: true });

		for (const entry of allEntries) {
			if (entry.isDirectory()) {
				dirNames.push(entry.name);
			}
		}
	}

	return dirNames;
}

/**
 * Does the specified directory exist.
 * @param directory The directory to check for existence.
 * @returns True if the directory exists.
 */
export async function directoryExists(directory) {
	try {
		const stats = await fs.stat(directory);
		return stats.isDirectory();
	} catch {
		return false;
	}
}