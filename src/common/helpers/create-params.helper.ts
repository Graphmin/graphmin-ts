/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-12-21
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import 'reflect-metadata';
import { RequestHandler } from "express";
import { Router }       from "express";
import { ApiAction }    from "../../webserver/api-action";
import { MetaDataKeys } from "../../constants";

export function registerRoutes(router: Router, target: any, instance: any) {
	const prototype = Object.getPrototypeOf(instance);

	// Get all the keys of the instance
	Reflect.ownKeys(prototype).forEach(key => {
		const routeHandler = prototype[ key ];

		// Check if the key has the @Endpoint metadata
		if (Reflect.hasMetadata(MetaDataKeys.Endpoint, prototype, key)) {
			const path   = Reflect.getMetadata(MetaDataKeys.path, prototype, key);
			const method = Reflect.getMetadata(MetaDataKeys.method, prototype, key);
			const params = Reflect.getMetadata(MetaDataKeys.params, prototype, key);

			// Create a new request handler
			const requestHandler: RequestHandler = (req, res, next) => {
				const apiAction = new ApiAction<any>(req, res, next);
				// Validate the parameters
				apiAction.validate(params).then(isValid => {
					if (isValid) {
						// Call the Endpoint method
						routeHandler.call(instance, apiAction);
					}
					else {
						// Send a bad request response if the parameters are invalid
						apiAction.sendBadRequest();
					}
				}).catch(err => {
					// Send an internal server error response if there is an error while validating the parameters
					apiAction.sendError(err);
				});
			};

			// Register the route
			router[ method ](path, requestHandler);
		}
	});
}

/**
 * Creates a parameters object for an Endpoint
 * @param target The target object
 * @param key The key of the method
 */
export function createParameters(target: object, key: string | symbol): any {
	const parameterTypes = Reflect.getMetadata('design:paramtypes', target, key);
	return class {
		constructor(...args: any[]) {
			parameterTypes.forEach((paramType, index) => {
				this[ paramType.name.toLowerCase() ] = args[ index ];
			});
		}
	};
}
