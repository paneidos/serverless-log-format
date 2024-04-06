import Serverless from "serverless";
import Plugin from "serverless/classes/Plugin";

class LogFormatPlugin implements Plugin {
    commands: Plugin.Commands | undefined;
    hooks: Plugin.Hooks;
    serverless: Serverless

    constructor(serverless: Serverless, options: Serverless.Options, { log }: Plugin.Logging) {
        this.serverless = serverless
        this.hooks = {}
    }
}

export = LogFormatPlugin
