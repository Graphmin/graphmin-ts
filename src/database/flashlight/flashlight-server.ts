/**
 * Coldmind Flasglight - Database Server based on SQLite
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 **
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2020
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import sqlite3 from "sqlite3";

class DataTable {
	private data: Map<string, Map<string, any>>;
	private db: sqlite3.Database;
	private columns: string[];
	private idColumn: string;

	constructor(db: sqlite3.Database, idColumn: string) {
		this.db = db;
		this.data = new Map<string, Map<string, any>>();
		this.columns = [];
		this.idColumn = idColumn;
	}

	async selectTable(tableName: string) {
		return new Promise((resolve, reject) => {
			this.db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					this.columns = rows.map((row) => row.name);
					this.db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
						if (err) {
							reject(err);
						} else {
							for (const row of rows) {
								const rowData = {};
								this.columns.forEach((col) => {
									rowData[col] = row[col];
								});
								this.data.set(row[this.idColumn], new Map<string, any>(Object.entries(rowData)));
							}
							resolve();
						}
					});
				}
			});
		});
	}

	getValue(rowId: string, columnName: string) {
		return this.data.get(rowId)?.get(columnName);
	}
}
