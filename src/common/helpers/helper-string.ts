/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-10-22
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

/**
 * Convert a boolean to a string representation
 * @param {boolean} value
 * @returns {string}
 */
export const boolToStr = (value: boolean): string => {
	return value ? "true" : "false";
}
