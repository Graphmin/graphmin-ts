/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-02-12
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { container }           from "tsyringe";
import constructor             from "tsyringe/dist/typings/types/constructor";

/**
 * CmModule decorator
 *
 * @param {Object} options - Options for the module
 * @param {Array} options.providers - An array of providers to be injected into the class constructor
 *
 * @return {Function}
 */
export class CmContainer {
	private static instance: CmContainer;

	private constructor() {}

	public static getInstance(): CmContainer {
		if (!CmContainer.instance) {
			CmContainer.instance = new CmContainer();
		}
		return CmContainer.instance;
	}

	public register<T>(token: any, options: { useClass: constructor<T> }): void {
		container.register(token, { useClass: options.useClass });
	}

	public resolve<T>(token: any): T {
		return container.resolve(token);
	}
}

export const getContainer = (): CmContainer => {
	return CmContainer.getInstance();
}

export const DIContainer = CmContainer.getInstance();

/*
import { Container } from 'tsyringe';

interface ICmModuleOptions {
	name: string;
	version: string;
}

let containerInstance: Container;

export function CmModule(options: ICmModuleOptions) {
	return (target: any) => {
		getContainer().register(target, { name: options.name, version: options.version });
	}
}

export class CmContainer extends Container {
	static getInstance(): Container {
		if (!containerInstance) {
			containerInstance = new CmContainer();
		}
		return containerInstance;
	}
}

function getContainer(): Container {
	return CmContainer.getInstance();
}
*/
