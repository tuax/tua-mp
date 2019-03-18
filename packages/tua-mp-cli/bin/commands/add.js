const { readConfigFile } = require('../../lib/utils/')

exports.desc = 'add some template code to your project'
exports.aliases = 'a'
exports.command = 'add <command>'

exports.builder = yargs => yargs.commandDir('./addCmds', {
    visit: (cmd) => {
        const handler = cmd.handler.bind(cmd)

        cmd.handler = (argv) => {
            argv.tuaConfig = readConfigFile()

            return handler(argv)
        }

        return cmd
    }
})

exports.handler = () => {}
