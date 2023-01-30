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

import "reflect-metadata"
import http       from "http";
import { Server } from "ws";

import { removeTrailingSlash }       from "./common/helpers/helper-url";
import bodyParser                    from "body-parser";
import cors                          from "cors";
import express                       from "express";
import { Router }                    from "express";
import { NextFunction }              from "express";
import { Response }                  from "express";
import { Request }                   from "express";
import { Application as ExpressApp } from "express";
import * as figlet                   from "figlet";
import "reflect-metadata";
import { WebSocketServer }           from "ws";
import { DocRoot }                   from "./api/apidoc/api-doc-generator";
import { ApiDocKeys }                from "./api/apidoc/api-doc-keys";
import { ApiControllerMetadata }     from "./api/controller.decorator";
import { EndpointMetadata }          from "./api/endpoint.decorator";
import { getMetadataProp }           from "./common/helpers/helper-metadata";
import { getMetadata }               from "./common/helpers/helper-metadata";
import { boolToStr }                 from "./common/helpers/helper-string";
import { GraphminAppMetadata }       from "./graphmin.decorator";
import { createHttpServer }          from "./http/cm.http";
import { HttpServer }                from "./http/cm.http";
import { HttpStatusCode }            from "./http/http-status.type";
import { MetaDataKeys }              from "./props";
import { getUserDefinedProperties }  from "./props/props.helper";
import { PropTypeDate }              from "./props/props.metakeys";
import { PropsMetakeys }             from "./props/props.metakeys";
import { PropTypeBool }              from "./props/props.metakeys";
import { PropTypeInt }               from "./props/props.metakeys";
import { PropTypeString }            from "./props/props.metakeys";
import { PropTypePrefix }            from "./props/props.metakeys";
import { SQLiteStore }               from "./session/session.sqlite";
import { ApiAction }                 from "./webserver/api-action";
import { mapFromRequest }            from "./webserver/request-mapper";
import { IWsRequest }                from "./webserver/ws.request";

const apiMetaData = new Map<string, any>();

function print_r(obj: any) {
	console.log("PRINT_R ::", JSON.stringify(obj, null, 2));
}

export class ServerApp {
	public app: ExpressApp;
	public router: Router;
	public httpServer: HttpServer;
	public socketServer: WebSocketServer;

	constructor() {
		this.app = express();
		this.app.disable('x-powered-by');
		this.app.use(bodyParser.urlencoded({ extended: true }));
		//this.httpServer = createHttpServer(this.app);
		//this.socketServer = new WebSocketServer();

		const server = http.createServer(this.app);
		const wss = new Server({ server });

		this.router     = Router();
	}

	public close(): void {
		if (this.httpServer) {
			this.httpServer.close();
		}
	}
}

export const createServerCore = () => {
	return new ServerApp();
}

export abstract class GraphminServer {
	public static metaData: GraphminAppMetadata = { license: [], name: "", version: "" };
	public core: ServerApp;
	public app: ExpressApp;
	public router: Router;
	public httpServer: HttpServer;
	public socketServer: WebSocketServer;
	protected controllers: any[]                = [];

	constructor() {
		this.startupMessage();
		this.app = express();
		this.app.disable('x-powered-by');
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.httpServer = createHttpServer(this.app);
		//this.socketServer = new WebSocketServer();
		this.router     = Router();
	}

	startupMessage(): void {
		console.log(figlet.textSync("REST Server"));
	}

	init() {
		const sessionStore = new SQLiteStore(
			{
				db    : "session",
				memory: true
			});

		this.app.use((req: IWsRequest, res: Response, next: NextFunction) => {
			//req = new WsRequest(req, sessionStore);

			const isWebSocket = req.headers[ 'upgrade' ] === 'websocket';
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

		await this.initControllers(this.router, this.controllers);

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
					console.log(`Server listening on port: ${ port }`);
					resolve(true);
				});
			}
			catch (e) {
				resolve(false);
			}
		});
	}

	/**
	 * Register controller routes
	 */
	protected async initControllers(router: Router, controllers: any[]): Promise<void> {
		controllers.forEach(controller => {
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

					router[ endpointMetadata.method ](`${ controllerData.basePath }${ endpointMetadata.path }`, requestHandler);
				}
			});
		});
	}
}
