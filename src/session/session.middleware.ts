/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-11-23
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { NextFunction }              from "express";
import { Application as ExpressApp } from "express";
import { Request }                   from "express";
import { Response }   from "express";
import { IWsRequest } from "../webserver/ws.request";

export class SessionMiddleware {
	public static init(app: ExpressApp): void {
		app.use(async (req: Request, res: Response, next: NextFunction) => {
			/*
			const cookie = req.headers.cookie;
			if (!cookie) {
				return next();
			}

			const sessionId = cookie.split('sessionId=')[ 1 ];
			if (!sessionId) {
				return next();
			}

			const db      = await dbPromise;
			const session = await db.get('SELECT * FROM sessions WHERE id = ?', sessionId);
			if (!session) {
				return next();
			}

			req.session = JSON.parse(session.data);
			*/
			next();
		});


		app.use((req: IWsRequest, res: Response, next: NextFunction) => {
			/*if (!req.sess) {
				req.sess = {};
				res.setHeader('Set-Cookie', 'sessionId=' + uuid.v4());
			}

			req.saveSession = async () => {
				const db   = await dbPromise;
				const data = JSON.stringify(req.session);
				await db.run('INSERT INTO sessions (id, data) VALUES (?, ?)', req.headers.cookie.split('sessionId=')[ 1 ], data);
			};
			 */

			next();
		});

	}
}
