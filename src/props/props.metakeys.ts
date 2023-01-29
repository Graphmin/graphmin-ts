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

export const PropTypePrefix   = "_prop_dt_";
export const PropTypeObject   = "object";
export const PropTypeString   = "string";
export const PropTypeInt      = "integer";
export const PropTypeBool     = "boolean";
export const PropTypeDate     = "date";
export const PropTypeInArray  = "inArray";
export const PropTypeOptional = "_prop_optional_";

export const PropsMetakeys = {
	KeyPropString    : `${ PropTypePrefix }${ PropTypeString }`,
	KeyPropInt       : `${ PropTypePrefix }${ PropTypeInt }`,
	KeyPropBool      : `${ PropTypePrefix }${ PropTypeBool }`,
	KeyPropDate      : `${ PropTypePrefix }${ PropTypeDate }`,
	KeyPropInArray   : `${ PropTypePrefix }${ PropTypeInArray }`,
	KeyPropObject    : `${ PropTypePrefix }${ PropTypeObject }`,
	KeyPropOptional  : `${ PropTypePrefix }${ PropTypeOptional }`,
	KeyPropValidation: "_prop_validation_",
	KeyPropMetadata  : '_prop_metadata_'
}
