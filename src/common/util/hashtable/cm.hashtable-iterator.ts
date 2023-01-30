import { CmHashTable } from "./cm.hashtable";

/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 *
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-14
 * @description:
 * HashTableIterator class implements the Iterator interface.
 * It takes in a HashTable object in its constructor and initializes the keys array
 * with an ordered list of keys from the index Map of the HashTable.
 *
 * It also maintains an index variable that keeps track of the current position in the keys array.
 * The next method is used to iterate through the keys array, and it returns the key-value pair
 * for the current index. If all the keys have been iterated through, the method
 * returns a done: true value, indicating that the iteration is complete.
 */

export class CmHashTableIterator<T> implements Iterator<[string, T]> {
	private keys: T[];
	private index: number;
	private data: CmHashTable<T>;

	constructor(data: CmHashTable<T>) {
		this.data = data;
		this.keys = Array.from(data.getIndexKeys());
		this.keys.sort((a: T, b: T) => {
			return 0; // data.getIndex(a)! - data.getIndex(b)!;
		});
		this.index = 0;
	}

	next(): IteratorResult<any> { //[string, T]> {
		if (this.index >= this.keys.length) {
			return {
				done: true,
				value: undefined
			};
		}
		const key = this.keys[this.index];
		const value = "value";// this.data.get(key);
		this.index++;
		return {
			done: false,
			value: [key, value]
		};
	}
}
