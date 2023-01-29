/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-08-12
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import Database          from 'better-sqlite3';
import { Request }       from "express";
import { Session }       from "express-session";
import { Store }         from 'express-session';
import { SessionConfig } from "./session.config";

export interface ISessionData {
	session_id: string;
	expires: number;
	data: any;
}

export enum DbType {
	File   = "file",
	Memory = "memory"
}

const GET_SESSION_SQL     = 'SELECT * FROM sessions WHERE session_id = ?';
const SET_SESSION_SQL     = 'INSERT INTO sessions (session_id, expires, data) VALUES (?, ?, ?)';
const DESTROY_SESSION_SQL = 'DELETE FROM sessions WHERE session_id = ?';
const CLEAR_SESSION_SQL   = 'DELETE FROM sessions';

export interface ISessionStore {
	regenerate(req: Request, callback: (err?: any) => any): void;
	load(sid: string, callback: (err: any, session?: ISessionData) => any): void;
	createSession(req: Request, session: ISessionData): Session & ISessionData;

	// Gets the session from the store given a session ID and passes it to `callback`.
	// The `session` argument should be a `Session` object if found, otherwise `null` or `undefined` if the session was not found and there was no error.
	// A special case is made when `error.code === 'ENOENT'` to act like `callback(null, null)`.
	get(sid: string, callback: (err: any, session?: ISessionData | null) => void): void;

	/** Upsert a session in the store given a session ID and `ISessionData` */
	set(sid: string, session: ISessionData, callback?: (err?: any) => void): void;

	// Destroys the dession with the given session ID
	destroy(sid: string, callback?: (err?: any) => void): void;

	// Returns all sessions in the store
	all?(callback: (err: any, obj?: ISessionData[] | { [ sid: string ]: ISessionData; } | null) => void): void;

	// Returns the amount of sessions in the store
	length?(callback: (err: any, length: number) => void): void;

	// Delete all sessions from the store
	clear?(callback?: (err?: any) => void): void;

	// "Touches" a given session, resetting the idle timer
	touch?(sid: string, session: ISessionData, callback?: () => void): void;
}

export class SQLiteStore extends Store {
	private db: any;
	private type: DbType;
	private getStmt: any;
	private setStmt: any;
	private destroyStmt: any;
	private clearStmt: any;

	constructor(options: { db: string, memory?: boolean, readonly?: boolean, fileMustExist?: boolean }) {
		super();
		this.db          = new Database(options.db, { fileMustExist: options.fileMustExist });
		this.getStmt     = this.db.prepare(GET_SESSION_SQL);
		this.setStmt     = this.db.prepare(SET_SESSION_SQL);
		this.destroyStmt = this.db.prepare(DESTROY_SESSION_SQL);
		this.clearStmt   = this.db.prepare(CLEAR_SESSION_SQL);
	}

	public async get(sessionId: string) {
		const row = this.getStmt.get(sessionId);
		if (!row) {
			return null;
		}
		if (row.expires < Date.now()) {
			await this.destroy(sessionId);
			return;
		}
		return JSON.parse(row.data);
	}

	public async set(sessionId: string, session: any) {
		const expires = Date.now() + ( session.cookie.maxAge || SessionConfig.SESSION_EXPIRATION );
		const data    = JSON.stringify(session);
		await this.setStmt.run(sessionId, expires, data);
	}

	public async destroy(sessionId: string) {
		await this.destroyStmt.run(sessionId);
	}

	public async clear() {
		await this.clearStmt.run();
	}
}
