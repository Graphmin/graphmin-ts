/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-07-23
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { readFileSync }   from "fs";
import { writeFileSync }  from "fs";
import { CmEventEmitter } from "../../events/cm.event-emitter";
import { CmAvlTreeNode }  from "./cm.avl-tree-node";
import { IHashtable }     from "./cm.hashtable.type";

export class CmHashTable<T> implements IHashtable<T> {
	private data: CmAvlTreeNode<T>;
	private index: Map<T, number>;
	private eventEmitter?: CmEventEmitter;

	constructor(useEventEmitter: boolean = false) {
		this.data = null;
		if (useEventEmitter) {
			this.eventEmitter = new CmEventEmitter();
		}
		else {
			this.eventEmitter = undefined;
		}
	}

	/**
	 * Return the internaldata storage
	 * @returns {CmAvlTreeNode<T>}
	 */
	getData(): CmAvlTreeNode<T> {
		return this.data;
	}

	getIndexKeys(): IterableIterator<T> {
	return this.index.keys();
}

	/**
	 * Adds a new key-value pair to the hashtable
	 * @param key The key of the key-value pair
	 * @param value The value of the key-value pair
	 */
	put(key: string, value: T): IHashtable<T> {
		this.data = this.insert(this.data, key, value);
		return this;
	}

	/**
	 * Remove a key-value pair from the hashtable.
	 * @param key The key to remove.
	 */
	remove(key: string): void {
		this.data = this.delete(this.data, key);
	}

	/**
	 * Retrieves the value associated with a key
	 * @param key The key to retrieve the value for
	 * @returns The value associated with the key
	 */
	get(key: string): T | undefined {
		let current = this.data;
		while (current != null) {
			if (key < current.key) {
				current = current.left;
			}
			else if (key > current.key) {
				current = current.right;
			}
			else {
				return current.value;
			}
		}
		return undefined;
	}

	contains(key: string): boolean {
		return this.get(key) !== undefined;
	}

	size(): number {
		return this.getSize(this.data);
	}

	protected insert(node: CmAvlTreeNode<T>, key: string, value: T): CmAvlTreeNode<T> {
		if (node == null) {
			return new CmAvlTreeNode(key, value);
		}
		if (key < node.key) {
			node.left = this.insert(node.left, key, value);
		}
		else if (key > node.key) {
			node.right = this.insert(node.right, key, value);
		}
		else {
			node.value = value;
			return node;
		}
		node.height   = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
		const balance = this.getBalance(node);

		if (balance > 1 && key < node.left.key) {
			return this.rightRotate(node);
		}

		if (balance < -1 && key > node.right.key) {
			return this.leftRotate(node);
		}

		if (balance > 1 && key > node.left.key) {
			node.left = this.leftRotate(node.left);
			return this.rightRotate(node);
		}

		if (balance < -1 && key < node.right.key) {
			node.right = this.rightRotate(node.right);
			return this.leftRotate(node);
		}

		return node;
	}

	protected delete(node: CmAvlTreeNode<T>, key: string): CmAvlTreeNode<T> {
		if (node == null) {
			return node;
		}

		if (key < node.key) {
			node.left = this.delete(node.left, key);
		}
		else if (key > node.key) {
			node.right = this.delete(node.right, key);
		}
		else {
			if (node.left == null || node.right == null) {
				node = node.left || node.right;
			}
			else {
				const minNode = this.getMinNode(node.right);
				node.key      = minNode.key;
				node.value    = minNode.value;
				node.right    = this.delete(node.right, minNode.key);
			}
		}

		if (node == null) {
			return node;
		}

		node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

		const balance = this.getBalance(node);

		if (balance > 1 && this.getBalance(node.left) >= 0) {
			return this.rightRotate(node);
		}

		if (balance > 1 && this.getBalance(node.left) < 0) {
			node.left = this.leftRotate(node.left);
			return this.rightRotate(node);
		}

		if (balance < -1 && this.getBalance(node.right) <= 0) {
			return this.leftRotate(node);
		}

		if (balance < -1 && this.getBalance(node.right) > 0) {
			node.right = this.rightRotate(node.right);
			return this.leftRotate(node);
		}

		return node;
	}

	protected getHeight(node: CmAvlTreeNode<T>): number {
		if (node == null) {
			return 0;
		}
		return node.height;
	}

