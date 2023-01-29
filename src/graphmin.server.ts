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

import "reflect-metadata";
import bodyParser                    from "body-parser";
import cors                          from "cors";
import express                       from "express";
import { Router }                    from "express";
import { NextFunction }              from "express";
import { Response }                  from "express";
import { Request }                   from "express";
import { Application as ExpressApp } from "express";
import * as figlet                   from "figlet";
import { WebSocketServer }           from "ws";
import { getUserDefinedProperties }  from "./props/props.helper";
import { ApiAction }                 from "./webserver/api-action";
import { DocRoot }                   from "./api/apidoc/api-doc-generator";
import { ApiDocKeys }                from "./api/apidoc/api-doc-keys";
import { ApiControllerMetadata }     from "./api/controller.decorator";
import { EndpointMetadata }          from "./api/endpoint.decorator";
import { getMetadataProp }           from "./common/helpers/helper-metadata";
import { getMetadata }               from "./common/helpers/helper-metadata";
import { boolToStr }                 from "./common/helpers/helper-string";
import { mapFromRequest }            from "./webserver/request-mapper";
import { removeTrailingSlash }       from "./common/helpers/helper-url";
import { GraphminAppMetadata } from "./graphmin.decorator";
import { createHttpServer }         from "./http/cm.http";
import { HttpServer }               from "./http/cm.http";
import { HttpStatusCode }           from "./http/http-status.type";
import { MetaDataKeys }             from "./props";
import { PropTypeDate }             from "./props/props.metakeys";
import { PropsMetakeys }            from "./props/props.metakeys";
import { PropTypeBool }             from "./props/props.metakeys";
import { PropTypeInt }              from "./props/props.metakeys";
import { PropTypeString }           from "./props/props.metakeys";
import { PropTypePrefix }           from "./props/props.metakeys";
import { SQLiteStore }              from "./session/session.sqlite";
import { IWsRequest }               from "./webserver/ws.request";

const apiMetaData = new Map<string, any>();

function print_r(obj: any) {
	console.log("PRINT_R ::", JSON.stringify(obj, null, 2));
}

export abstract class GraphminServer {
	public static metaData: GraphminAppMetadata = { license: [], name: "", version: "" };
	protected controllers: any[]                = [];
	public app: ExpressApp;
	public router: Router;
	public httpServer: HttpServer;
	public socketServer: WebSocketServer;

	constructor() {
		this.startupMessage();
		this.app = express();
		this.app.disable('x-powered-by');
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.httpServer   = createHttpServer(this.app);
		//this.socketServer = new WebSocketServer();
		this.router       = Router();
	}

	startupMessage(): void {
		console.log(figlet.textSync("REST Server"));
	}

	init() {
		const app          = express();
		const sessionStore = new SQLiteStore(
			{
				db    : "session",
				memory: true
			});

		app.use((req: IWsRequest, res: Response, next: NextFunction) => {
			//req = new WsRequest(req, sessionStore);

			const isWebSocket = req.headers['upgrade'] === 'websocket';

			const url = req.protocol + '://' + req.get('host') + req.originalUrl;

			next();
		});
	}

	/**
	 * Enables the use of cors headers
	 * @param {string} origin
	 * @returns {GraphminServer}
	 */
	useCors(...origin: string[]): GraphminServer {
		if (!origin || !origin.length) origin = [ "*" ];
		this.app.use(
			cors({
					 origin: origin
				 }));

		return this;
	}

