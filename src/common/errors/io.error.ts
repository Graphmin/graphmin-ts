/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-23 09:13
 */


export class IOError extends Error {
	constructor(err: Error) {
		super();
		Object.assign(this, err)
	}
}
