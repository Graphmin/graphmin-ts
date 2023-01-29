/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-16 20:31
 */

export const log = console.log;

/**
 * Print and object using JSON stringify
 * @param obj
 * @param {string} label
 */
export const printR = (obj: any, label?: string): void => {
	const data = JSON.stringify(obj, null, 4);
	label ? log(`${label} ::`, data) : log(data);
}
