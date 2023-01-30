/*
 * samla-server-refactor
 * @date: 2023-01-29 11:01
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com, patrik.forsberg1@ingka.com>
 * @author: Fabio Camille <fabio.cammilli@ingka.com, fabio.cammilli@gmail.com>
 */

import { BPlusLeafNode } from "./bplus-leaf-node";
import { BPlusNode }     from "./bplus-node";

export type BPNode = BPlusNode | BPlusLeafNode;

/**
 * A B+ tree implementation for a disk-based document store.
 * @class BPlusTree
 */
export class BPlusTree {
	private root: BPNode;
	private leafNodes: BPNode[] = [];
	private t: number;

	constructor(t: number) {
		this.root = new BPlusLeafNode(t);
		this.leafNodes.push(this.root);
		this.t = t;
	}

	public insert(key: number, value: any): void {
		const root = this.root as BPlusLeafNode;

		if (root.keys.length === 2 * this.t - 1) {
			const newRoot = new BPlusNode(this.t);
			newRoot.children.push(root);
			newRoot.splitChild(0);
			this.leafNodes.splice(this.leafNodes.indexOf(root), 1);
			this.leafNodes.push(newRoot.children[0] as BPlusLeafNode);
			this.leafNodes.push(newRoot.children[1] as BPlusLeafNode);
			this.root = newRoot;
			if (newRoot.keys[0] < key) {
				(newRoot.children[1] as BPlusLeafNode).insertNonFull(key, value);
			} else {
				(newRoot.children[0] as BPlusLeafNode).insertNonFull(key, value);
			}
		} else {
			root.insertNonFull(key, value);
		}
	}

	public search(key: number): any | null {
		return this.root.search(key);
	}
}
