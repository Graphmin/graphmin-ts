/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-14 01:26
 */
import { plainToClass } from "class-transformer";
import { validate }     from "class-validator";
import { readFileSync } from "fs";
import { DataType }     from "../cm.table";
import { CmTable }      from "../cm.table";

export class CSVImporter {
	private table: CmTable;
	private hasHeader: boolean;

	constructor(tableName: string) {
		this.table = new CmTable(tableName);
	}

	/**
	 * Parse a CSV file and insert the rows into the table
	 * @param filePath The file path of the CSV file
	 */
	async parse(filePath: string) {
		// Read the file
		const fileData = this.readFile(filePath);
		// Split the file into lines
		const lines = this.splitLines(fileData);
		let columnNames: string[];
		//Get the first row
		const firstRow = lines[0].split(',')
		//Check if first row has any number in it
		this.hasHeader = !firstRow.some(s => !isNaN(+s))
		if (this.hasHeader) {
			columnNames = firstRow;
			this.table.setStrColumns(columnNames);
		} else {
			//if no header create default column names
			columnNames = Array.from({length:firstRow.length}, (v,k)=>`column${k+1}`)
			this.table.setStrColumns(columnNames);
		}
		// Iterate over the remaining lines and insert the rows into the table
		for (let i = this.hasHeader ? 1 : 0; i < lines.length; i++) {
			const rowData = lines[i].split(',');
			// Create an object for the row with the column names as keys
			const row = this.createRow(columnNames, rowData);
			this.table.insert(row);
		}
	}

	private readFile(filePath: string): string {
		return readFileSync(filePath, 'utf8');
	}

	private splitLines(fileData: string): string[] {
		return fileData.split(/\r?\n/);
	}

	private createRow(columnNames: string[], rowData: string[]): { [key: string]: any } {
		const row = {};
		columnNames.forEach((col, index) => {
			row[col] = rowData[index];
		});
		return row;
	}
}
