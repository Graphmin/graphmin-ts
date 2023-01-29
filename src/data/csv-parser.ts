/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-19 16:22
 */

import fs                from "fs";
import { join, resolve } from "path";
import { printR }        from "../cli/cli.util";

export class TableMap extends Map<string, Map<string, any>> {

}

export class CSVImporter {
	private data: TableMap;
	private columns: string[];
	private idColumn: string;

	constructor(idColumn: string = "id") {
		this.data = new Map<string, Map<string, any>>();
		this.columns = [];
		this.idColumn = idColumn;
	}

	async importCSV(filePath: string) {
		try {
			const data = await fs.promises.readFile(filePath, 'utf8');
			const rows = data.split('\n');
			if (rows.length > 0) {
				const headers = rows[0].split(',');
				const hasHeaders = headers.every(h => h !== "");
				if (hasHeaders) {
					this.columns = headers;
				}
				for (let i = hasHeaders ? 1 : 0; i < rows.length; i++) {
					const row = rows[i].split(',');
					const rowData = {};
					for (let j = 0; j < row.length; j++) {
						if (hasHeaders) {
							rowData[this.columns[j]] = row[j];
						} else {
							rowData[j] = row[j];
						}
					}
					this.data.set(
						rowData[this.idColumn],
						new Map<string, any>(Object.entries(rowData))
					);
				}
			} else {
				throw new Error('File is empty.');
			}
		} catch (err) {
			throw err;
		}
	}

	getValue(rowId: string, columnName: string) {
		return this.data.get(rowId)?.get(columnName);
	}
}

let filename = resolve(__dirname, "../../../../planta.csv");
console.log("DIR ::", filename);

let csv = new CSVImporter();
let result = csv.importCSV(filename);

printR(result, "RESULT ::");


