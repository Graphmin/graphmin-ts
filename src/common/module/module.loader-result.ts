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

import { IModuleLoaderResult } from "./module.loader-result.type";

/**
 * A class that represents the result of loading a module
 * @template T - The type of the loaded module.
 */
export class ModuleLoaderResult<T> implements IModuleLoaderResult<T> {
	success: boolean;
	module?: T;
	error?: any;

	/**
	 * Constructor
	 * @param success - A flag that indicates if the module was loaded successfully
	 * @param module - The loaded module
	 * @param error - The error if the module fails to load
	 */
	constructor(success: boolean, module?: T, error?: any) {
		this.success = success;
		this.module  = module;
		this.error   = error;
	}
}
