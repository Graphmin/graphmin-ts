/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-22
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

export const escapeSqlString = (str: string): string => {
	const escapeChars = {
		"\0": "\\0",
		"\x08": "\\b",
		"\x09": "\\t",
		"\x1a": "\\z",
		"\n": "\\n",
		"\r": "\\r",
		"\"": "\\\"",
		"'": "\\'",
		"\\": "\\\\",
		"%": "\\%"
	};

	return str.split('').map(char => escapeChars[char] || char).join('');
}
