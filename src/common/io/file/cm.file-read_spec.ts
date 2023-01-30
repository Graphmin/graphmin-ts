/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-23
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { expect }       from "chai";
import fs               from "fs";
import { readUTF8File } from "./cm.read-file-string";

describe('readUTF8File', function () {
	it('should return the content of file', async function () {
		const fileContent = "Hello World";
		const fileName = "testFile.txt";
		fs.writeFileSync(fileName, fileContent);
		const cmAction = await readUTF8File(fileName);
		expect(cmAction.success).to.be.true;
		expect(cmAction.data).to.equal(fileContent);
	});
});
