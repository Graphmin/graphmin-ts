/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-16 20:25
 */

import { RequestListener } from "http";
import http                from "http";

export enum HttpHeaders {
	ContentType = 'content-type'
}

export enum HttpContentType {
	JSON = 'application/json',
	JSON_UTF8 = 'application/json; charset=UTF-8',
	JSON_LD = 'application/ld+json',
	HAL_JSON = 'application/hal+json',
	HTML = 'text/html',
	CSS = 'text/css',
	JAVASCRIPT = 'application/javascript',
	TEXT = 'text/plain',
	PNG = 'image/png',
	JPEG = 'image/jpeg',
	GIF = 'image/gif',
	SVG = 'image/svg+xml',
	PDF = 'application/pdf',
	XML = 'application/xml',
	ATOM = 'application/atom+xml',
	RSS = 'application/rss+xml'
}

export type HttpServer = http.Server;

export const createHttpServer = (requestListener?: RequestListener): HttpServer => {
	return http.createServer();
}

class ServerHttp {
	private server;

	start(port: number) {
		this.server = http.createServer((req, res) => {
			// Handle incoming requests here
		});

		this.server.listen(port);
	}

	stop() {
		this.server.close();
	}
}
