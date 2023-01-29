/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-17 21:10
 */

import { v4 as uuidv4 } from 'uuid';
import { Document }     from "../cm.document_spec";

export class BTreeNode {
	public keys: any[];
	values: Array<Document>;
	public children: number[];
	public isLeaf: boolean;
	public id: string;

	/**
	 * @param {number} t - Minimum degree of the B-Tree
	 * @param {boolean} isLeaf - Whether this node is a leaf node or not
	 * @param {number} id - The id of the node
	 */
	constructor(t: number, leaf: boolean, id: string) {
		this.keys = new Array(2 * t - 1);
		this.children = new Array(2 * t);
		this.isLeaf = leaf;
		this.id = id;
	}
}

class BTree {
	private maxKeys: number;
	private nodes: Map<string, BTreeNode>;
	private splitter: BTreeNodeSplitter;
	constructor(maxKeys: number) {
		this.maxKeys = maxKeys;
		this.nodes = new Map<string, BTreeNode>();
		this.splitter = new BTreeNodeSplitter(maxKeys);
	}

	/**
	 * Insert a document into the B-Tree
	 * @param {Document} document - The document to insert
	 */
	public async insert(document: Document): Promise<void> {
		let node = this.findNode(document.id);
		if (!node) {
			node = new BTreeNode(uuidv4(), true, document.id);
			this.nodes.set(node.id, node);
		}
		this.insertKeyValue(node, document.id, document);
		if (node.keys.length > this.maxKeys) {
			await this.splitter.split(node, this.nodes);
		}
	}

	/**
	 * Update a document in the B-Tree
	 * @param {Document} document - The updated document
	 */
	public async update(document: Document): Promise<void> {
		let node = this.findNode(document.id);
		if (!node) {
			throw new Error("Document not found");
		}
		let i = 0;
		while (i < node.keys.length && document.id !== node.keys[i]) {
			i++;
		}
		node.values[i] = document;
	}

	/**
	 * Find the node that the document should be inserted into
	 * @param {string} id - The id of the document
	 */
	private findNode(id: string): BTreeNode {
		let node = this.nodes.get(this.root);
		while (node && !node.isLeaf) {
			let i = 0;
			while (i < node.keys.length && id > node.keys[i]) {
				i++;
			}
			node = this.nodes.get(node.children[i]);
		}
		return node;
	}

	/**
	 * Insert a document into a node
	 * @param {BTreeNode} node - The node to insert into
	 * @param {string} id - The id of the document
	 * @param {Document} document - The document to insert
	 */
	private insertKeyValue(node: BTreeNode, id: string, document: Document) {
		let i = 0;
		while (i < node.keys.length && id > node.keys[i]) {
			i++;
		}
		node.keys.splice(i, 0, id);
		node.values.splice(i, 0, document);
	}
}



export class BTree2 {
	private maxKeys: number;
	private nodes: Map<string, BTreeNode>;
	private splitter: BTreeNodeSplitter;
	constructor(maxKeys: number) {
		this.maxKeys = maxKeys;
		this.nodes = new Map<string, BTreeNode>();
		this.splitter = new BTreeNodeSplitter(maxKeys);
	}

	/**
	 * Insert a document into the B-Tree
	 * @param {Document} document - The document to insert
	 */
	public async insert(document: Document): Promise<void> {
		let node = this.findNode(document.id);
		if (!node) {
			node = new BTreeNode(uuidv4(), true);
			this.nodes.set(node.id, node);
		}
		this.insertKeyValue(node, document.id, document);
		if (node.keys.length > this.maxKeys) {
			await this.splitter.split(node, this.nodes);
		}
	}

	/**
	 * Update a document in the B-Tree
	 * @param {Document} document - The updated document
	 */
	public async update(document: Document): Promise<void> {
		let node = this.findNode(document.id);
		if (!node) {
			throw new Error("Document not found");
		}
		let i = 0;
		while (i < node.keys.length && document.id !== node.keys[i]) {
			i++;
		}
		node.values[i] = document;
	}

	/**
	 * Find the node that the document should be inserted into
	 * @param {string} id - The id of the document
	 */
	private findNode(id: string): BTreeNode {
		let node = this.nodes.get(this.root);
		while (node && !node.isLeaf) {
			let i = 0;
			while (i < node.keys.length && id > node.keys[i]) {
				i++;
			}
			node = this.nodes.get(node.children[i]);
		}
		return node;
	}

