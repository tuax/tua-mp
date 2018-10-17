exports.desc = 'add some template code to your project'
exports.aliases = 'a'
exports.command = 'add <command>'

exports.builder = yargs => yargs.commandDir('./addCmds')

exports.handler = () => {}
