// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { execSync } from 'child_process';

const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const pattern = /^(feature|fix|release|chore)\/[a-z0-9-]+?$/i;

if (!pattern.test(branchName)) {
	console.error(`ERROR: Branch name '${branchName}' doesn't match the required pattern.`);
	console.error('Branch names should start: feature/, fix/, release/ or chore/');
	console.error('and the name should consist of lowercase letters, numbers and hyphens.');
	process.exit(1);
}
