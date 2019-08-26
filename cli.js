#!/usr/bin/env node
"use strict";
const meow = require("meow");
const chalk = require("chalk");
const updateNotifier = require("update-notifier");
const pagespeedNow = require(".");

const cli = meow(`
  Usage
    $ pagespeed-now <port>
  Options
    --strategy   Strategy to use when analyzing the page: mobile|desktop (default: mobile)
  Example
    $ pagespeed-now 3000 --strategy=mobile
`);

updateNotifier({ pkg: cli.pkg }).notify();

if (!cli.input[0]) {
  console.error("Specify a port");
  process.exit(1);
}

pagespeedNow(cli.input[0], cli.flags)
  .then(() => {
    process.exit();
  })
  .catch(error => {
    if (error.noStack) {
      console.error(chalk.red(error.message));
      process.exit(1);
    } else {
      throw error;
    }
  });
