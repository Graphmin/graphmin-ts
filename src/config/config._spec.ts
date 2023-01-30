/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-12-13
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import * as fs            from "fs";
import path               from "path";
import { GraphminConfig } from "../graphmin.config";

describe('Config', () => {
	let filePath1: string;
	let filePath2: string;
	beforeEach(() => {
		filePath1 = path.join(__dirname, 'config1.json');
		filePath2 = path.join(__dirname, 'config2.json');
		fs.writeFileSync(filePath1, JSON.stringify({ myKey: 'myValue1' }));
		fs.writeFileSync(filePath2, JSON.stringify({ myKey: 'myValue2' }));
	});
	afterEach(() => {
		fs.unlinkSync(filePath1);
		fs.unlinkSync(filePath2);
	});

	it('should read multiple config files correctly', () => {
		const config = new GraphminConfig();
		config.addConfigFile('file1', filePath1);
		config.addConfigFile('file2', filePath2);
		chai.expect(config.get('file1', 'myKey')).to.equal('myValue1');
		chai.expect(config.get('file2', 'myKey')).to.equal('myValue2');
	});
});
