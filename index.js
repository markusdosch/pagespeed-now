"use strict";
const psi = require("psi");
const ngrok = require("ngrok");
const ora = require("ora");

function handleOpts(options) {
  options = Object.assign({ strategy: "mobile" }, options);
  return options;
}

const pagespeedNow = async (port, options) => {
  if (!port) {
    throw new Error("Port required");
  }

  const portParsed = Number.parseInt(port);
  if (!Number.isInteger(portParsed)) {
    throw new Error("Port must be a number");
  }

  const spinner = ora("Setting up ngrok tunnel").start();
  const url = await ngrok.connect(port);
  spinner.text = "Querying PageSpeed Insights";
  spinner.color = "blue";
  await psi.output(url, handleOpts(options));
};

module.exports = pagespeedNow;
