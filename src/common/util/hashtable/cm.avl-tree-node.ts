/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-13 15:14
 */

export class CmAvlTreeNode<T> {
	key: string;
	value: T;
	left: CmAvlTreeNode<T>;
	right: CmAvlTreeNode<T>;
	height: number;
	constructor(key: string, value: T) {
		this.key = key;
		this.value = value;
		this.left = null;
		this.right = null;
		this.height = 1;
	}
}

