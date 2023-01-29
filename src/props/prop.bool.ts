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

import { PropOptions }          from "./props";
import { validatePropMetadata } from "./props.helper";
import { CmPropManager }        from "./props.helper";
import { PropsMetakeys }        from "./props.metakeys";

export function PropBool(options: PropBoolOptions = {}) {
	return (target: Object, propertyKey: string) => {
		CmPropManager.addPropName(propertyKey, target);
		Reflect.defineMetadata(PropsMetakeys.KeyPropBool, options, target, propertyKey);

		validatePropMetadata(target, propertyKey, "PropBool", PropsMetakeys.KeyPropBool);
	}
}

export interface PropBoolOptions extends PropOptions {
	required?: boolean;
}
