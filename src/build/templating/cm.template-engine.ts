import { ModuleLoader }       from "../../common/module/module.loader";
import { ModuleLoaderResult } from "../../common/module/module.loader-result";

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

export interface ICmTemplateEngine {
	render(template: string, data: object): string;
}

export class CmTemplateEngine implements ICmTemplateEngine {
	engine: ICmTemplateEngine;

	constructor() {
	}

	protected loadEngine(): ICmTemplateEngine {
		const loader = ModuleLoader.getInstance();
		const loadResult: ModuleLoaderResult<ICmTemplateEngine> = loader.loadModule<ICmTemplateEngine>("ejs");

		if (loadResult.success) {
			return loadResult.module;
		} else {
			return undefined;
		}
	}

	public render(template: string, data: object): string {
		return "";
	}

}
