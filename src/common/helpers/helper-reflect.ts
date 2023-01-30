/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-18 18:59
 */

import "reflect-metadata";


export function getMetadataKeysRecursive(obj: any, allMetadataKeys: Set<string>): void {
	const keys = Reflect.getMetadataKeys(obj);
	keys.forEach(key => allMetadataKeys.add(key));
	for (const property of Object.getOwnPropertyNames(obj)) {
		const propertyValue = obj[property];
		if (typeof propertyValue === "object") {
			getMetadataKeysRecursive(propertyValue, allMetadataKeys);
		}
	}
}

export function getAllMetadataKeys(): void {
	const allMetadataKeys = new Set<string>();

	getMetadataKeysRecursive(global, allMetadataKeys);
	console.log(Array.from(allMetadataKeys));
}