	protected getSize(node: CmAvlTreeNode<T>): number {
		if (node == null) {
			return 0;
		}
	}

	private getBalance(node: CmAvlTreeNode<T>): number {
		if (node == null) {
			return 0;
		}
		return this.getHeight(node.left) - this.getHeight(node.right);
	}

	private getMinNode(node: CmAvlTreeNode<T>): CmAvlTreeNode<T> {
		while (node.left != null) {
			node = node.left;
		}
		return node;
	}

	private leftRotate(node: CmAvlTreeNode<T>): CmAvlTreeNode<T> {
		const newRoot  = node.right;
		node.right     = newRoot.left;
		newRoot.left   = node;
		node.height    = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
		newRoot.height = 1 + Math.max(this.getHeight(newRoot.left), this.getHeight(newRoot.right));
		return newRoot;
	}

	private rightRotate(node: CmAvlTreeNode<T>): CmAvlTreeNode<T> {
		const newRoot  = node.left;
		node.left      = newRoot.right;
		newRoot.right  = node;
		node.height    = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
		newRoot.height = 1 + Math.max(this.getHeight(newRoot.left), this.getHeight(newRoot.right));
		return newRoot;
	}

	public getIndex(key: T): number | undefined {
		if (this.index.has(key)) {
			return this.index.get(key);
		}
		else {
			return undefined;
		}
	}

	/**
	 * Returns a standard array representation of the hashtable.
	 * @returns An array of key-value pairs.
	 */
	toArray(): [ string, T ][] {
		let res: [ string, T ][] = [];
		if (!this.data) return res;

		// Helper function to traverse the AVL tree in in-order
		function inOrderTraversal(node: CmAvlTreeNode<T>, res: [ string, T ][]) {
			if (!node) return;
			inOrderTraversal(node.left, res);
			res.push([ node.key, node.value ]);
			inOrderTraversal(node.right, res);
		}

		inOrderTraversal(this.data, res);
		return res;
	}

	/**
	 * Returns a standard array representation of the hashtable.
	 * @returns An array of keys.
	 */
	getKeys(): Array<string> {
		let res = new Array<string>();

		if (!this.data) return res;

		// Helper function to traverse the AVL tree in in-order
		function inOrderTraversal(node: CmAvlTreeNode<T>, res: Array<string>) {
			if (!node) return;
			inOrderTraversal(node.left, res);
			res.push(node.key);
			inOrderTraversal(node.right, res);
		}

		inOrderTraversal(this.data, res);
		return res;
	}

	/**
	 * Emit an event if event emitter is present.
	 * @param eventName The name of the event to emit.
	 * @param eventValue The value of the event.
	 */
	emitEvent(eventName: string, eventValue: any) {
		if (this.eventEmitter) {
			this.eventEmitter.emit(eventName, eventValue);
		}
	}

	/**
	 * Subscribe to events if event emitter is present.
	 * @param eventName The name of the event to subscribe to.
	 * @param listener The event listener to subscribe.
	 */
	on(eventName: string, listener: (event: any) => void): void {
		if (this.eventEmitter) {
			this.eventEmitter.on(eventName, listener);
		}
	}

	/**
	 * Serialize the hashtable to a string.
	 * @return A string representation of the hashtable.
	 */
	serialize(): string {
		const jsonStr = JSON.stringify(this.data);
		console.log("jsonStr ::", jsonStr);
		return jsonStr;
	}

	/**
	 * Deserialize a hashtable from a string.
	 * @param str The string to deserialize.
	 */
	deserialize(str: string): IHashtable<T> {
		console.log("DESERIALIZE ::", str);
		this.data = JSON.parse(str);
		return this;
	}

	/**
	 * Save the hashtable to a file.
	 * @param filepath The path of the file to save to.
	 */
	async saveToFile(filepath: string): Promise<CmHashTable<T>> {
		const data = this.serialize();
		await writeFileSync(filepath, data);
		return this;
	}

	/**
	 * Load a hashtable from a file.
	 * @param filepath The path of the file to load from.
	 */
	async loadFromFile(filepath: string): Promise<CmHashTable<T>> {
		const data = await readFileSync(filepath);
		this.deserialize(data.toString());
		return this;
	}

	/**
	 * Removes all key-value pairs from the hashtable
	 */
	clear(): CmHashTable<T> {
		this.data = null;
		return this;
	}
}
