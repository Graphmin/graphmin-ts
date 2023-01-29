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

import { PropIntOptions }        from "./prop.int";
import { CmPropManager }         from "./props.helper";
import { PropsMetakeys }         from "./props.metakeys";
import { IPropValidationResult } from "./props.validator";

export function Props(options: PropIntOptions = {}) {
	return (target: Object, propertyKey: string) => {
		CmPropManager.addPropName(propertyKey, target);
		Reflect.defineMetadata(PropsMetakeys.KeyPropObject, options, target, propertyKey);
	}
}

export interface IPropsObject {
	isValid: boolean;
	validate() : IPropValidationResult
}

