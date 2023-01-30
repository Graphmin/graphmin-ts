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

/**
 * Iterates over a JSON object to find given property,
 * if not found, undefined will be returned
 * @param obj
 * @param {string} propertyName
 * @returns {any}
 */
export const findProperty = (obj: any, propertyName: string): any | undefined => {
	for (let key in obj) {
		if (key === propertyName) {
			return obj;
		}
		if (obj[key] !== null && typeof obj[key] === 'object') {
			const result = findProperty(obj[key], propertyName);
			if (result) {
				return result;
			}
		}
	}
	return undefined;
}
