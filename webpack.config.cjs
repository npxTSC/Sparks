"use strict";
const path					= require("path");
const glob					= require("glob");
const CleanTerminalPlugin	= require("clean-terminal-webpack-plugin");
const CopyPlugin			= require("copy-webpack-plugin");
const webpack				= require("webpack");

const cd = __dirname;

const sparkNames = glob.sync("sparks/*/").map(v => path.basename(v));

const entries = sparkNames.reduce((entries, spark) => {
	const outBase = `${cd}/sparks/${spark}/`;
	entries[spark] = [
		outBase + "main.ts",
		outBase + spark + ".scss",
	];

	return entries;
}, {});

module.exports = {
	mode: "production",
	entry: entries,
	
	output: {
		filename: "[name]/main.js",
		path: cd + "/dist",
	},
	
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: "file-loader",
						options: {
						//	outputPath: "",
							name: "[name]/main.css",
							context: "sparks/*/",
						}
					},
					"sass-loader"
				]
			},
			{
				test: /\.tsx?$/,
				use: [{
					loader: "ts-loader",
					options: {
						configFile: "tsconfig.webpack.json"
					}
				}],
				exclude: /node_modules/,
			},
		],
	},

	resolve: {
		extensions: [".scss", ".tsx", ".ts", ".js"],
	},

	plugins: [
		new CleanTerminalPlugin(),
		new webpack.ProgressPlugin(),
		
		new CopyPlugin({
			patterns: [
				{
					from: path.posix.join(
						path.resolve(cd, "sparks").replace(/\\/g, "/"),
						"/*/**"
					),

					to: path.resolve(cd, "dist/[path]/[name][ext]"),
					context: "sparks/",
					globOptions: {
						ignore: [
							"**/node_modules/**",
							"**.ts",
							"**.scss",
						]
					}
				}
			]
		}),
	],

	experiments: {
		topLevelAwait: true
	},
}