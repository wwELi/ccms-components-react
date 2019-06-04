const path = require('path');
const webpack = require('webpack');

const srcDir = path.join(__dirname, '..');

const publicPath = '/';

const devServer = {
	clientLogLevel: 'warning',
	disableHostCheck: true,
	hot: true,
	contentBase: srcDir,
	compress: true,
	open: true,
	overlay: {
		warnings: false,
		errors: true
	}
};

module.exports = () => ({
	devServer,
	devtool: 'cheap-module-eval-source-map',
	entry: {
		'component': './demos/app.js'
	},
	output: {
		publicPath,
		filename: '[name].js'
	},
	bail: true,
	module: {
		rules: [
			{
				test: /\.(css|less)$/,
				use: ['style', 'css', 'less']
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
});
