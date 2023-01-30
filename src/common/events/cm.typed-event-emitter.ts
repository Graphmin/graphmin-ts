/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-21
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { EventEmitter } from 'events';

class TypedEventEmitter<T> {
	private emitter: EventEmitter;

	constructor() {
		this.emitter = new EventEmitter();
	}

	emit(event: string | symbol, data: T) {
		this.emitter.emit(event, data);
	}

	on(event: string | symbol, listener: (data: T) => void) {
		this.emitter.on(event, listener);
	}

	addListener(event: string | symbol, listener: (data: T) => void) {
		this.emitter.addListener(event, listener);
	}
}
