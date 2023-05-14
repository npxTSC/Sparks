"use strict";
const path					= require("path");
const CleanTerminalPlugin	= require("clean-terminal-webpack-plugin");
const CopyPlugin			= require("copy-webpack-plugin");

const cd = __dirname;

module.exports = {
	mode: "production",
	entry: {
		"sparks/sparkwave":			cd + "/sparks/sparkwave/main.ts",
		"sparks/sass-sparkwave":	cd + "/sparks/sparkwave/sparkwave.scss",
		
		"sparks/wordle":			cd + "/sparks/wordle/main.ts",
		"sparks/sass-wordle":		cd + "/sparks/wordle/wordle.scss",
		
		"sparks/sudoku":			cd + "/sparks/sudoku/main.ts",
		"sparks/sass-sudoku":		cd + "/sparks/sudoku/sudoku.scss",
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
							outputPath: "css/",
							name: "[path][name].min.css",
							context: "src/css/",
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
	
	output: {
		filename: "js/[name].js",
		path: cd + "/dist",
	},

	plugins: [
		new CleanTerminalPlugin(),
	],

	experiments: {
		topLevelAwait: true
	},
}