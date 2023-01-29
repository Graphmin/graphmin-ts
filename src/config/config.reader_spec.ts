/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
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

import * as chai        from 'chai';
import * as fs          from 'fs';
import * as path        from 'path';
import { ConfigReader } from "./config.file-reader";

describe('ConfigReader', () => {
	let filePath: string;
	beforeEach(() => {
		filePath = path.join(__dirname, 'config.json');
	});
	afterEach(() => {
		fs.unlinkSync(filePath);
	});

	it('should read the config file with if/else clause correctly', () => {
		fs.writeFileSync(filePath, JSON.stringify(
			{
				myKey: {
					"if"  : "ifValue",
					"else": "elseValue"
				}
			}));

		const config = new ConfigReader(filePath);
		chai.expect(config.get('myKey')).to.equal("ifValue");
	});

	it('should read the config file with if/else clause with false condition correctly', () => {
		fs.writeFileSync(filePath, JSON.stringify(
			{
				myKey: {
					"if"  : false,
					"else": "elseValue"
				}
			}));

		const config = new ConfigReader(filePath);
		chai.expect(config.get('myKey')).to.equal("elseValue");
	});
});
