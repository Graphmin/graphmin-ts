import { StringBuffer } from "./string-buffer";

/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-21
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

export interface IConversionResult<T> {
	success: boolean;
	result?: T;
	error?: any;
}

/**
 * Converts any input to a string.
 *
 * @param {any} input - The input to be converted.
 * @returns {{ success: boolean, result: string, error: any }} - An object containing a success flag, the resulting string, and an error property if the conversion failed.
 */

/*
export const convertToString = (input: any): IConversionResult<string> => {
	if (input === null || input === undefined) {
		return { success: false, result: '', error: new Error('Input is null or undefined') };
	}
	let str: string;
	if (input.constructor.name === 'CmStringBuffer') {
		try {
			str = input.compileToString();
		} catch (error) {
			return { success: false, result: '', error: error };
		}
	} else {
		switch (typeof input) {
			case 'string':
				str = input;
				break;
			case 'number':
			case 'boolean':
				str = input.toString();
				break;
			case 'object':
				if (Array.isArray(input)) {
					str = input.map(String).join(',');
				} else {
					str = '';
					for (const key in input) {
						if (input.hasOwnProperty(key)) {
							str += `${key}: ${input[key]} `;
						}
					}
				}
				break;
			default:
				return { success: false, result: '', error: new Error('Unable to convert') };
		}
	}
	return { success: true, result: str };
}
*/

/**
 * Converts any input to a string.
 *
 * @param {any} input - The input to be converted.
 * @returns {{ success: boolean, result: string, error: any }} - An object containing a success flag, the resulting string, and an error property if the conversion failed.
 * @throws {Error} - When the CmStringBuffer class doesn't exist in the scope or doesn't have `compileToString` method.
 */
export const convertToString = (input: any): IConversionResult<string> => {
	if (input === null || input === undefined) {
		return { success: false, result: '', error: new Error('Input is null or undefined') };
	}
	let str: string;
	if (input instanceof StringBuffer) {
		try {
			str = input.compileToString();
		} catch (error) {
			return { success: false, result: '', error: error };
		}
	} else if (typeof input === 'string') {
		str = input;
	} else if (typeof input === 'number' || typeof input === 'boolean') {
		str = input.toString();
	} else if (Array.isArray(input)) {
		str = input.map(String).join(',');
	} else if (typeof input === 'object') {
		str = JSON.stringify(input);
	} else {
		return { success: false, result: '', error: new Error('Unable to convert') };
	}
	return { success: true, result: str };
}


/**
 * Converts any input to a string, returns an empty string on error
 *
 * @param {any} input - The input to be converted.
 * @returns {string} - The string representation of the input.
 */
function anyToString(input: any): string {
	return convertToString(input).result;
}
