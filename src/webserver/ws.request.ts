/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-11-11
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { Request }      from "express";
import { ISessionData } from "../session/session.sqlite";
import { SQLiteStore }  from "../session/session.sqlite";

export interface IWsRequest extends Request {
	wsRequest?: boolean;
	getSession(sessionId: string): Promise<ISessionData>;
}

/*
export class CmRequest implements IWsRequest {
	public isWebSocket: boolean;

	Object.setPrototypeOf(Object.getPrototypeOf(app.request), FakeRequest.prototype)
	Object.setPrototypeOf(Object.getPrototypeOf(app.response), FakeResponse.prototype)

	constructor(req: Request, isWebSocket: boolean) {
		this.isWebSocket = isWebSocket;
	}

	public send(data: any) {
		if (this.isWebSocket) {
			const ws = this as WebSocket;
			ws.send(data);
		} else {
			const res = this.res as Response;
			res.send(data);
		}
	}

	public getSession(sessionId: string): Promise<ISessionData> {
		return Promise.resolve(undefined);
	}
}
*/

/*
export class WsRequest extends Request {
	public session: ISessionData | null;
	private sessionStore: SQLiteStore;

	constructor(req: WsRequest, sessionStore: SQLiteStore) {
		super(req);
		this.sessionStore = sessionStore;
	}

	public async getSession(sessionId: string): Promise<ISessionData> {
		if (this.session) {
			return this.session;
		}

		this.session = await this.sessionStore.get(sessionId);
		return this.session;
	}

	public async saveSession(sessionId: string, session: ISessionData): Promise<boolean> {
		try {
			this.session = session;
			await this.sessionStore.set(sessionId, session);

			return true;
		} catch (e) {
			return false;
		}
	}
}
*/
