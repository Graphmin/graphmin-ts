/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-19
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import fs                      from "fs";
import { findUp }              from "../util/os/path.util";
import { IDependenciesResult } from "./dependencies-result.type";

export const getDependencies = (): IDependenciesResult => {
	const packageJsonPath = findUp(process.cwd());
	if (!packageJsonPath) {
		return { success: false, error: `Error: package.json not found.` };
	}
	try {
		const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
		const deps = JSON.parse(packageJsonContent).dependencies;
		return {
			success: true,
			packageJsonFile: packageJsonPath,
			dependencies: deps
		};
	} catch (error) {
		return { success: false, error };
	}
}
