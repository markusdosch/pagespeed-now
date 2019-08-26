#!/usr/bin/env node
"use strict";
const meow = require("meow");
const chalk = require("chalk");
const updateNotifier = require("update-notifier");
const pagespeedNow = require(".");

const cli = meow(`
  Usage
    $ pagespeed-now <port|folder>
  Options
    --strategy   Strategy to use when analyzing the page: mobile|desktop (default: mobile)
  Examples
    $ pagespeed-now 3000 --strategy=mobile
    $ pagespeed-now build
    $ pagespeed-now .
`);

updateNotifier({ pkg: cli.pkg }).notify();

if (!cli.input[0]) {
  console.error("Specify a port or folder");
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
