export default {
	branches: [
		"main",
		{ name: "next", prerelease: "next" }
	],
	versionStrategy: {
		source: [
			"packages/package-a",
			"packages/package-b"
		],
		target: "independent",
		synchronized: true
	},
	includeInternalDependencies: false,
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/changelog",
			{
				changelogFile: "docs/changelog.md"
			}
		],
		[
			"@semantic-release/git",
			{
				assets: ["package.json", "docs/changelog.md"],
				message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
			}
		],
		"@semantic-release/github"
	]
};