// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/**
 * This script will generate a configuration file for release-please.
 *
 * Usage:
 * npm run release-please <path-to-config> major/minor/patch/next
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { gatherDirectoryNames } from './common.mjs';

/**
 * Execute the process.
 */
async function run() {
	process.stdout.write('Generate Release Config\n');
	process.stdout.write('=======================\n');
	process.stdout.write('\n');
	process.stdout.write(`Platform: ${process.platform}\n`);

	if (process.argv.length <= 2) {
		throw new Error('No target package specified');
	}
	if (process.argv.length <= 3) {
		throw new Error('No semver type specified, major/minor/patch/prerelease');
	}

	process.stdout.write('\n');
	const targetPath = path.resolve(process.argv[2]);
	const semVerType = process.argv[3];

	if (semVerType !== 'major' && semVerType !== 'minor' && semVerType !== 'patch' && semVerType !== 'prerelease') {
		throw new Error(`Invalid semver type ${semVerType}`);
	}

	process.stdout.write(`Target Path: ${targetPath}\n`);
	process.stdout.write(`Semver Type: ${semVerType}\n`);

	buildConfig(targetPath, semVerType);

	process.stdout.write(`\nDone.\n`);
}

async function buildConfig(targetPath, semVerType) {
	const versioning = {
		"major": "always-bump-major",
		"minor": "always-bump-minor",
		"patch": "always-bump-patch",
		"prerelease": "prerelease"
	};

	const packageNames = await gatherDirectoryNames("packages");
	const appNames = await gatherDirectoryNames("apps");
	packageNames.push(...appNames);
	console.log(packageNames)

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

	await fs.writeFile(targetPath, JSON.stringify(config, undefined, "\t"), 'utf8');
}

run().catch(err => {
	process.stderr.write(`\n${err}\n`);
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(1);
});
