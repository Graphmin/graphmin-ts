/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-07-21
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { IConfigFile }  from "./config/config-file";
import { ConfigReader } from "./config/config.file-reader";

export enum LogLevel {
	None,
	Warnings,
	Debug,
	Low,
	High,
	Full,
	Silly
}

// export const logging: LogLevel = LogLevel.Debug;

export class GraphminConfig {
	static logging: LogLevel = LogLevel.Debug;

	constructor() { }

	private configFiles: { [ key: string ]: IConfigFile } = {};

	/**
	 * Adds a config file to the Config object
	 * @param {string} fileName - The name of the config file
	 * @param {string} filePath - The path to the JSON config file
	 */
	addConfigFile(fileName: string, filePath: string) {
		const configReader           = new ConfigReader(filePath);
		this.configFiles[ fileName ] = configReader.config;
	}

	/**
	 * Returns the value of a config key from a specific config file
	 * @param {string} fileName - The name of the config file
	 * @param {string} key - The config key to retrieve the value for
	 */
	get(fileName: string, key: string) {
		return this.configFiles[ fileName ][ key ];
	}
}
