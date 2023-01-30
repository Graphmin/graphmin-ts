/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-19
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { CmInjectable }        from "../../di/cm.injectable.decorator";
import { getDependencies }     from "./dependencies";
import { ModuleLoaderResult }  from "./module.loader-result";
import { IModuleLoaderResult } from "./module.loader-result.type";

/**
 * A class for loading npm modules dynamically.
 * @template T - The type of the loaded module.
 */
@CmInjectable()
export class ModuleLoader {
	private static instance: ModuleLoader;
	private cache: { [ key: string ]: any } = {};
	private retryAttempts: number         = 3;
	private fallbackModule?: any;

	private constructor() {}

	/**
	 * Get the singleton instance of the class
	 * @returns {ModuleLoader<T>} - The instance of the class
	 */
	static getInstance(): ModuleLoader {
		if (!ModuleLoader.instance) {
			ModuleLoader.instance = new ModuleLoader();
		}
		return ModuleLoader.instance;
	}

	/**
	 * Set a fallback module to be used if the module fails to load
	 * @param fallback - The fallback module
	 */
	setFallbackModule(fallback: any) {
		this.fallbackModule = fallback;
	}

	/**
	 * Set the number of retry attempts
	 * @param attempts - The number of retry attempts
	 */
	setRetryAttempts(attempts: number) {
		this.retryAttempts = attempts;
	}

	/**
	 * Load a module
	 * @param moduleName - The name of the module
	 * @returns {IModuleLoaderResult<T>} - An object with setSuccess flag, loaded module, or error
	 */
	loadModule<T = any>(moduleName: string): IModuleLoaderResult<T> {
		const getDepsResult = getDependencies();
		const dependencies = getDepsResult.dependencies = getDepsResult.dependencies || {};

		if (!dependencies[ moduleName ]) {
			return new ModuleLoaderResult<T>(
				false,
				undefined,
				`Error: ${ moduleName } is not a dependency of this project.`
			);
		}

		if (this.cache[ moduleName ]) {
			return new ModuleLoaderResult<T>(
				true,
				this.cache[ moduleName ] as T
			);
		}
		let attempts = this.retryAttempts;
		while (attempts > 0) {
			try {
				this.cache[ moduleName ] = require(moduleName) as T;
				return new ModuleLoaderResult<T>(
					true,
							this.cache[ moduleName ] as T
				);
			}
			catch (err) {
				attempts--;
				console.error(`Error loading module ${ moduleName }. ${ attempts } attempts left.`);
			}
		}
		if (this.fallbackModule) {
			console.log(`Error loading module ${ moduleName }, falling back to fallback module.`);
			return new ModuleLoaderResult<T>(
				true,
				this.fallbackModule
			);
		}
		return new ModuleLoaderResult<T>(
			false,
			undefined,
			`Error loading module ${ moduleName } after ${ this.retryAttempts } attempts`
		);
	}
}

