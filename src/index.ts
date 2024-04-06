import Serverless from "serverless";
import Plugin from "serverless/classes/Plugin";

class LogFormatPlugin implements Plugin {
    commands: Plugin.Commands | undefined;
    hooks: Plugin.Hooks;
    serverless: Serverless

    constructor(serverless: Serverless, options: Serverless.Options, { log }: Plugin.Logging) {
        this.serverless = serverless
        this.hooks = {}

        // For reference on JSON schema, see https://github.com/ajv-validator/ajv
        serverless.configSchemaHandler.defineFunctionProperties('aws', {
            properties: {
                logFormat: { type: 'string', enum: ['Text', 'JSON'] },
                logLevel: { type: 'string', enum: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'] },
                systemLogLeve: { type: 'string', enum: ['DEBUG', 'INFO', 'WARN'] },
            },
        });
    }
}

export = LogFormatPlugin
