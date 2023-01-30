/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-20-21
 *
 * Copyright (c) 2022 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { readFileSync } from "fs";
import { CmAction }     from "../../action/cm.action";
import { ICmAction }    from "../../action/cm.action.type";
import { FileEncoding } from "./file-encodings.enum";

/**
 * Reads a file at the specified filepath, decodes it as UTF-8, and returns an object with a success flag, an error message (if applicable), and the file contents (if successful).
 * @async
 * @function
 * @param {string} filepath - The filepath to read from.
 * @returns {Promise<Result>} - An object with a success flag, an error message (if applicable), and the file contents (if successful).
 */
export const readUTF8File = async(filepath: string): Promise<ICmAction<string, Error>> => {
	let fileDescriptor: number;
	try {
		const data = await readFileSync(filepath, { encoding: FileEncoding.UTF8, flag:'r'});
		return new CmAction().setData(data).setSuccess();
	} catch (err) {
		return new CmAction().fail(err);
	}
}
