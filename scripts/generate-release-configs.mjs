// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/**
 * This script will generate a configuration file for release-please.
 *
 * Usage:
 * npm run generate-release-configs <path-to-config-directory>
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { gatherDirectoryNames } from './common.mjs';

/**
 * Execute the process.
 */
async function run() {
	process.stdout.write('Generate Release Configs\n');
	process.stdout.write('========================\n');
	process.stdout.write('\n');
	process.stdout.write(`Platform: ${process.platform}\n`);

	if (process.argv.length <= 2) {
		throw new Error('No target directory specified');
	}

	process.stdout.write('\n');
	const targetDirectory = path.resolve(process.argv[2]);

	process.stdout.write(`Target Directory: ${targetDirectory}\n`);

	for (const semVerType of ['major', 'minor', 'patch', 'prerelease']) {
		process.stdout.write(`\nGenerating config for ${semVerType} release...\n`);
		await generateConfig(targetDirectory, semVerType);
	}

	process.stdout.write(`\nDone.\n`);
}

async function generateConfig(targetDirectory, semVerType) {
	const versioning = {
		"major": "always-bump-major",
		"minor": "always-bump-minor",
		"patch": "always-bump-patch",
		"prerelease": "prerelease"
	};

	const packageNames = await gatherDirectoryNames("packages");
	const appNames = await gatherDirectoryNames("apps");
	packageNames.push(...appNames);

	const config = {
		"pull-request-header": `:robot: ${semVerType} release prepared`,
		"release-type": "node",
		"versioning": versioning[semVerType],
		"prerelease": semVerType === "prerelease",
		"prerelease-type": semVerType === "prerelease" ? "next" : "",
		"packages": {
		},
		"plugins": [
			"node-workspace",
			{
				"type": "linked-versions",
				"groupName": "repo",
				"components": [
				]
			}
		]
	};

	for (const packageName of packageNames) {
		config.packages[`packages/${packageName}`] = {
			"package-name": packageName,
			"changelog-path": `docs/changelog.md`
		};

		config.plugins[1].components.push(packageName);
	}

	await fs.writeFile(path.join(targetDirectory, `release-please-config.${semVerType}.json`), JSON.stringify(config, undefined, "\t"), 'utf8');
}

run().catch(err => {
	process.stderr.write(`\n${err}\n`);
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(1);
});
