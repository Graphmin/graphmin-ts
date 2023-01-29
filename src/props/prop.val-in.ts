import { propsBase }     from "./props";
import { CmPropManager } from "./props.helper";

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

export function PropValIn(values: any[]) {
	return (target: Object, propertyKey: string) => {
		CmPropManager.addPropName(propertyKey, target);
		let val = target[propertyKey];
		const getter = () => val;
		const setter = (newVal: any) => {
			if (!values.includes(newVal)) {
				throw new Error(`Invalid value. Accepted values: ${values.join(', ')}`);
			}
			val = newVal;
		};

		Object.defineProperty(target, propertyKey, {
			get: getter,
			set: setter,
			enumerable: true,
			configurable: true
		});
	}
}
