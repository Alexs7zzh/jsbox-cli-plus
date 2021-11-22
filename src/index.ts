import { program } from 'commander'
import * as net from 'net'
import path from 'path'
import { showHost, watch, saveHost, build } from './actions.js'
import * as log from './log.js'

program
  .command('host')
  .description('Show your current host IP')
  .action(() => {
    showHost()
  })

program
  .command('set <hostIP>')
  .description('Set your host IP')
  .action((hostIP: string) => {
    if (!net.isIP(hostIP)) {
      log.error(`${hostIP} is not a valid IP`)
      process.exit(1)
    }

    saveHost(hostIP)
  })

program
  .command('watch [item]')
  .option('-l, --logger', 'Start a debug worker')
  .description('Watching change in a directory or file')
  .action((item: string, cmd) => {
    const pwd = process.cwd()
    if (!item) {
      item = '.'
    }
    item = path.resolve(pwd, item)

    watch(item, cmd.logger)
  })

program
  .command('build [dir]')
  .option('-o, --output <output>', 'Specify the output directory')
  .description('Build box package')
  .action(async (dir: string, cmd) => {
    const pwd = process.cwd()
    dir = dir || '.'
    dir = path.resolve(pwd, dir)

    await build(dir, cmd.output)
  })

program.parse(process.argv)