	/**
	 * Insert a document into a node
	 * @param {BTreeNode} node - The node to insert into
	 * @param {string} id - The id of the document
	 * @param {Document} document - The document to insert
	 */
	private insertKeyValue(node: BTreeNode, id: string, document: Document) {
		let i = 0;
		while (i < node.keys.length && id > node.keys[i]) {
			i++;
		}
		node.keys.splice(i, 0, id);
		node.values.splice(i, 0, document);
	}
}

class BTreeNodeSplitter {
	private maxKeys: number;

	constructor(maxKeys: number) {
		this.maxKeys = maxKeys;
	}

	/**
	 * Split a full node
	 * @param {BTreeNode} node - The full node to split
	 * @param {Map<string, BTreeNode>} nodes - The map of all nodes in the B-Tree
	 */
	public async split(node: BTreeNode, nodes: Map<string, BTreeNode>): Promise<void> {
		const medianIndex = Math.floor(node.keys.length / 2);
		const medianKey   = node.keys[ medianIndex ];
		const medianValue = node.values[ medianIndex ];
		const leftNode    = new BTreeNode(uuidv4(), node.isLeaf, node.id);
		const rightNode   = new BTreeNode(uuidv4(), node.isLeaf, node.id);

		leftNode.keys   = node.keys.slice(0, medianIndex);
		leftNode.values = node.values.slice(0, medianIndex);
		if (!node.isLeaf) {
			leftNode.children = node.children.slice(0, medianIndex + 1);
		}
		rightNode.keys   = node.keys.slice(medianIndex + 1);
		rightNode.values = node.values.slice(medianIndex + 1);
		if (!node.isLeaf) {
			rightNode.children = node.children.slice(medianIndex + 1);
		}
		nodes.set(leftNode.id, leftNode);
		nodes.set(rightNode.id, rightNode);
		if (node.parent) {
			const parentNode = nodes.get(node.parent);
			const i          = parentNode.children.indexOf(node.id);
			this.updateParentNode(parentNode, i, medianKey, medianValue, leftNode, rightNode);
			if (parentNode.keys.length > this.maxKeys) {
				await this.split(parentNode, nodes);
			}
		}
		else {
			const newRoot = this.createNewRoot(medianKey, medianValue, leftNode, rightNode);
			nodes.set(newRoot.id, newRoot);
		}
	}

	/**
	 * Update the parent node after a split
	 * @param {BTreeNode} parentNode - The parent node to update
	 * @param {number} i - The index of the node in its parent's children array
	 * @param {string} medianKey - The median key of the full node that was split
	 * @param {Document} medianValue - The median value of the full node that was split
	 * @param {BTreeNode} leftNode - The left node after a split
	 * @param {BTreeNode} rightNode - The right node after a split
	 */
	private updateParentNode(parentNode: BTreeNode,
							 i: number,
							 medianKey: string,
							 medianValue: Document,
							 leftNode: BTreeNode,
							 rightNode: BTreeNode
	) {
		parentNode.keys.splice(i, 0, medianKey);
		parentNode.values.splice(i, 0, medianValue);
		parentNode.children.splice(i, 1, leftNode.id, rightNode.id);
		leftNode.parent  = parentNode.id;
		rightNode.parent = parentNode.id;
	}

	/**
	 * Create a new root node
	 * @param {string} medianKey - The median key of the full node that was split
	 * @param {Document} medianValue - The median value of the full node that was split
	 * @param {BTreeNode} leftNode - The left node after a split
	 * @param {BTreeNode} rightNode - The right node after a split
	 */
	private createNewRoot(medianKey: string, medianValue: Document, leftNode: BTreeNode, rightNode: BTreeNode): BTreeNode {
		const newRoot = new BTreeNode(uuidv4(), false);
		newRoot.keys.push(medianKey);
		newRoot.values.push(medianValue);
		newRoot.children.push(leftNode.id, rightNode.id);
		leftNode.parent = newRoot.id;
		rightNode.parent = newRoot.id;
		return newRoot;
	}
}
