const express = require("express");
const logger = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const middleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const config = require("../../webpack.config");
const compiler = webpack(config);

const app = express();

const isDevMode = process.env.NODE_ENV === "development";

if (isDevMode) {
  app.use(
    middleware(compiler, {
      publicPath: config.output.publicPath,
      stats: { colors: true },
    })
  );
  app.use(require("webpack-hot-middleware")(compiler));
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/dist", express.static("dist"));

app.get("/", function (req, res) {
  if (!isDevMode) {
    return res.sendFile(path.resolve(__dirname, "../../dist/index.html"));
  }
  const filename = path.join(compiler.outputPath, "index.html");

  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) return next(err);
    res.set("content-type", "text/html").end(result);
  });
});

module.exports = app;
