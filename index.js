#!/usr/bin/env node

const { Command } = require('commander');
// import { Command } from 'commander';
const program = new Command();

program
  .name('create-sass-dashboard')
  .description('CLI to scaffold SASS dashboard apps')
  .version('1.0.0');

// Import subcommands
program
  .command('init')
  .description('Initialize a new dashboard project')
  .action(() => require('./commands/init')());

program
  .command('add-page')
  .description('Add a new page to the dashboard')
  .action(() => require('./commands/add-page')());

program.parse(process.argv);
