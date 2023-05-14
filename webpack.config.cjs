const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: () => {
		const entries = {};
		glob.sync('./sparks/*/main.ts').forEach((file) => {
			const folder = path.dirname(file);
			entries[folder] = file;
		});
		return entries;
	},
	
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]/[name].js'
	},

	resolve: {
		extensions: ['.ts', '.js']
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: 'ts-loader'
			}, {
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			}
		]
	},

	plugins: [
		new MiniCssExtractPlugin(
			{filename: '[name]/[name].css'}
		)
	]
};
