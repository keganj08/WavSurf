import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import path from 'path';

export default {
    mode: "development",
    entry: "./public/js/reactApp",
    output: {
        path: path.resolve(process.cwd() + "/public/js/"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: ["babel-loader", "style-loader", "css-loader"],
            }
        ]
    }
};