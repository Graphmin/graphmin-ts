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

import { CmAvlTreeNode } from "./cm.avl-tree-node";

const { expect } = require('chai');

describe("AVLTreeNode", () => {
	it("initializes correctly", () => {
		const node = new CmAvlTreeNode("key", "value");
		expect(node.key).to.equal("key");
		expect(node.value).to.equal("value");
		expect(node.left).to.equal(null);
		expect(node.right).to.equal(null);
		expect(node.height).to.equal(1);
	});
});
