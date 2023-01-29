/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-12-24
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { singleton }   from "tsyringe";
import { injectable }  from "tsyringe";
import { DIContainer } from "./cm.container";

export interface ICmModuleOptions {
	name?: string;
	version?: string;
	singleton?: boolean;
	providers?: any[];
}

/*
export function CmModule(options: ICmModuleOptions) {
	return function(target: any) {
		injectable()(target);
		target.name = options.name;
		target.version = options.version;
	}
}
*/

/**
 * CmModule decorator
 *
 * @param {Object} options - Options for the module
 * @param {Array} options.providers - An array of providers to be injected into the class constructor
 *
 * @return {Function}
 */
export function CmModule(options: ICmModuleOptions) {
	return function (target: any) {
		if (options.singleton) {
			singleton()(target);
		} else {
			DIContainer.register(target, { useClass: target });
		}

		options.providers.forEach(provider => {
			DIContainer.register(provider, { useClass: provider });
		});

		const original = target;
		function construct(constructor, args) {
			const c: any = function () {
				return constructor.apply(this, args);
			}
			c.prototype = constructor.prototype;
			return new c();
		}

		const newConstructor: any = function (...args) {
			const instance = construct(original, args);
			options.providers.forEach(provider => {
				instance[provider.name] = DIContainer.resolve(provider);
			});
			return instance;
		}
		newConstructor.prototype = original.prototype;
		return newConstructor;
	}
}
