/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-23 11:43
 */

import { CmModule }       from "../../di/cm.module.decorator";
import { LogLevel }       from "../../graphmin.config";
import { GraphminConfig } from "../../graphmin.config";
import { GraphminLogger } from "./server-logger";

interface LoggerMiddleware {
	(message: string): void;
}

@CmModule(
	{
		providers: [GraphminLogger],
		singleton: true
	})
export class Logger {
	private static instance: Logger;
	private plugins: Array<LoggerMiddleware> = [];
	private httpServer: any;

	private constructor() {
	}

	public static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	public addPlugin(plugin: LoggerMiddleware) {
		this.plugins.push(plugin);
	}

	public registerHttpServer(server: any) {
		this.httpServer = server;
	}

	public log(message: string) {
		console.log(message);
		this.plugins.forEach(p => p(message));
		this.writeToFile(message);
	}

	private writeToFile(message: string) {
		// Implement write to file logic here
	}

	public static debug(...args: any[]) {
		if (GraphminConfig.logging <= LogLevel.Debug) {
			console.log("DEBUG ::", args);
		}
	}

	public static info(...args: any[]) {
		console.log("INFO ::", args);
	}

	public static warn(...args: any[]) {
		console.log("WARN ::", args);
	}

	public static err(...args: any[]) {
		console.log("ERR ::", args);
	}
}
