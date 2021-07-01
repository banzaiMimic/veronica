#!/usr/bin/env node

const prog = require('caporal')
const createCmd = require('./lib/create')

prog
  .version('1.0.0')
  .command('create', 'create something')
  .argument('<template>', 'template to use')
  .option('--variant <variant>', 'which <variant> template to use')
  .action(createCmd)

  prog.parse(process.argv)