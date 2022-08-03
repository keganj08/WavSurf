const path = require('path');

module.exports = {
    mode: "development",
    entry: "./public/js/reactApp",
    output: {
        path: path.resolve(__dirname + "/public/js/"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                loader: "babel-loader",
            }
        ]
    }
};