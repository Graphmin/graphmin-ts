/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-24 12:53
 */

import { execSync } from 'child_process';

const output = execSync('tsc').toString();
const jsonOutput = parseOutput(output);

console.log(JSON.stringify(jsonOutput, null, 2));

/**
 * Parser TypeScript compiler output
 * @param {string} output
 * @returns {any}
 */
function parseOutput(output: string) {
	const lines = output.split('\n');
	const json: any = {};
	json.files = [];

	let currentFile: any = {};
	currentFile.errors = [];
	currentFile.warnings = [];

	for (const line of lines) {
		if (!line) continue; // skip empty lines
		if (line.startsWith('file')) {
			if (currentFile.file) {
				json.files.push(currentFile);
			}
			currentFile = {};
			currentFile.file = line.split(':')[1].trim();
			currentFile.errors = [];
			currentFile.warnings = [];
			continue;
		}
		const parts = line.split(':');
		if (parts.length < 5) continue; // not a valid error/warning message

		const message = {
			line: parts[1],
			column: parts[2],
			type: parts[3].trim(),
			message: parts.slice(4).join(':').trim(),
		};

		if (message.type === 'error') {
			currentFile.errors.push(message);
		} else if (message.type === 'warning') {
			currentFile.warnings.push(message);
		}
	}
	json.files.push(currentFile);
	return json;
}
