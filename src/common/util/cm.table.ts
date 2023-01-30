/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-12-24
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { validate }    from "class-validator";
import { CmHashTable } from "./hashtable/cm.hashtable";

export enum DataType {
	STRING,
	NUMBER,
	BOOLEAN,
	DATE
}

export type CmColumns = { name: string; type: DataType }[];

export class CmTable {
	public tableName  = "";
	private hashTable: CmHashTable<Row>;
	private columns: CmColumns;
	private rowClass?: any;

	constructor(tableName: string, columns?: CmColumns) {
		this.columns   = columns;
		this.hashTable = new CmHashTable<Row>();
	}

	setColumns(columns: { name: string; type: DataType }[]) {
		this.columns = columns;
	}

	setStrColumns(columns: string[]) {
		const cols = [];
		columns.forEach(
			col => cols.push({ name: col, type: DataType.STRING })
		);

		this.setColumns(cols);
	}

	/**
	 * Insert a new row into the table
	 * @param row
	 */
	insert(row: { [ key: string ]: any }) {
		if (!row.id) {
			row.id = this.hash(JSON.stringify(row));
		}

		if (this.rowClass) {
			//validate the row
		//	const errors = await validate(row, { groups: [ 'insert' ], skipMissingProperties: true }, this.rowClass);
		const errors = [];
			if (errors.length > 0) {
				// print the validation error
				throw new Error(errors.toString())
			}
		}

		/*
		 // Validate the row
		 for (const column in row) {
		 if (!this.columns.find(col => col.name === column)) {
		 throw new Error(`Invalid column: ${ column }`);
		 }
		 }
		 // Insert the row
		 this.data.set(row.id, row);
		 }
		 */

		// Hash the row using a unique identifier
		// const rowId = this.hashRow(row);
		//his.hashTable.put(rowId, row);
	}

	/**
	 * Get a row from the table
	 * @param id The unique identifier of the row
	 */
	get(id: string) {
		return this.hashTable.get(id);
	}

	/**
	 * Update a row in the table
	 * @param id The unique identifier of the row to be updated
	 * @param data An object containing the column names and new values for the row
	 */
	update(id: string, data: { [ key: string ]: any }) {
		const row = this.hashTable.get(id);
		if (!row) {
			throw new Error(`Error: Row with id '${ id }' not found in the table.`);
		}
		// Iterate over the columns and update the corresponding value in the row
		/*this.columns.forEach((col) => {
			if (data[ col ]) {
				row.update(col, data[ col ]);
			}
		});*/
		this.hashTable.put(id, row);
	}

	/**
	 * Set a value of a specific column for a specific row
	 * @param {string} id - The id of the row
	 * @param {string} column - The name of the column to set
	 * @param {any} value - The value to set
	 * @throws {Error} If the id or column is invalid
	 */
	set(id: string, column: string, value: any) {
		/*
		if (!this.hashTable.has(id)) throw new Error(`Invalid id: ${ id }`);

		if (!this.columns.find(col => col.name === column)) throw new Error(`Invalid column: ${ column }`);
		this.data.get(id)[ column ] = value;
		 */
	}

	/**
	 * Remove a row from the table
	 * @param id The unique identifier of the row to be removed
	 */
	remove(id: string) {
		this.hashTable.remove(id);
	}

	/**
	 * Hash a row using a unique identifier
	 * @param row The row to be hashed
	 */
	private hash(str: string | Row): string {
		const strData = typeof str === "string" ? str : JSON.stringify(str);
		let hash      = 0;
		for (let i = 0; i < strData.length; i++) {
			hash = ( ( hash << 5 ) - hash ) + strData.charCodeAt(i);
			hash |= 0;
		}
		return hash.toString();
	}

	private hashRow(row: Row): string {
		// Generate a unique identifier for the row, e.g. using a hash function
		return this.hash(JSON.stringify(row));
	}

	toSQL(): string {
		let sql = `CREATE TABLE ${this.tableName} (\n`;
		this.columns.forEach((col) => {
			sql += `\t${ col.name } ${ col.type },\n`;
		});
		sql = sql.slice(0, -2);
		sql += '\n);';
		return sql;
	}
}

class Row {
	private data: { [ key: string ]: any };

	constructor() {
		this.data = {};
	}

	add(column: string, value: any) {
		this.data[ column ] = value;
	}

	update(column: string, value: any) {
		this.data[ column ] = value;
	}
}
