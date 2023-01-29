/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-06-17
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { Request }      from "express";
import { MetaDataKeys } from "../constants";

export function mapFromRequest(req: Request, params: any): object {
	let values = {};
	Object.assign(values, req.params);
	Object.assign(values, req.query);
	Object.assign(values, req.body);

	console.log("xxx VALUES ::", values);

	const result = new params();

	for (const key of Object.keys(values)) {
		const value = values[ key ];

		let dataType   = Reflect.getMetadata(MetaDataKeys.dataType, params, key);
		let designType = Reflect.getMetadata("validation", params.prototype, key);

		console.log("MetaTypes ::",
					Reflect.getMetadata(MetaDataKeys.dataType, params.prototype, key)
		);

		//console.log(">>>>>>> mapToClass :: Data Type ::", dataType);
		//console.log("mapToClass :: Design Type ::", designType);

		if (!dataType) continue;

		try {
			switch (dataType.toLowerCase()) {
				case "number":
					result[ key ] = parseInt(value, 10);
					break;
				case "boolean":
					result[ key ] = value === 'true';
					break;
				case "date":
					result[ key ] = new Date(value);
					break;

				default:
					result[ key ] = value;
			}
		}
		catch (e) {
			console.log("Failed to map value");
		}
	}

	return result;
}
