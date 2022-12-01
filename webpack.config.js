const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './src/app.js',
  mode: 'production',

  output: {
		path: `${__dirname}/dist`,
		filename: 'bundle.js',
  },

  module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
		],
  },

	devServer: {
		static: {
			directory: path.join(__dirname, 'public')
		},
		compress: true,
		port: 9001
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'recv',
			template: './src/recv-qr.html'
		})
	]
};