/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-11 00:28
 */

import { IncomingMessage } from "http";

export class WsIncomingMessage extends IncomingMessage {
	session: any;
}
