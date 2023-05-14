const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const entries = {};

// Find all the directories under the sparks directory
const dirs = glob.sync("sparks/*/");

dirs.forEach((dir) => {
	// Get the directory name from the path
	const dirName = path.basename(path.dirname(dir));
	// Define the entry path for the current directory
	const entryPath = `./${dir}/main.ts`;
	// Define the output path for the current directory
	const outputPath = `./dist/${dirName}/`;

	entries[dirName] = {
		entry: entryPath,
		output: {
			filename: "main.js",
			path: path.resolve(__dirname, outputPath)
		}
	};
});

module.exports = Object.values(entries).map((entry) => ({
	mode: "production",
	entry: entry.entry,
	output: entry.output,

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			}, {
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
			}
		]
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},

	plugins: [
		new MiniCssExtractPlugin(
			{filename: "[name]/main.css"}
		)
	]
}));
