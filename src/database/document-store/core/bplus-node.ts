/**
 * Graphmin
 * NOTICE: This file, in any version, modified or original,
 * is a part of the Graphmin project and its licensing model.
 *
 * The software is protected by copyright laws and is subject to the terms
 * and conditions of the Mozilla Public License 2.0 (the "MPL").
 *
 * The MPL is a free and open-source license that permits certain uses of the
 * software, including modification and distribution, by private developers
 * and non-profit organizations.
 *
 * However, any organization or individual that intends to use the software for
 * commercial gain or desires to close the source code of their products where
 * code originating from the Graphmin project, must obtain
 * a commercial Graphmin license from www.coldmind.com/license.
 * It is strictly prohibited to use, modify or distribute this software without
 * obtaining the appropriate license. Any unauthorized use of this software may
 * result in legal action.
 *
 * IMPORTANT: Additionally, it is mandatory that this file header and information
 * remain intact for any license to be valid and enforceable.
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 *
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 */
import { BPlusLeafNode } from "./bplus-leaf-node";

export class BPlusNode {
	public keys: number[] = [];
	public children: (BPlusNode | BPlusLeafNode)[] = [];
	private t: number;

	constructor(t: number) {
		this.t = t;
	}

	public splitChild(i: number): void {
		const y = this.children[i] as BPlusNode;
		const z = new BPlusNode(this.t);
		z.children = y.children.splice(this.t);
		z.keys = y.keys.splice(this.t);
		this.children.splice(i + 1, 0, z);
		this.keys.splice(i, 0, y.keys[this.t - 1]);
	}

	public insertNonFull(key: number, value: any): void {
		let i = this.keys.length - 1;
		if (this.children[0] instanceof BPlusLeafNode) {
			while (i >= 0 && key < this.keys[i]) {
				i--;
			}
			this.children[i + 1].insertNonFull(key, value);
		} else {
			while (i >= 0 && key < this.keys[i]) {
				i--;
			}
			i++;
			if ((this.children[i] as BPlusNode).keys.length === 2 * this.t - 1) {
				this.splitChild(i);
				if (key > this.keys[i]) {
					i++;
				}
			}
			(this.children[i] as BPlusNode).insertNonFull(key, value);
		}
	}

	public search(key: number): any | null {
		let i = 0;
		while (i < this.keys.length && key > this.keys[i]) {
			i++;
		}
		if (i < this.keys.length && key === this.keys[i]) {
			return this.children[i].search(key);
		}
		if (this.children[0] instanceof BPlusLeafNode) {
			return null;
		}
		return (this.children[i] as BPlusNode).search(key);
	}

	public isFull(key: number): boolean {
		const node = this.children[key];

		if (node instanceof BPlusLeafNode) {
			return node.keys.length >= 50; //TODO: use global var
		} else {
			return node.keys.length >= 50; //TODO: use global var
		}
	}
}
