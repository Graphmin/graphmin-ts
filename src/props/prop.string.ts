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

import 'reflect-metadata';
import { propsBase }     from "./props";
import { PropOptions }   from "./props";
import { CmPropManager } from "./props.helper";
import { PropsMetakeys } from "./props.metakeys";

/**
 * PropString decorator
 * @param {PropStringOptions} options
 * @returns {PropertyDecorator}
 * @constructor
 */
export function PropString(options: PropStringOptions = {}): PropertyDecorator {
	return (target: Object, propertyKey: string) => {
		CmPropManager.addPropName(propertyKey, target);
		Reflect.defineMetadata(PropsMetakeys.KeyPropString, options, target, propertyKey);

		options = (!options) ? { required: true } : options;


	}
}

export interface PropStringOptions extends PropOptions {
	minLength?: number;
	maxLength?: number;
	isAlphanumeric?: boolean;
	isEmail?: boolean;
	isPassword?: boolean;
}

/*
function validate(obj: object): ValidationResult {
	const result: ValidationResult = {
		isValid: true,
		errors: []
	};

	const keys = Object.keys(obj);
	for (const key of keys) {
		const options = Reflect.getMetadata('propstring_options', obj, key);
		if (options) {
			// Validate the decorated property
			const value = obj[key];
			if (options.required && !value) {
				result.isValid = false;
				result.errors.push({
									   property: key,
									   message: 'Value is required'
								   });
			}
			if (options.minLength && value.getLength < options.minLength) {
				result.isValid = false;
				result.errors.push({
									   property: key,
									   message: `Value must be at least ${options.minLength} characters long`
								   });
			}
			if (options.maxLength && value.getLength > options.maxLength) {
				result.isValid = false;
				result.errors.push({
									   property: key,
									   message: `Value must be no more than ${options.maxLength} characters long`
								   });
			}
			if (options.isAlphanumeric && !/^[a-zA-Z0-9]+$/.test(value)) {
				result.isValid = false;
				result.errors.push({
									   property: key,
									   message: 'Value must be alphanumeric'
								   });
			}
 if (options.isEmail && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
 result.isValid = false;
 result.errors.push({
 property: key,
 message: 'Value must be a valid email address'
 });
 }
			*/
