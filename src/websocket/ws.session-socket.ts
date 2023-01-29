/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-11 16:07
 */

import { WebSocket } from "ws";

export class SessionWebSocket extends WebSocket {
	session: any;

	constructor(options: any, session: any) {
		super(options);
		this.session = session;
	}

	/*
	 public on(Message: WsEvents, param2: (message: string) => void): void {

	 }
	 */
}
