/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 **
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-10-09
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { CmHashTable } from "../common/util/hashtable/cm.hashtable";

export class Row<T> extends CmHashTable<T> {
	// Additional functionality specific to rows can be added here
}

export class Column extends CmHashTable<string> {
	// Additional functionality specific to columns can be added here
}

export class CmDbTable<T> {
	private columns: Column;
	private rows: Row<T>;

	constructor() {
		this.columns = new Column();
		this.rows = new Row<T>();
	}

	/**
	 * Adds a new column to the table
	 * @param name The name of the column
	 * @param type The data type of the column
	 */
	addColumn(name: string, type: string) {
		this.columns.put(name, type);
	}

	/**
	 * Removes a column from the table
	 * @param name The name of the column to remove
	 */
	removeColumn(name: string) {
		this.columns.remove(name);
	}

	/**
	 * Adds a new row to the table
	 * @param values An object containing key-value pairs for each column in the table
	 */
	addRow(values: T) {
		this.rows.put(values[ "id" ], values);
	}

	/**
	 * Removes a row from the table
	 * @param id The id of the row to remove
	 */
	removeRow(id: string) {
		this.rows.remove(id);
	}

	/**
	 * Retrieves a row from the table
	 * @param id The id of the row to retrieve
	 */
	getRow(id: string) {
		return this.rows.get(id);
	}

	/**
	 * Sorts the rows in the table based on the values of a specific column
	 * @param column The name of the column to sort by
	 * @param order The sort order (ascending or descending)
	 */
	sort(column: string, order: 'asc' | 'desc' = 'asc') {
		if(!this.columns.get(column)) throw new Error(`The column ${column} does not exist in the table`);
		const sortedRows = this.rows.toArray().sort((a, b) => {
			if(a[1][column] < b[1][column]) return order === 'asc' ? -1 : 1;
			if(a[1][column] > b[1][column]) return order === 'asc' ? 1 : -1;
			return 0;
		});
		this.rows.clear();
		for(const [key, value] of sortedRows) {
			this.rows.put(key, value);
		}
	}

	// Other methods in the Table class
}
