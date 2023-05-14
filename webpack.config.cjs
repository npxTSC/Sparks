"use strict";
const path					= require("path");
const glob					= require("glob");
const CleanTerminalPlugin	= require("clean-terminal-webpack-plugin");
const CopyPlugin			= require("copy-webpack-plugin");

const cd = __dirname;
const entries = glob.sync()

module.exports = {
	mode: "production",
	entry: {
		"main":				cd + "/src/js/main.ts",
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
