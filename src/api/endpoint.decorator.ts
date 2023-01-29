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

import { MetaDataKeys }    from "../constants";
import { HttpContentType } from "../http/cm.http";
import { HttpMethod }      from "../http/http-method";

export function Endpoint(metadata: EndpointMetadata): MethodDecorator {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const contentType = metadata.contentType;
		metadata.contentType = !contentType ? HttpContentType.JSON  : contentType;
		Reflect.defineMetadata(MetaDataKeys.Endpoint, metadata, target, propertyKey);
	}
}

export interface EndpointMetadata {
	path: string;
	method: HttpMethod;
	contentType?: string;
	summary?: string;
	example?: { [key: string]: string }
	description?: string;
	tags?: string[];
	params?: new() => any;
	hideFromDoc?: boolean
}
