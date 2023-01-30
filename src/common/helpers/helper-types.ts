import { NativeTypes } from "../types.enum";

/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-10-22
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */


/**
 * Checks if the @param is of type Boolean
 * @param obj
 * @returns {boolean}
 */
export const isBool = (obj: any): boolean => {
	return typeof obj === NativeTypes.Boolean;
}

/**
 * Checks if the @param is of type String
 * @param obj
 * @returns {boolean}
 */
export const isString = (obj: any): boolean => {
	return typeof obj === NativeTypes.String;
}

/**
 * Checks if the @param is of type Symbol
 * @param obj
 * @returns {boolean}
 */
export const isSymbol = (obj: any): boolean => {
	return typeof obj === NativeTypes.Symbol;
}

/**
 * Checks if the @param is of type Number
 * @param obj
 * @returns {boolean}
 */
export const isNumber = (obj: any): boolean => {
	return typeof obj === NativeTypes.Number;
}

/**
 * Checks if the @param is of type BigInt
 * @param obj
 * @returns {boolean}
 */
export const isBigInt = (obj: any): boolean => {
	return typeof obj === NativeTypes.BigInt;
}

/**
 * Checks if the @param is either Number or BigInt
 * @param obj
 * @returns {boolean}
 */
export const isInt = (obj: any): boolean => {
	return isNumber(obj) || isBigInt(obj);
}

/**
 * Checks if the @param is of type Function
 * @param obj
 * @returns {boolean}
 */
export const isFunc = (obj: any): boolean => {
	return typeof obj === NativeTypes.Function;
}

/**
 * Checks if the @param is of type Function
 * @param obj
 * @returns {boolean}
 */
export const isObj = (obj: any): boolean => {
	return typeof obj === NativeTypes.Object;
}

/**
 * Return the enum option corresponding with given string
 * @param {string} value
 * @returns {NativeTypes}
 */
export const strToNativeEum = (value: string): NativeTypes => {
	value = (value ?? "").toLowerCase();
	if (value in NativeTypes) {
		return NativeTypes[ value ];
	} else {
		return NativeTypes.Undefined;
	}
}
