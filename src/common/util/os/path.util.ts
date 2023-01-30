/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-12-12
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import fs   from "fs";
import path from "path";

export const findUp = (dir: string): string | null => {
	let currentDir = path.resolve(dir);
	while (currentDir !== '/') {
		const packageJsonPath = path.join(currentDir, 'package.json');
		if (fs.existsSync(packageJsonPath)) {
			return packageJsonPath;
		}
		currentDir = path.dirname(currentDir);
	}
	return null;
}
