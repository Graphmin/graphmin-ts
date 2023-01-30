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

import { MetaDataKeys } from "../../constants";

export function getMetadata<T>(key: string, instance: any): T {
	return Reflect.getMetadata(key, instance) as T;
}

export function getMetadataProp<T>(key: string, instance: any, propKey: any): T {
	return Reflect.getMetadata(MetaDataKeys.Endpoint, instance, propKey) as T;
}
