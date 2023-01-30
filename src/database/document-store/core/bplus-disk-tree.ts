/*
 * samla-server-refactor
 * @date: 2023-01-29 11:01
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com, patrik.forsberg1@ingka.com>
 * @author: Fabio Camille <fabio.cammilli@ingka.com, fabio.cammilli@gmail.com>
 */

import { BPlusLeafNode } from "./bplus-leaf-node";
import { BPlusNode }     from "./bplus-node";

export class DiskBasedBPlusTree {
	private disk: any;
	private root: BPlusNode | BPlusLeafNode;

	private readNode(page: number): BPlusNode | BPlusLeafNode {
		return this.disk.read(page);
	}
	private writeNode(page: number, node: BPlusNode | BPlusLeafNode) {
		this.disk.write(page, node);
	}

	public insert(key: number, value: any) {
		if (this.root === null) {
			this.root = new BPlusLeafNode(key);
		}
		if (this.root.isFull(key)) {
			const newRoot = new BPlusNode(key);
			newRoot.children.push(this.root);
			newRoot.splitChild(key);
			this.root = newRoot;
		}
		this.root.insertNonFull(key, value);
	}

	public search(key: number): any | null {
		return this.root.search(key);
	}
}

export class BPlusTreeDisk {
	private blockSize: number = 1024;
	private data: Map<number, Buffer> = new Map();

	public read(page: number): Buffer {
		const offset = page * this.blockSize;
		const buffer = Buffer.alloc(this.blockSize);
		let block = this.data.get(page);
		if (!block) {
			block = Buffer.alloc(this.blockSize);
			this.data.set(page, block);
		}
		block.copy(buffer, 0, offset, offset + this.blockSize);
		return buffer;
	}

	public write(page: number, buffer: Buffer) {
		const offset = page * this.blockSize;
		let block = this.data.get(page);
		if (!block) {
			block = Buffer.alloc(this.blockSize);
			this.data.set(page, block);
		}
		buffer.copy(block, offset, 0, buffer.length);
	}
}
