"use strict";
const psi = require("psi");
const ngrok = require("ngrok");
const ora = require("ora");
const http = require("http");
const express = require("express");
const compression = require("compression");

const spinner = ora("Loading").start();

function handleOpts(options) {
  options = Object.assign({ strategy: "mobile" }, options);
  return options;
}

async function getPort(portOrFolder) {
  if (!isNaN(portOrFolder)) {
    // Port given
    const port = portOrFolder;
    return Number.parseInt(port, 10);
  } else {
    // Folder given
    const folder = portOrFolder;

    spinner.text = `Starting local server for folder "${folder}"`;
    const app = express();
    app.use(compression());
    app.use(express.static(folder));

    // Listen on a random, free port assigned by the OS
    return new Promise(resolve => {
      const listener = app.listen(0, () => {
        resolve(listener.address().port);
      });
    });
  }
}

const pagespeedNow = async (portOrFolder, options) => {
  if (!portOrFolder) {
    throw new Error("Port or folder required");
  }

  const port = await getPort(portOrFolder);

  spinner.text = "Setting up ngrok tunnel";
  const url = await ngrok.connect(port);

  spinner.text = "Querying PageSpeed Insights";
  await psi.output(url, handleOpts(options));
};

module.exports = pagespeedNow;
