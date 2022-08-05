const HtmlWebpackPlugin = require('html-webpack-plugin')

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
	plugins: [
		new HtmlWebpackPlugin({
			title: 'recv',
			template: './src/recv.html'
		})
	]
};