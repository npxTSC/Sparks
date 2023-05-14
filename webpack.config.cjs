"use strict";
const path					= require("path");
const glob					= require("glob");
const CleanTerminalPlugin	= require("clean-terminal-webpack-plugin");

const cd = __dirname;

const sparkNames = glob.sync("sparks/*/").map(v => path.basename(v));

const entries = sparkNames.reduce((acc, v) => {
	const outBase = `${cd}/sparks/${v}/`;
	acc[`sparks/${v}`]		= outBase + "main.ts";
	acc[`sparks/sass-${v}`]	= outBase + v + ".scss";
	return acc;
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
							name: "[name]/[name].css",
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
	],

	experiments: {
		topLevelAwait: true
	},
}