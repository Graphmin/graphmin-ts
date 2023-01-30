/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-07-22
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { MetaDataKeys } from "../constants";

export interface ApiControllerMetadata {
	basePath: string;
	version?: string;
	summary?: string;
	tags?: string[];
	requireAuth?: boolean
}

export function ApiController(metadata: ApiControllerMetadata): ClassDecorator {
	return (target: Function) => {
		Reflect.defineMetadata(MetaDataKeys.apiController, metadata, target);
	};
}
