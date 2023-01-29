/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-11-05
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import "reflect-metadata";
import { isNullOrUndefined } from "../common/util/misc.util";
import { PropTypePrefix }    from "./props.metakeys";
import { PropsMetakeys }     from "./props.metakeys";



export const getPropDecorators = (target: any): any[] => {
	const result = [];

	try {
		const metadataKeys   = Reflect.getMetadataKeys(target);
		const validationKeys = metadataKeys.filter(key => key.startsWith(PropTypePrefix));

		validationKeys.forEach((key) => {
			const decorator = Reflect.getMetadata(key, target.prototype);
			console.log("getPropDecorators ::", decorator);
			result.push(decorator);
		});
	} catch (e) {
		console.log("getPropDecorators :: error ::", e);
	}

	return result;
}

/**
 * Get the names of all user defined properties of an object
 * @type {{}}
 */
export const getUserDefinedProperties = (obj: any): string[] => {
	/*
	 Object.getOwnPropertyNames(prototype).filter(property => {
	 return property !== "constructor"
	 });
	 */

	const properties = Object.getOwnPropertyNames(obj).filter(property => {
		const descriptor = Object.getOwnPropertyDescriptor(obj, property);
		return ( descriptor && !descriptor.get && !descriptor.set ) && property != "constructor";
	});

	return properties;
}


/**
 * Validate property metadata by simply retrieving it
 * and logging it
 * @param {object} target
 * @param {string} propertyKey
 * @param label
 */
export const validatePropMetadata = (target: object, propertyKey: string, ...label: string[]): void => {
	try {
		let strLabel = !label.length ? `` : ` ::: ${label.join(" ::: ")}`;
		const propMeta = Reflect.getMetadata(propertyKey, target);
		console.log(`validatePropMetadata${label}`, propMeta);
	} catch (e) {
		console.log(`validatePropMetadata${label}`, e);
	}
}


/**
 * Append target to a property list stored as metadata
 * 1. Get the list from the class containing the properties that have already registered
 * 2. Add the property name to the array
 * 3. Add the updated list to the class
 * @param {object} target
 * @param {string} propertyKey
 */
export function appendCmProp(target: object, propertyKey: string): void {
	let propList: CmPropManager
	//Reflect.defineMetadata(CmPropMetaDataListKey, list, target);
	/*let list: Array<string> = Reflect.getMetadata(CmPropMetaDataListKey, target)

	if (isNullOrUndefined(list)) {
		list = []
	}

	list.push(propertyKey)
	Reflect.defineMetadata(CmPropMetaDataListKey, list, target);
	*/
}

/**
 * Property storage hashtable
 */
export class CmPropManager {
	static loadFromMetadata(target: Object): Array<string> {
		let result: string[] = undefined;

		try {
			const metaData = Reflect.getMetadata(PropsMetakeys.KeyPropMetadata, target);

			if (!isNullOrUndefined(metaData)) {
				const data = JSON.parse(metaData) as [];
				result = Array.from<string>(data);
			}
		} catch (e) {
			console.log("loadFromMetadata ::", e);
		}

		return Array.isArray(result) ? result : new Array<string>();
	}

	/**
	 * Save the hashtable instance to metadata
	 * @param {Object} target
	 * @param data
	 * @returns {CmPropManager}
	 */
	static saveMetadata(target: Object, data?: string[]): boolean {
		let result = true;

		try {
			data = Array.isArray(data) ? data : [];
			Reflect.defineMetadata(PropsMetakeys.KeyPropMetadata, JSON.stringify(data), target)
		} catch (e) {
			console.log("saveMetadata ::", e);
			result = false;
		}

		return result;
	}

	/**
	 * Put a property to the hashtable
	 * @param {string} propName
	 * @param target
	 */
	static addPropName(propName: string, target: Object): CmPropManager {
		let result = true;

		try {
			const propArray = CmPropManager.loadFromMetadata(target);
			propArray.push(propName);
			CmPropManager.saveMetadata(target, propArray);

		} catch (e) {
			console.log("addPropName ::", e);
			result = false;
		}

		return result;
	}
}

export function cmPropDecorator(): (target: object, propertyKey: string) => void {
	return (target: object, propertyKey: string) => {
		appendCmProp(target, propertyKey);
	}
}

/**
 * Get the array containing the decorated props
 * @param {T} target
 * @param {boolean} listAllInstantiated
 * @returns {CmPropManager}
 */
export function getAllProps<T extends Object, K extends keyof T>(target: T, listAllInstantiated = false): Array<string> {
	let result = new Array<string>();

	try {
		const propList = CmPropManager.loadFromMetadata(target);
		console.log("PROP LIST ::", propList);
		//result = propList.getKeys();
	} catch (e) {
		console.log(":: getAllProps ::", e);
	}

	return result;

	/*
	let annotations = Reflect.getMetadata(CmPropMetaDataListKey, target) as CmPropManager;

	if (isNullOrUndefined(annotations)) {
		annotations = []
	}

	if (listAllInstantiated) {
		annotations.push(...Object.keys(target).filter(
			value => !annotations.includes(value)
		));
	}

	return annotations;
	*/
}

