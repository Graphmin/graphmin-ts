/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-27
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

export interface IDocument {
	id: string;
	content?: string;
	document?: any;
	references?: Array<string>;
}

export class Document implements IDocument {
	id: string;
	content?: string;
	document?: any;
	references?: Array<string>;

	constructor() {
		//this.id = uuidv4();
	}
}
