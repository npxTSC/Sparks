"use strict";
const path					= require("path");
const glob					= require("glob");
const CleanTerminalPlugin	= require("clean-terminal-webpack-plugin");
const CopyPlugin			= require("copy-webpack-plugin");
const ZipPlugin				= require("zip-webpack-plugin");
const webpack				= require("webpack");

const cd = __dirname;

const sparkNames = glob.sync("sparks/*/").map(v => path.basename(v));

const entries = sparkNames.reduce((entries, spark) => {
	const outBase = `${cd}/sparks/${spark}/`;
	entries[`${spark}`]			= [
		outBase + "main.ts",
		outBase + spark + ".scss",
	];

	return entries;
}, {});

const zipPlugins = sparkNames.reduce((list, spark) => {
	list.push(
		new ZipPlugin({
			filename: `${spark}.spark.zip`,
			include: [new RegExp(`dist/${spark}`)],
		})
	);

	return list;
}, []);

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
		new webpack.ProgressPlugin(),
		
		new CopyPlugin({
			patterns: [
				{
					from: path.posix.join(
						path.resolve(cd, "sparks").replace(/\\/g, "/"),
						"/*/main.ejs"
					),

					to: path.resolve(cd, "dist/[path]/[name].ejs"),
					context: "sparks/",
					globOptions: {
						ignore: ["**/node_modules/**"]
					}
				}
			]
		}),

		...zipPlugins,
	],

	experiments: {
		topLevelAwait: true
	},
}