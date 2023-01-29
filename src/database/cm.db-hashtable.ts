/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 **
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-11-02
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { CmEvent }     from "../common/events/cm.event";
import { CmHashTable } from "../common/util/hashtable/cm.hashtable";

class DbHashtable<T> extends CmHashTable<T> {
	private tableName: string;

	constructor(tableName: string, useEventEmitter: boolean = false) {
		super(useEventEmitter);
		this.tableName = tableName;

		this.on(CmEvent.Add, (event) => {
			console.log(`INSERT INTO ${this.tableName} (${event.key}, ${event.value})`);
		});

		this.on(CmEvent.Update, (event) => {
			console.log(`UPDATE ${this.tableName} SET ${event.value} WHERE ${event.key}`);
		});

		this.on(CmEvent.Delete, (key) => {
			console.log(`DELETE FROM ${this.tableName} WHERE ${key}`);
		});
	}

	put(key: string, value: T) {
		super.put(key, value);
		this.emitEvent(CmEvent.Add, key);
	}

	remove(key: string) {
		super.remove(key);
	}
}
