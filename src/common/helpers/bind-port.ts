/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-19
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { Application as ExpressApp } from "express";
import { createServer }              from "http";
import * as readline                 from "readline";

export const startServer = async(app: ExpressApp, port: number = 3000) => {
	while (true) {
		try {
			const server = createServer(app);
			server.listen(port);
			console.log(`Server listening on port ${ port }`);
			break;
		}
		catch (error) {
			console.error(`Port ${ port } is already in use`);
			const rl     = readline.createInterface(
				{
					input : process.stdin,
					output: process.stdout,
				});
			const answer = await new Promise((resolve) => {
				rl.question('Do you want to try another port? (y/n) ', (answer) => {
					rl.close();
					resolve(answer);
				});
			});
			if (answer !== 'y') {
				process.exit();
			}
			port += 1;
		}
	}
}

