/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-14
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */


import { Resolver, Query, Args } from "type-graphql";

function generateResolvers(controllers: any[]) {
	/*return controllers.flatMap(controller => {
		return Object.getOwnPropertyNames(controller.prototype).flatMap(methodName => {
			const method = controller.prototype[methodName];
			if (method.hasOwnProperty("Endpoint")) {
				const Endpoint: Endpoint = method.Endpoint;
				const params: EndpointParams = method.params;

				@Resolver()
				class EndpointResolver {
					@Query(() => params.responseType, { name: Endpoint.name })
					async endpointMethod(@Args() args: any) {
						const instance = new controller();
						return instance[methodName](args);
					}
				}

				return EndpointResolver;
			} else {
				return [];
			}
		});
	});
	 */
}
