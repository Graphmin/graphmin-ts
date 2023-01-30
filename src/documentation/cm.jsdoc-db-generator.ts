#!/usr/bin/env node

/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-17 05:05
 */

import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import sqlite from 'better-sqlite3';
import { argv } from 'yargs';


// Open the SQLite database
const db = new sqlite("args.db");
db.exec(`CREATE TABLE IF NOT EXISTS comments (
  file TEXT NOT NULL,
  comment TEXT NOT NULL
)`);

/**
 * Recursively iterate through all files in a directory and its subdirectories
 * @param dir
 */
async function readDirRecursive(dir: string): Promise<string[]> {
	let files: string[] = [];
	const fileNames = await fs.promises.readdir(dir);
	for (const fileName of fileNames) {
		const filePath = path.join(dir, fileName);
		const stat = await fs.promises.stat(filePath);
		if (stat.isDirectory()) {
			const subFiles = await readDirRecursive(filePath);
			files = files.concat(subFiles);
		} else {
			files.push(filePath);
		}
	}
	return files;
}

/**
 * Extract JSDoc comments from a TypeScript file and save it to the SQLite database
 * @param file
 */
async function extractJSDocComments(file: string) {
	// Read the file's contents
	const fileContents = await fs.promises.readFile(file, 'utf8');

	// Use the TypeScript Compiler API to extract JSDoc comments
	const sourceFile = ts.createSourceFile(file, fileContents, ts.ScriptTarget.Latest, true);
	sourceFile.forEachChild((node) => {
		if (ts.isJSDoc(node)) {
			// Convert the JSDoc comment to HTML
			//const jsdocComment = ts.displayPartsToString(node);
			const jsdocComment = node.getFullText();

			// Format the JSDoc comment
			const formattedComment = formatComment(jsdocComment);

			// Save the formatted comment to the SQLite database
			db.prepare(`INSERT INTO comments (file, comment) VALUES (?, ?)`).run(file, formattedComment);
		}
	});
}

/**
 * format the extracted comments
 * @param comment
 */
function formatComment(comment: string): string {
	// format the comment here
	return comment;
}

// Iterate through all TypeScript files in the src directory
(async () => {
	const files = await readDirRecursive("args.src");
	for (const file of files) {
		if (path.extname(file) === '.ts') {
			await extractJSDocComments(file);
		}
	}
	console.log('Documentation generated successfully.');
})();
