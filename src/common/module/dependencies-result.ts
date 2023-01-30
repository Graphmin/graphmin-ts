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

import { IDependenciesResult } from "./dependencies-result.type";

export class DependenciesResult implements IDependenciesResult {
	success: boolean;
	dependencies?: any;
	error?: any;

	constructor(success: boolean, dependencies?: any, error?: any) {
		this.success = success;
		this.dependencies = dependencies;
		this.error = error;
	}
}

