/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-06-10
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import sqlite3      from "sqlite3";
import { Document } from "../cm.document_spec";

export enum Sql {
 	CREATE_TABLE = 'CREATE TABLE documents (id TEXT PRIMARY KEY, document TEXT, references TEXT);' +
				   'CREATE INDEX idx_document ON documents (document);' +
				   'CREATE INDEX idx_references ON documents (references);',
	INSERT       = 'INSERT INTO documents (id, document, references) VALUES (?, ?, ?)',
	SELECT_BY_ID = 'SELECT * FROM documents WHERE id = ?',
	UPDATE_BY_ID = 'UPDATE documents SET document = ?, references = ? WHERE id = ?',
	DELETE_BY_ID = 'DELETE FROM documents WHERE id = ?'
}

export interface IPersistResult {
	success: boolean;
	result?: Document;
	error?: Error | any;
}

export class PersistResult implements IPersistResult {
	constructor (
		public success: boolean = true,
		public result?: Document,
		public error?: Error | any
	) {}
}

export interface IDBPersist {
	select(id: string): Promise<IPersistResult>;
	add(document: Document): Promise<IPersistResult>
	update(id: string, document: Document): Promise<IPersistResult>;
	delete(document: Document): Promise<IPersistResult>;
	transaction(cb: (db: sqlite3.Database) => Promise<void>): Promise<boolean>;
}

export class DBPersist implements IDBPersist {
	private db: sqlite3.Database;

	constructor() {
		this.db = new sqlite3.Database(':memory:');
		this.db.run(Sql.CREATE_TABLE);
	}

	/**
	 * Add a new document to the dodument store
	 * @param {Document} doc
	 * @returns {Promise<IPersistResult>}
	 */
	public async add(doc: Document): Promise<IPersistResult> {
		let result  = new PersistResult();

		try {
			await this.db.run(Sql.INSERT);
		} catch (e) {
			result.success = false;
			result.error = e;
		}

		return {
			success: result.success
		};
	}

	/**
	 * Retrieves a document from the database by its ID
	 * @param id - The ID of the document to retrieve
	 * @returns The retrieved document
	 */
	public async select(id: string): Promise<IPersistResult> {
		const result: any = await this.db.get(Sql.SELECT_BY_ID, [id]);
		if (result) {
			const doc = {
				content   : "",
				id        : result.id,
				document  : JSON.parse(result.document),
				references: result.references
			}

			return {
				success: true,
				result: doc
			}
		}
	}

	/**
	 * Updates an existing document in the database
	 * @param id - The ID of the document to update
	 * @param document - The updated document
	 */
	public async update(id: string, document: Document): Promise<IPersistResult> {
		try {
			this.db.run(
				Sql.UPDATE_BY_ID,
				[
					document.id,
					JSON.stringify(document),
					JSON.stringify(document.references)
				]
			);

			return {
				success: true
			}

		} catch (e) {
			return {
				success: false,
				error: e
			}
		}
	}

	/**
	 * Executes a DELETE	statement with the specified parameters
	 * @param doc
	 */
	public async delete(doc: Document): Promise<IPersistResult> {
		try {
			this.db.run(Sql.DELETE_BY_ID,[ doc.id ]);

			return new PersistResult();

		} catch (e) {
			return new PersistResult(false, null, e);
		}

		/*
		return new Promise((resolve, reject) => {
			this.db.run(sql, params, (err) => {
				if (err) {
					reject(
						err);
				}
				else {
					resolve();
				}
			});
		});
		*/
	}

	/**
	 * Executes a callback function within a transaction to ensure consistency
	 * and atomicity of the database operations
	 * @param cb - The callback function to execute
	 * @returns A boolean indicating whether the operation was successful or not
	 */
	public async transaction(cb: (db: sqlite3.Database) => Promise<void>): Promise<boolean> {
		//await this.sem.acquire();
		try {
			let success = true;
			await new Promise((resolve, reject) => {
				this.db.exec('BEGIN', (err) => {
					if (err) {
						success = false;
						reject(err);
					}
					else {
						resolve(true);
					}
				});
			});
			try {
				await cb(this.db);
				await new Promise((resolve, reject) => {
					this.db.exec('COMMIT', (err) => {
						if (err) {
							success = false;
							reject(err);
						}
						else {
							resolve(true);
						}
					});
				});
			}
			catch (err) {
				await new Promise((resolve, reject) => {
					this.db.exec('ROLLBACK', (rollbackErr) => {
						if (rollbackErr) {
							reject(rollbackErr);
						}
						else {
							resolve(true);
						}
					});
				});
				throw err;
			}
			return success;
		}
		finally {
			//this.sem.release();
		}
	}
}
