#!/usr/bin/env node

/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-12-12
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import * as net     from "net";
import * as process from 'process';


// parse the port number from the command line arguments
const port = parseInt(process.argv[2], 10);

if (!port) {
	console.error(`Usage: kill-process-on-port <port>`);
	process.exit(1);
}

// find the PID of the process listening on the given port
const pid = findPid(port);

if (!pid) {
	console.error(`No process found listening on port ${port}`);
	process.exit(1);
}

// kill the process with the given PID
process.kill(pid);

console.log(`Killed process ${pid}`);

function findPid(port: number): number | null {
	// get a list of all the active network connections
	const connections = []; //net.connections();

	// find the connection that is listening on the given port
	const connection = connections.find((conn) => conn.localPort === port);

	// return the PID of the process associated with the connection
	return connection ? connection.pid : null;
}