	/**
	 * Register controller routes
	 */
	protected async initControllers(): Promise<void> {
		this.controllers.forEach(controller => {
			const controllerData = getMetadata<ApiControllerMetadata>(MetaDataKeys.apiController, controller);
			const instance       = new controller();
			const prototype      = Object.getPrototypeOf(instance);
			Object.getOwnPropertyNames(prototype).forEach(property => {
				const endpointMetadata = Reflect.getMetadata(MetaDataKeys.Endpoint, instance, property);

				if (endpointMetadata) {
					const requestHandler = async (req: Request, res: Response, next: NextFunction) => {
						const apiAction = new ApiAction(req, res, next);

						let valid: boolean = true;
						let params: object = null;

						if (!endpointMetadata.params) {
							console.log("No endpointMetadata params!");
						}
						else {
							console.log("req.query ::", req.query);
							console.log("req.params ::", req.params);
							console.log("req.body ::", req.body);

							let obj         = new endpointMetadata.params();
							const paramMeta = Reflect.getMetadataKeys(endpointMetadata.params.prototype);

							console.log("Param metadata ::", paramMeta);

							Object.getOwnPropertyNames(obj).forEach(param => {
								console.log("xx --param NAME :::", param);

								let cp = Reflect.getMetadata("_prop_validation_", obj);
								console.log("xx -- param VALIADTION :::", cp);
							});

							if (req.query[ "help" ]) {
								console.log("HELP");
							}

							/*
							 function mapRequest2(req: Request, params: any): object {
							 let result = new endpointMetadata.params();
							 try {
							 console.log("\n\nmapRequest :: -->");
							 let values = {};
							 Object.assign(values, req.params);
							 Object.assign(values, req.query);
							 Object.assign(values, req.body);

							 Object.keys(result).forEach(key => {
							 const value = values[ key ];
							 console.log("mapRequest2 :: DATA ::", value);
							 let dataType   = Reflect.getMetadata(MetaDataKeys.dataType, result, key);
							 let designType = Reflect.getMetadata(MetaDataKeys.designType, result, key);

							 let validation = Reflect.getMetadata("validation", result, key);

							 console.log("mapRequest2 :: Validation ::", validation);
							 console.log("mapRequest2 :: Data Type ::", dataType);
							 console.log("mapRequest2 :: Design Type ::", designType);

							 switch (designType) {
							 case Number:
							 result[ key ] = parseInt(value, 10);
							 break;

							 case Boolean:
							 result[ key ] = result[ key ] = value === 'true';
							 break;

							 case Date:
							 result[ key ] = new Date(value);
							 break;

							 default:
							 result[ key ] = value;
							 break
							 }
							 });
							 }
							 catch (e) {
							 console.log("TebbP ::", e);
							 }
							 return result;
							 }

							 let mapped = mapRequest2(req, endpointMetadata.params);


							 console.log("\n\nMAPPED ::", mapped);
							 console.log("\n\n");

							 const metadataKeys   = Reflect.getMetadataKeys(obj);

							 console.log("\n\n\n----- metadataKeys ----");
							 console.log("Keys ::", Reflect.getMetadataKeys(obj));
							 console.log("Keys 1::", Reflect.getOwnMetadataKeys(obj));


							 function getAllMetadataKeys(obj: any) {
							 const keys = Reflect.getOwnMetadataKeys(obj);
							 console.log(`**** All metadata keys for object: ${keys}`);
							 }

							 getAllMetadataKeys(new UserParams());

							 console.log("--------------------\n\n\n");


							 console.log("AMetaProp 1 ::", endpointMetadata.params.prototype);
							 console.log("AMetaProp 2 ::", obj);

							 function fo(proto) {
							 try {
							 const metadataKeys   = Reflect.getMetadataKeys(proto);
							 const validationKeys = metadataKeys.filter(key => key.startsWith('validation:'));
							 console.log("UUUUUUUUUUUUU :: >> ::", validationKeys);

							 validationKeys.forEach((key) => {
							 console.log(Reflect.getMetadata(key, proto));
							 });
							 } catch (e) {
							 console.log("fo :: error ::", e);
							 }
							 }

							 console.log("Property Decorators ::", getPropDecorators(obj))

							 fo(obj);

							 const descriptor = Reflect.getMetadata(MetaDataKeys.dataType, obj, "id"); //Object.getOwnPropertyDescriptors(obj);
							 console.log("AMetaProp :: desc ::", descriptor);

							 params = mapFromRequest(req, endpointMetadata.params);

							 console.log("endpointMetadata.params ::", endpointMetadata.params);
							 console.log("newParams ::", params);
							 */
							params = mapFromRequest(req, endpointMetadata.params);
							mapFromRequest(req, obj);

							console.log("PARAMS >> ::", params);

							valid = await apiAction.validate(params);
						}

						if (valid) {
							let res: any = null;

							if (params) {
								res = await prototype[ property ].call(controller, apiAction, params);
								console.log("prototype RESP ::", res);
							}
							else {
								res = await prototype[ property ].call(controller, apiAction);
							}

							apiAction.sendData(res);
						}
					}

					this.router[ endpointMetadata.method ](`${ controllerData.basePath }${ endpointMetadata.path }`, requestHandler);
				}
			});
		});
	}

