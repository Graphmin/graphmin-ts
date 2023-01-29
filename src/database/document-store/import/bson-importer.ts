/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-17 08:25
 */

import { readFileSync } from "fs";
import { CmDocStore }   from "../cm.doc-store";

class BsonImporter {
	private documentStore: CmDocStore;
	private bson: any;

	constructor(documentStore: CmDocStore) {
		this.documentStore = documentStore;

		try {
			this.bson  = require("bson");
		} catch (e) {
			console.log(`In order to use the BSON importer you need to install the "bson" package.`)
			console.log(`npm install -g bson`);
			console.log(`or`);
			console.log(`yarn global add bson`);
		}

	}

	/**
	 * Imports a BSON document into the CmDocStore
	 * @param bsonData - The BSON data to import
	 */
	public async import(bsonData: Buffer): Promise<void> {
		const document = this.bson.deserialize(bsonData);
		await this.documentStore.addDocument(document);
	}

	/**
	 * Imports a BSON file into the CmDocStore
	 * @param filePath - The path to the BSON file
	 */
	public async importFile(filePath: string): Promise<void> {
		const bsonData = await readFileSync(filePath);
		await this.import(bsonData);
	}
}
