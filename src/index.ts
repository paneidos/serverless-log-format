import Serverless from "serverless";
import type Plugin from "serverless/classes/Plugin";
import type Aws from "serverless/plugins/aws/provider/awsProvider";

type FunctionLogging = {
    logFormat?: 'Text' | 'JSON'
    logLevel?: 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'
    systemLogLevel?: 'DEBUG' | 'INFO' | 'WARN'
}

class LogFormatPlugin implements Plugin {
    commands: Plugin.Commands | undefined;
    hooks: Plugin.Hooks;
    serverless: Serverless
    provider: Aws
    log: Plugin.Logging['log']

    constructor(serverless: Serverless, options: Serverless.Options, { log }: Plugin.Logging) {
        this.serverless = serverless
        this.provider = serverless.getProvider('aws')
        this.log = log
        this.hooks = {
            'after:package:compileFunctions': async() => {
                await this.assignLogConfigs()
            }
        }

        // For reference on JSON schema, see https://github.com/ajv-validator/ajv
        serverless.configSchemaHandler.defineFunctionProperties('aws', {
            properties: {
                logFormat: { type: 'string', enum: ['Text', 'JSON'] },
                logLevel: { type: 'string', enum: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'] },
                systemLogLeve: { type: 'string', enum: ['DEBUG', 'INFO', 'WARN'] },
            },
        });
    }

    setFunctionLogConfig(logicalId: string, property: string, value: string) {
        this.serverless.service.provider.compiledCloudFormationTemplate.Resources[logicalId].Properties.LoggingConfig = {
            ...(this.serverless.service.provider.compiledCloudFormationTemplate.Resources[logicalId].Properties.LoggingConfig ?? {}),
            [property]: value
        }
    }

    async assignLogConfigs() {
        Object.entries(this.serverless.service.functions).forEach(([name, config]) => {
            const logConfig = Object.assign({}, config) as FunctionLogging
            const logicalId = this.provider.naming.getLambdaLogicalId(name)

            this.log.warning(this.provider.naming.getLambdaLogicalId(name));

            if (logConfig.logFormat !== undefined) {
                this.setFunctionLogConfig(logicalId, 'LogFormat', logConfig.logFormat)
            }
            if (logConfig.logLevel !== undefined) {
                this.setFunctionLogConfig(logicalId, 'ApplicationLogLevel', logConfig.logLevel)
            }
            if (logConfig.systemLogLevel !== undefined) {
                this.setFunctionLogConfig(logicalId, 'SystemLogLevel', logConfig.systemLogLevel)
            }
        })
    }
}

export = LogFormatPlugin
