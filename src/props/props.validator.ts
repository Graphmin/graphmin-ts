/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-11-05
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import 'reflect-metadata';
import { getAllProps }   from "./props.helper";
import { PropsMetakeys } from "./props.metakeys";
import { IPropsObject }  from "./props.object";

export interface IPropValidationResult {
	isValid: boolean;
	result: KeyValueObj;
}

export type KeyValueObj = {
	[ key: string ]: string;
}

export abstract class PropsObject implements IPropsObject {
	public isValid: boolean = false;

	public validate(): IPropValidationResult {
		const res    = validateProps(this);
		this.isValid = Object.keys(res).length > 0;

		return {
			isValid: this.isValid,
			result : res
		}
	}
}

/**
 * 	Return the result object, with keys for any properties
 * 	that failed validation and corresponding error messages as values
 * @param {object} obj
 * @returns {any}
 */
export function validateProps(obj: object): KeyValueObj {
	const result: any = {};

	console.log("validateProps ::", obj);

	//let obj2  = new obj();
	//proto: obj.prototype;
	const paramMeta = Reflect.getMetadataKeys(obj);
	console.log("Param metadata ::", paramMeta);

	let props = getAllProps(obj);
	console.log("PROPS ::", props);

	Object.getOwnPropertyNames(obj).forEach(param => {
		console.log("OVVE ::", param);
	});

	const keys = Object.keys(obj);

	for (const key of keys) {
		const metadata = Reflect.getMetadata(key, obj);

		if (metadata && metadata.decorator === PropsMetakeys.KeyPropString) {
			const value = obj[ key ];

			// Validate the value according to the options specified in the decorator
			if (typeof value !== 'string') {
				result[ key ] = 'must be a string';
			}
			else if (metadata.options.minLength && value.length < metadata.options.minLength) {
				result[ key ] = `must be at least ${ metadata.options.minLength } characters long`;
			}
			else if (metadata.options.maxLength && value.length > metadata.options.maxLength) {
				result[ key ] = `must be no more than ${ metadata.options.maxLength } characters long`;
			}
			else if (metadata.options.isAlphanumeric && !/^[a-zA-Z0-9]+$/.test(value)) {
				result[ key ] = 'must be alphanumeric';
			}
		}
	}

	return result;
}
