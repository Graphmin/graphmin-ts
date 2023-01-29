/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-13
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { printR }                from "../../cli/cli.util";
import { getMetadataProp }       from "../../common/helpers/helper-metadata";
import { getMetadata }           from "../../common/helpers/helper-metadata";
import { removeTrailingSlash }   from "../../common/helpers/helper-url";
import { MetaDataKeys }          from "../../constants";
import { LogLevel }              from "../../graphmin.config";
import { GraphminConfig }        from "../../graphmin.config";
import { GraphminAppMetadata }   from "../../graphmin.decorator";
import { PropTypePrefix }        from "../../props/props.metakeys";
import { PropTypeDate }          from "../../props/props.metakeys";
import { PropTypeBool }          from "../../props/props.metakeys";
import { PropTypeInt }           from "../../props/props.metakeys";
import { PropTypeString }        from "../../props/props.metakeys";
import { PropsMetakeys }         from "../../props/props.metakeys";
import { ApiControllerMetadata } from "../controller.decorator";
import { EndpointMetadata }      from "../endpoint.decorator";
import { ApiDocKeys }            from "./api-doc-keys";

export interface IDocRoot {
	openapi: string;
	info: IDocInfo;
	paths: IDocPaths;
}

export interface IDocInfoBase {
	title: string;
	description?: string;
	version?: string;
}

export interface IDocInfo extends IDocInfoBase {
	license?: string[];
}

export class DocRoot implements IDocRoot {
	public openapi: string;
	public info  = new DocInfo();
	public paths = new DocPaths();
}

export class DocInfo implements IDocInfo {
	public title: string;
	public description?: string;
	public license?: string[] = [];
	public version?: string;
}

export interface IDocPaths {
}

export class DocPaths implements IDocPaths {

}

export class ApiDocument extends DocRoot {

	public addEndpoint(endpointMeta: EndpointMetadata): ApiDocument {
		return this;
	}

	public putController(controllerMeta: ApiControllerMetadata): void {
		let controllerDoc = {
			version    : controllerMeta.version,
			basePath   : controllerMeta.basePath,
			requireAuth: controllerMeta.requireAuth
		};

		let endpointDoc = {};

		/*
		 endpointDoc['path'] = endpointMeta.path;
		 endpointDoc['httpMethod'] = endpointMeta.httpMethod;
		 endpointDoc['parameters'] = endpointMeta.parameters;
		 */

	}
}

function getDataType(propMetaKey: string): string {
	const typeStr = propMetaKey.replace("_prop_dt_", "").replace("_", "");

	switch (propMetaKey) {
		case PropsMetakeys.KeyPropString:
			return PropTypeString;

		case PropsMetakeys.KeyPropInt:
			return PropTypeInt;

		case PropsMetakeys.KeyPropBool:
			return PropTypeBool;

		case PropsMetakeys.KeyPropDate:
			return PropTypeDate;
	}

	console.log("getDataType >>>", propMetaKey, ":", typeStr);
	return typeStr;
}

/**
 * Generate an OpenAPI3 Compatible API Documentation
 * @param app
 * @param controllers
 * @returns {object}
 */
export const generateApiDoc = (app: any, controllers: any[]): object => {
	let apiDoc: GraphminAppMetadata = Reflect.getMetadata(MetaDataKeys.graphminApp, app) ?? {};

	let doc              = new ApiDocument();
	doc.info.title       = apiDoc.name;
	doc.info.description = apiDoc.description;

	console.log(">>> App metadata ::", doc);

	const endpoints: any = {};
	apiDoc[ "paths" ]    = endpoints;

	function getUserDefinedProperties(obj: any) {
		const properties = Object.getOwnPropertyNames(obj).filter(property => {
			const descriptor = Object.getOwnPropertyDescriptor(obj, property);
			return ( descriptor && !descriptor.get && !descriptor.set ) && property != "constructor";
		});
		console.log(`All user-defined properties of object: ${ properties }`);
	}

	let endpointPaths = new Map<string, any[]>();

	for (let controller of controllers) {
//	controllers.forEach(controller => {
		const controllerData = getMetadata<ApiControllerMetadata>(MetaDataKeys.apiController, controller);
		const instance       = new controller();
		const prototype      = Object.getPrototypeOf(instance);

		let path         = controllerData.basePath;
		let endpointData = {};
		/*version: controllerData.version
		 };

		 //if (controllerData.summary) endpointData[ ApiDocKeys.summary ] = controllerData.summary;
		 //if (controllerData.tags) endpointData[ ApiDocKeys.tags ] = controllerData.tags.join(",");
		 */
		console.log("CONTROLLER ::", controllerData);

		endpoints[ path ] = endpointData;

		Object.getOwnPropertyNames(prototype).filter(property => {
			return property !== "constructor"
		}).forEach(property => {
			const endpoint   = getMetadataProp<EndpointMetadata>(MetaDataKeys.Endpoint, prototype, property);
			let fullPathpath = endpoint?.path ? `${ path }${ endpoint?.path }` : path;
			fullPathpath     = removeTrailingSlash(fullPathpath);

			if (endpoint && !endpoint.hideFromDoc) {
				let methodData = {};
				let pathData   = {}

				if (GraphminConfig.logging === LogLevel.Full) {
					console.log("ENDPOINT ::", endpoint);
					printR(endpoint, "ENDPOINT");
					printR(pathData, "PATH-DATA");
				}

				let currData = endpoints[ fullPathpath ];
				currData     = !currData ? {} : currData;

				pathData[ endpoint.method ] = methodData;

				Object.assign(currData, pathData);

				if (endpoint.params) {
					let obj           = new endpoint.params();
					const propNames   = Object.getOwnPropertyNames(obj);
					let propData: any = {};

					console.log("propNames ::", propNames);

					if (propNames.length) {
						propData                        = {}
						methodData[ ApiDocKeys.params ] = propData;
					}

					propNames.forEach(param => {
						let paramData      = {};
						propData[ param ]  = paramData;
						let required       = true;
						const metadataKeys = Reflect.getMetadataKeys(obj, param);
						metadataKeys.forEach(metadataKey => {
							if (metadataKey === PropsMetakeys.KeyPropOptional)
								required = false;

							//
							// Data Type
							//
							if (( metadataKey as string ).startsWith(PropTypePrefix)) {
								paramData[ ApiDocKeys.schema ] = {
									"type": getDataType(metadataKey)
								};

								console.log("getDataType ::", getDataType(metadataKey));
							}
						});

						paramData[ ApiDocKeys.required ] = required ? "true" : "false";
					});
				}

			}
			else {
				console.log("NO ENDPOINT!!!");
			}

		});

		console.log("endpointPaths", endpointPaths);
	}

	printR(apiDoc);

	return apiDoc;
}


