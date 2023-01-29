/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-12-12
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { readFileSync } from "fs";
import path            from "path";
import { IConfigFile } from "./config-file";

/**
 * Enum for supported template variables
 */
enum TemplateVariables {
	HOME = 'HOME',
	DESKTOP = 'DESKTOP',
	USERNAME = 'USERNAME',
}

export class ConfigReader {
	config: IConfigFile;

	/**
	 * Constructor for ConfigReader
	 * @param {string} filePath - The path to the JSON config file
	 */
	constructor(filePath: string) {
		this.config = this.parseConfig(filePath);
	}

	/**
	 * Parses the JSON config file and evaluates any template variables or environment variables
	 * @param {string} filePath - The path to the JSON config file
	 */
	parseConfig(filePath: string) {
		// Read the file contents
		const fileContents = readFileSync(filePath, 'utf8');

		// Replace template variables
		let config = this.replaceTemplateVariables(fileContents);

		// Replace environment variables
		config = this.replaceEnvVariables(config);

		// Parse the JSON config
		return JSON.parse(config);
	}

	/**
	 * Replaces template variables in the config file with their corresponding values
	 * @param {string} fileContents - The contents of the config file
	 */
	replaceTemplateVariables(fileContents: string) {
		let config = fileContents;
		config     = config.replace(`{{${ TemplateVariables.HOME }}}`, process.env.HOME);
		config     = config.replace(`{{${ TemplateVariables.DESKTOP }}}`, path.join(process.env.HOME, 'Desktop'));
		config     = config.replace(`{{${ TemplateVariables.USERNAME }}}`, process.env.USERNAME);
		return config;
	}

	/**
	 * Replaces environment variables in the config file with their corresponding values
	 * @param {string} config - The config file contents
	 */
	replaceEnvVariables(config: string) {
		return config.replace(/#([A-Z_]+)/g, (match, envVar) => {
			return process.env[ envVar ];
		});
	}

	/**
	 * Returns the value of a config key, with support for if/else clauses as a JSON structure
	 * @param {string} key - The config key to retrieve the value for
	 */
	get(key: string): any {
		let value = this.config[ key ];

		if (value
			&& typeof value === 'object'
			&& value.hasOwnProperty('if')
			&& value.hasOwnProperty('else')
		) {
			const condition = value.if;
			if (condition) {
				return value.if;
			}
			else {
				return value.else;
			}
		}

		return value;
	}
}
