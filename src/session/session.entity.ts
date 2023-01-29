/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/graphmin
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID 
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-11-23
 */

import { IBaseEntity } from "../database/sql-query-builder";

interface ISessionEntity extends IBaseEntity {
	session: string;
}
