/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-07 02:43
 */

import winston from "winston";

enum LogLevel {
	ERROR = "error",
	WARN = "warn",
	INFO = "info",
	DEBUG = "debug"
}

export interface ServerLogger {
	log(level: LogLevel, message: string, meta?: any): void;
}

export class GraphminLogger implements ServerLogger {
	logger: winston.Logger;

	// Constructor
	constructor(logger: winston.Logger) {
		this.logger = logger;
	}

	// Implement the log method of the logger interface
	log(level: LogLevel, message: string, meta?: any): void {
		switch (level) {
			case LogLevel.ERROR:
				this.logger.error(message, meta);
				break;
			case LogLevel.WARN:
				this.logger.warn(message, meta);
				break;
			case LogLevel.INFO:
				this.logger.info(message, meta);
				break;
			case LogLevel.DEBUG:
				this.logger.debug(message, meta);
				break;
			default:
				throw new Error(`Invalid log level: ${level}`);
		}
	}
}
