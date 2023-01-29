/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 **
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-12-12
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

export enum SqlCommands {
	Select = "SELECT",
	Create = "CREATE",
	Insert = "INSERT",
	Update = "UPDATE",
	Delete = "DELETE"
}

export interface IBaseEntity {
	id: number;
}

export interface IQueryBuilderOptions {
	select?: string[];
	where?: { [ key: string ]: any };
	limit?: number;
	offset?: number;
	orderBy?: { [ key: string ]: 'asc' | 'desc' };
	join?: {
		[ key: string ]: {
			type: 'left' | 'right' | 'inner';
			entity: new () => IBaseEntity;
			on: { [ key: string ]: string };
		}
	};
}

export class SelectQueryBuilder implements IQueryBuilderOptions {
	constructor(entity: IBaseEntity) {
	}
}

class QueryBuilder<T extends IBaseEntity> {
	entity: new () => T;
	options: IQueryBuilderOptions;

	constructor(entity: new () => T, options: IQueryBuilderOptions) {
		this.entity  = entity;
		this.options = options;
	}

	/**
	 * Build select clause
	 * @returns {string}
	 */
	buildSelect() {
		if (!this.options.select || this.options.select.length === 0) {
			return '*';
		}
		return this.options.select.join(', ');
	}

	/**
	 * Build where clause
	 * @returns {any}
	 */
	buildWhere() {
		if (!this.options.where) {
			return '';
		}
		return Object.entries(this.options.where)
					 .map(([ key, value ]) => `${ key } = ${ value }`)
					 .join(' AND ');
	}

	// Build the LIMIT and OFFSET clauses
	buildLimit() {
		if (!this.options.limit) {
			return '';
		}
		let limit = `LIMIT ${ this.options.limit }`;
		if (this.options.offset) {
			limit += ` OFFSET ${ this.options.offset }`;
		}
		return limit;
	}

	// Build the ORDER BY clause
	buildOrderBy() {
		if (!this.options.orderBy) {
			return '';
		}
		return Object.entries(this.options.orderBy)
					 .map(([ key, value ]) => `${ key } ${ value }`)
					 .join(', ');
	}

	buildJoin() {
		if (!this.options.join) {
			return '';
		}
		return Object.entries(this.options.join)
					 .map(([ key, value ]) => {
						 const type   = value.type;
						 const entity = value.entity;
						 const on     = Object.entries(value.on)
											  .map(([ key, value ]) => `${ key } = ${ value }`)
											  .join(' AND ');
						 return `${ type } JOIN ${ entity.name } ON ${ on }`;
					 })
					 .join(' ');
	}

	toSql(): string {
		let result: string[] = [];
		const opt = this.options;
		const sqlCmd = opt[0];

		console.log("CMD == ", sqlCmd);

		switch (sqlCmd) {
			case SqlCommands.Select:
				break;
		}

		return result.join(" ");
	}
}