	/**
	 * Generate an OpenAPI3 Compatible API Documentation
	 * @param app
	 * @param controllers
	 * @returns {object}
	 */
	public extractControllerMetaData(app: any, controllers?: any[]): object {
		let appMetadata = Reflect.getMetadata(MetaDataKeys.graphminApp, app) ?? {};
		controllers     = !controllers ? this.controllers : controllers;

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

		console.log(">>> App metadata ::", appMetadata);

		const endpoints: any            = {};
		appMetadata[ ApiDocKeys.paths ] = endpoints;

		/**
		 * Attach a content type node to an object
		 * @param obj
		 * @param {EndpointMetadata} endpoint
		 * @param {string} contentType
		 */
		function addResponses(obj: any, endpoint?: EndpointMetadata, contentType?: string) {
			obj[ "responses" ] = {
				"200": {
					content: !endpoint?.contentType ? contentType : endpoint?.contentType
				}
			}
		}

		let endpointData = {};

		//
		// Iterate through all controllers, extracting endpoints
		//
		controllers.forEach(controller => {
			const controllerData = getMetadata<ApiControllerMetadata>(MetaDataKeys.apiController, controller);
			const instance       = new controller();
			const prototype      = Object.getPrototypeOf(instance);
			let path             = controllerData.basePath;
			const propNames      = getUserDefinedProperties(prototype);

			for (const property of propNames) {
				let endpointMetaData = getMetadataProp<EndpointMetadata>(MetaDataKeys.Endpoint, instance, property);

				if (!endpointMetaData) {
					continue;
				}

				// Assemble path from controller basePath and endpointPath
				let fullPathpath = endpointMetaData?.path ? `${ path }${ endpointMetaData?.path }` : path;
				fullPathpath     = removeTrailingSlash(fullPathpath);

				// Make sure the path is in the Endpoint object
				if (!endpoints.hasOwnProperty(fullPathpath)) {
					endpoints[ fullPathpath ] = {};
				}

				let methodData                                       = {};
				endpoints[ fullPathpath ][ endpointMetaData.method ] = methodData;

				if (endpointMetaData && !endpointMetaData.hideFromDoc) {
					//console.log("endpointMetaData ::", endpointMetaData);

					//let methodData = endpoints[ fullPathpath ][ endpointMetaData.method ];
					//console.log("methodData::", methodData);
					//console.log("endpointData::", endpointData);

					addResponses(methodData);

					// Add params, if any
					if (endpointMetaData.params) {
						let obj           = new endpointMetaData.params();
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

									//console.log("getDataType ::", getDataType(metadataKey));
								}
							});

							paramData[ ApiDocKeys.required ] = boolToStr(required);
						});
					}

				}
				else {
					console.log("NO ENDPOINT!!!");
				}
			}
		});

		//print_r(appMetadata);

		return endpoints;
	}

	public generateApiDoc(app: any, controllers?: any[]): object {
		const meta       = GraphminServer.metaData;
		let doc          = new DocRoot();
		doc.openapi      = "openapi3";
		doc.info.title   = meta.name;
		doc.info.license = meta.license
		doc.info.version = meta.version;

		let data = this.extractControllerMetaData(app, controllers);

		doc.paths = data;

		return doc;
	}

	public async setControllers(controllers: any[]): Promise<GraphminServer> {
		this.controllers = controllers;

		await this.initControllers();

		this.app.use(this.router);

		this.app.get("/healthcheck", (req, res) => {
			res.status(HttpStatusCode.OK).json(
				new Date()
			)
		});

		let metadata = this.extractControllerMetaData(this);
		console.log("METADATA ::", metadata);

		return this;
	}

	/**
	 * Start the web server
	 * @returns {Promise<boolean>}
	 */
	public startServer(port: number = 3000): Promise<boolean> {
		return new Promise((resolve) => {
			try {
				this.app.listen(port, () => {
					console.log(`Server listening on port: ${port}`);
					resolve(true);
				});
			}
			catch (e) {
				resolve(false);
			}
		});
	}
}

