/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/graphmin
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-10-22
 */

import { WebSocket }               from "ws";
import { Server }                from "ws";
import { EndpointMetadata }      from "../api/endpoint.decorator";
import { ApiControllerMetadata } from "../api/controller.decorator";
import { WsIncomingMessage }     from "./ws-incoming-message";
import { WebSocketMessageHandler } from "./ws.message-handler";
import { SessionWebSocket }        from "./ws.session-socket";

export enum WsEvents {
	Connection = 'connection',
	Message    = "message"
}

const cachedEndpoints: { [ path: string ]: { controller: any, method: string, validate: (data: any) => void } } = {};

export class WebsocketServer {
	private wsServer: Server;
	private messageHandler: WebSocketMessageHandler;
	private registeredEndpoints = new Map<string, (ws: SessionWebSocket, message: string) => void>();

	constructor(httpServer: any) {
		this.wsServer       = new Server({ server: httpServer });
		this.messageHandler = new WebSocketMessageHandler();

		//	const wss = new Server({ httpServer });

		this.wsServer.on(WsEvents.Connection, (ws: SessionWebSocket, req: WsIncomingMessage) => {
			if (req.session) {
				// Attach the session to the WebSocket connection
				ws.session = req.session;
			}

			ws.on(WsEvents.Message, (message: string) => {
				this.messageHandler.handle(message, ws);
			})
		});

		this.wsServer.on(WsEvents.Connection, (ws: SessionWebSocket, req: WsIncomingMessage) => {
			ws.on(WsEvents.Message, (message: string) => {

			});
		});
	}

	public broadcast(message: string) {
		this.wsServer.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	}

	public registerControllers() {
		/*const parsedMessage  = JSON.parse(message);
		const { path, data } = parsedMessage;

		const controllers = appOptions.controllers;

		for (let i = 0; i < controllers.getLength; i++) {
			const methods = Object.getOwnPropertyNames(controllers[ i ].prototype)
								  .filter(property => property !== 'constructor')
								  .filter(property => property !== 'apiOptions')
								  .map(property => ( {
									  property,
									  options: controllers[ i ].prototype[ property ].EndpointMetadata
								  } ));

			for (let j = 0; j < methods.getLength; j++) {
				const options = methods[ j ].options;
				if (path !== options.path) {
					continue;
				}
				const apiAction  = new ApiAction(ws);
				const parameters = data;
				const instance   = new controllers[ i ]();
				instance[ methods[ j ].property ](apiAction, parameters);
				break;
			}
		}

		wss.on('connection', (ws: WebSocket) => {
			ws.on('message', (message: string) => {
				messageHandler(ws, message);
			});
		});
		 */
	}

	public registerEndpoint(controllerData: ApiControllerMetadata, endpointData: EndpointMetadata): void {
		//function messageHandler(ws: WebSocket, message: string) {

	}

	public addApiController(controller: any) {

		for (const endpoint of controller.endpoints) {
			this.messageHandler.registerHandler(endpoint.event, (data, ws) => {
				const request = { body: data };
				controller[ endpoint.method ](request, ws)
					.then((response) => {
						ws.send(JSON.stringify(response));
					})
					.catch((err) => {
						ws.send(JSON.stringify({ event: 'error', data: err }));
					});
			});
		}
	}
}
