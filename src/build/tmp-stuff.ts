/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-24 01:29
 */
import { isNullOrUndefined } from "../common/util/misc.util";

export const isUndefined = (obj: any): obj is undefined =>
	typeof obj === 'undefined';



export const addLeadingSlash = (path?: string): string =>
	path && typeof path === 'string'
	? path.charAt(0) !== '/'
	  ? '/' + path
	  : path
	: '';

export const normalizePath = (path?: string): string =>
	path
	? path.startsWith('/')
	  ? ('/' + path.replace(/\/+$/, '')).replace(/\/+/g, '/')
	  : '/' + path.replace(/\/+$/, '')
	: '/';

export const stripEndSlash = (path: string) =>
	path[path.length - 1] === '/' ? path.slice(0, path.length - 1) : path;

const propertyAnnotationListMetadataKey = Symbol('vxPropertyAnnotationList')

export function vxPropertyAnnotation(): (target: object, propertyKey: string) => void {
	return (target: object, propertyKey: string) => {

		// get the list from the class containing the properties that have already registered
		let list: Array<string> = Reflect.getMetadata(propertyAnnotationListMetadataKey, target)
		if (isNullOrUndefined(list))
			list = []

		// Add the property name to the array
		list.push(propertyKey)

		// Add the updated list to the class
		Reflect.defineMetadata(propertyAnnotationListMetadataKey, list, target)

	}
}

/*

export class MetadataScanner {
	public scanFromPrototype<T extends Injectable, R = any>(
		instance: T,
		prototype: object,
		callback: (name: string) => R,
	): R[] {
		const methodNames = new Set(this.getAllFilteredMethodNames(prototype));
		return iterate(methodNames)
			.map(callback)
			.filter(metadata => !isNil(metadata))
			.toArray();
	}

	*getAllFilteredMethodNames(prototype: object): IterableIterator<string> {
		const isMethod = (prop: string) => {
			const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
			if (descriptor.set || descriptor.get) {
				return false;
			}
			return !isConstructor(prop) && isFunction(prototype[prop]);
		};
		do {
			yield* iterate(Object.getOwnPropertyNames(prototype))
				.filter(isMethod)
				.toArray();
		} while (
			(prototype = Reflect.getPrototypeOf(prototype)) &&
			prototype !== Object.prototype
			);
	}
}


 */
