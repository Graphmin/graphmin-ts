/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-12-30 11:24
 */

import * as net from "node:net";

// Check if port is free
export function checkPort(port: number) {
	return new Promise<void>((resolve, reject) => {
		const server = net.createServer();
		server.unref();
		server.on('error', err => {
			if (err.message === 'EADDRINUSE') {
				console.error(`Port ${port} is already in use`);
				// Try using a different port
				checkPort(port + 1)
					.then(() => resolve())
					.catch(err => reject(err));
			} else {
				reject(err);
			}
		});
		server.listen(port, () => {
			resolve();
		});
	});
}
