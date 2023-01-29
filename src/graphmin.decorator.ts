/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-07-21
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { MetaDataKeys }   from "./constants";
import { GraphminServer } from "./graphmin.server";

export interface GraphminAppMetadata {
	name: string;
	version: string;
	license: string[];
	description?: string;
	controllers?: any[];
}

export function GraphminApp(metadata: GraphminAppMetadata) {
	return function(constructor: Function) {
		GraphminServer.metaData = metadata;
		Reflect.defineMetadata(MetaDataKeys.graphminApp, metadata, constructor);
	};
}
