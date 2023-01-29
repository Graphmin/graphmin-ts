/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-07-22
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */


import { IsString, IsNumber, IsOptional } from 'class-validator';

export enum ParameterType {
	String = 'string',
	Number = 'number'
}

export function CliParams(params: { name: string, type: ParameterType, optional: boolean }[]) {
	return function(target: any) {
		for (const param of params) {
			let decorator = '';
			if (param.type === ParameterType.String) {
				decorator = 'IsString()';
			} else if (param.type === ParameterType.Number) {
				decorator = 'IsNumber()';
			}
			if (param.optional) {
				decorator += '@IsOptional()';
			}
			Reflect.defineMetadata(param.name, decorator, target.prototype);
		}
	}
}
