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

import { writeFileSync } from "fs";
import { CmAction }      from "../../action/cm.action";
import { ICmAction }     from "../../action/cm.action.type";
import { FileEncoding }  from "./file-encodings.enum";

/**
 * Writes the specified data to a file at the specified filepath, encoded as UTF-8 and returns an object with a success flag, an error message (if applicable)
 * @async
 * @function
 * @param {string} filepath - The filepath to write to.
 * @param {string} data - The data to write to the file.
 * @returns {Promise<Result>} - An object with a success flag, an error message (if applicable)
 */
export const writeUTF8File = async(filepath: string, data: string): Promise<ICmAction<void, Error>> => {
	let fileDescriptor: number;
	try {
		await writeFileSync(filepath, data, { encoding: FileEncoding.UTF8, flag: "w" });
		return new CmAction().setSuccess();
	} catch (err) {
		return new CmAction().fail(err);
	}
}
