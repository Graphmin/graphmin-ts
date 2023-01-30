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

/**
 * Removes the trailing slash from a URL.
 *
 * @param {string} url - The URL to modify.
 * @returns {string} The modified URL without a trailing slash.
 */
export function removeTrailingSlash(url: string): string {
	if (url.endsWith('/')) {
		return url.slice(0, -1);
	}
	return url;
}

/**
 * Ensures that a URL has a trailing slash.
 *
 * @param {string} url - The URL to modify.
 * @returns {string} The modified URL with a trailing slash.
 */
export function addTrailingSlash(url: string): string {
	if (!url.endsWith('/')) {
		return url + '/';
	}
	return url;
}