/*
 let params    = new UserParams();
 params.driver = true;

 console.log("Validate Props ::",
 validateProps(params)
 );
 */

/*
 public extractControllerMetaData() generateApiDoc(app: any, controllers?: any[]): object {
 let appMetadata = Reflect.getMetadata(MetaDataKeys.graphminApp, app) ?? {};
 controllers = !controllers ? this.controllers : controllers;

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

 console.log(">>> App metadata ::", appMetadata);

 const endpoints: any            = {};
 appMetadata[ ApiDocKeys.paths ] = endpoints;

 / **
 * Attach a content type node to an object
 * @param obj
 * @param {EndpointMetadata} endpoint
 * @param {string} contentType
 * /
 function addResponses(obj: any, endpoint?: EndpointMetadata, contentType?: string) {
 obj[ "responses" ] = {
 "200": {
 content: !endpoint?.contentType ? contentType : endpoint?.contentType
 }
 }
 }

 let endpointData = {};

 //
 // Iterate through all controllers, extracting endpoints
 //
 controllers.forEach(controller => {
 const controllerData = getMetadata<ApiControllerMetadata>(MetaDataKeys.apiController, controller);
 const instance       = new controller();
 const prototype      = Object.getPrototypeOf(instance);
 let path             = controllerData.basePath;
 const propNames      = getUserDefinedProperties(prototype);

 for (const property of propNames) {
 let endpointMetaData = getMetadataProp<EndpointMetadata>(MetaDataKeys.Endpoint, instance, property);

 if (!endpointMetaData) {
 continue;
 }

 // Assemble path from controller basePath and endpointPath
 let fullPathpath = endpointMetaData?.path ? `${ path }${ endpointMetaData?.path }` : path;
 fullPathpath     = removeTrailingSlash(fullPathpath);

 // Make sure the path is in the Endpoint object
 if (!endpoints.hasOwnProperty(fullPathpath)) {
 endpoints[ fullPathpath ] = {};
 }

 let methodData = {};
 endpoints[ fullPathpath ][ endpointMetaData.method ] = methodData;

 if (endpointMetaData && !endpointMetaData.hideFromDoc) {
 console.log("endpointMetaData ::", endpointMetaData);

 //let methodData = endpoints[ fullPathpath ][ endpointMetaData.method ];

 console.log("methodData::", methodData);
 console.log("endpointData::", endpointData);

 addResponses(methodData);

 // Add params, if any
 if (endpointMetaData.params) {
 let obj           = new endpointMetaData.params();
 const propNames   = Object.getOwnPropertyNames(obj);
 let propData: any = {};

 console.log("propNames ::", propNames);

 if (propNames.getLength) {
 propData                        = {}
 methodData[ ApiDocKeys.params ] = propData;
 }

 propNames.forEach(param => {
 console.log("PARAM ::", param);

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

 paramData[ ApiDocKeys.required ] = boolToStr(required);
 });
 }

 }
 else {
 console.log("NO ENDPOINT!!!");
 }
 }
 });

 print_r(appMetadata);

 return;

 this.controllers.forEach(controller => {
 const controllerData = getMetadata<ApiControllerMetadata>(MetaDataKeys.apiController, controller);
 //const prototype      = controller.prototype;

 Object.getOwnPropertyNames(controller).forEach(property => {
 console.log("PROOOOP :", property);

 const endpoint = getMetadataProp<EndpointMetadata>(MetaDataKeys.Endpoint, controller, property);

 if (endpoint) {
 let par = endpoint.params;

 if (endpoint.params) {
 let params = new endpoint.params();
 console.log("PARAMS ::", params);
 }

 const path        = `${ controllerData.basePath }${ endpoint.path }`;
 endpoints[ path ] = {};
 }
 });
 });

 return endpoints;
 }
 */
