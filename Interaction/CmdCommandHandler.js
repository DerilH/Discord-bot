var readline = require('readline');

class CmdCommandHandler {
    constructor(bot) {
        this.bot = bot;
        var rl = readline.createInterface(process.stdin, process.stdout);
        rl.setPrompt('Cmd> ');
        rl.prompt();
        rl.on('line', async function (line) {

            const input = line.toString();
            if(!input.startsWith('/')) return;
            if (input == '/deployL') {
                bot.commandManager.loadCommands(bot.commandManager.currentPath);
                await bot.commandManager.deployCommandsLocal(process.env.guildId);
            }else if(input == '/deployG')
            {
                bot.commandManager.loadCommands(bot.commandManager.currentPath);
                bot.commandManager.deployCommandsGlobal();
            } else if(input == '/reloadPermsL') {
                bot.commandManager.loadCommandPermissionsLocal(process.env.guildId);
            } else if(input == '/reloadPermsG'){
                bot.commandManager.loadCommandPermissionsGlobal();
            }

            rl.prompt();
        }).on('close', function () {
            process.exit(0);
        });
    }
}
module.exports.CmdCommandHandler = CmdCommandHandler;