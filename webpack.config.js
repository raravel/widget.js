const path = require('path');
const { ProvidePlugin } = require('webpack');
const { NODE_ENV = "production" } = process.env;

module.exports = {
	"entry": "./src/index.ts",
	"mode": NODE_ENV,
	"output": {
		"path": path.resolve(__dirname, "dist"),
		"libraryTarget": "window",
	},
	"resolve": {
		"alias": {
			"@": path.resolve(__dirname, "src"),
		},
		"extensions": [".ts", ".js", ".json"],
	},
	"plugins": [
		new ProvidePlugin({
			'WIDGET': 'WIDGET',
		}),
	],
	"module": {
		"rules": [
			{
				"test": /\.ts$/,
				"loader": "ts-loader",
				"exclude": /node-modules/,
			},
		],
	},
};
