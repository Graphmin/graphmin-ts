/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-19 16:40
 */

//import { DatabaseConstructor } from "better-sqlite3";
//import { Database } from 'better-sqlite3';

import Database from 'better-sqlite3';

const SELECT_TABLE_INFO = `PRAGMA table_info(?)`;
const SELECT_ALL_FROM_TABLE = `SELECT * FROM ? LIMIT ? OFFSET ?`;

export class DataTable {
	private data: Map<string, Map<string, any>>;
	private db: any; //Database;
	private columns: string[];
	private idColumn: string;

	constructor(idColumn: string, isMemoryBased: boolean = true) {
		if (isMemoryBased) {
			this.db = new Database(':memory:');
		} else {
			this.db = new Database('path/to/database.db');
		}
		this.data = new Map<string, Map<string, any>>();
		this.columns = [];
		this.idColumn = idColumn;
	}

	async selectTable(tableName: string, limit: number, offset: number) {
		try {
			const rows = this.db.prepare(SELECT_TABLE_INFO).all(tableName);
			this.columns = rows.map((row) => row.name);
			const data = this.db.prepare(SELECT_ALL_FROM_TABLE).all(tableName, limit, offset);
			for (const row of data) {
				const rowData = {};
				this.columns.forEach((col) => {
					rowData[col] = row[col];
				});
				this.data.set(row[this.idColumn], new Map<string, any>(Object.entries(rowData)));
			}
		} catch (err) {
			throw err;
		}
	}

	getValue(rowId: string, columnName: string) {
		return this.data.get(rowId)?.get(columnName);
	}
}

