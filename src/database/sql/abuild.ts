/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-22
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import * as sqlstring from 'sqlstring';

interface Middleware {
	handle(query: string, ...args: any[]): string;
}

class QueryBuilder {
	private middlewares: Middleware[] = [];
	private tableName: string;

	constructor(table: string) {
		this.tableName = table;
	}

	register(middleware: Middleware) {
		this.middlewares.push(middleware);
	}

	private validateProps<T>(obj: T, props: Array<keyof T>) {
		if (!Array.isArray(props) || props.length === 0) {
			throw new Error("Invalid input: props must be a non-empty array.");
		}
		for (const prop of props) {
			if (!( prop in obj )) {
				throw new Error(`Invalid input: ${ prop } is not a property of ${ obj.constructor.name }`);
			}
			if (typeof obj[ prop ] !== "string" && typeof obj[ prop ] !== "number" && typeof obj[ prop ] !== "boolean") {
				throw new Error(`Invalid input: ${ prop } must be a string, number, or boolean`);
			}
		}
	}

	private buildSelect(obj: object, props: Array<keyof object>) {
		this.validateProps(obj, props);
		const escapedProps = props.map(col => sqlstring.escapeId(col));
		return escapedProps.join(', ');
	}

	select<T>(obj: T, props: Array<keyof T>): string {
		let query = `SELECT ${this.buildSelect(obj, props)} FROM ${this.tableName}`;
		for (const middleware of this.middlewares) {
			query = middleware.handle(query, obj, props);
		}
		return query;
	}

	private buildJoin(table: string, on: Array<keyof any>): string {
		this.validateProps(table, on);
		const escapedOn = on.map(col => sqlstring.escapeId(col));
		return `JOIN ${ table } ON ${ escapedOn[ 0 ] } = ${ escapedOn[ 1 ] }`;
	}

	join<T>(table: string, on: Array<keyof T>): string {
		const join = this.buildJoin(table, on);
		return `${ join } ${ this.tableName }`;
	}

	private buildUpdate(obj: object, props: Array<keyof object>) {
		this.validateProps(obj, props);
		const escapedProps = props.map(col => `${ sqlstring.escapeId(col) } = ${ sqlstring.escape(obj[ col ]) }`);
		return escapedProps.join(', ');
	}

	update<T>(obj: T, props: Array<keyof T>): string {
		let query = `UPDATE ${this.tableName} SET ${this.buildUpdate(obj, props)}`;
		for (const middleware of this.middlewares) {
			query = middleware.handle(query, obj, props);
		}
		return query;
	}

	private buildWhere(obj: object, props: Array<keyof object>) {
		this.validateProps(obj, props);
		const escapedProps = props.map(col => `${ sqlstring.escapeId(col) } = ${ sqlstring.escape(obj[ col ]) }`);
		return escapedProps.join(' AND ');
	}

	where<T>(obj: T, props: Array<keyof T>): string {
		let query = `WHERE ${ this.buildWhere(obj, props) }`;
		for (const middleware of this.middlewares) {
			query = middleware.handle(query, obj, props);
		}
		return query;
	}

	groupBy<T>(obj: T, props: Array<keyof T>): string {
		let query = `GROUP BY ${this.buildSelect(obj, props)}`;
		for (const middleware of this.middlewares) {
			query = middleware.handle(query, obj, props);
		}
		return query;
	}

	intersect<T>(subquery: string, props: Array<keyof T>): string {
		let query = `INTERSECT ${subquery}`;
		for (const middleware of this.middlewares) {
			query = middleware.handle(query, subquery, props);
		}
		return query;
	}

	subquery<T>(subquery: string, props: Array<keyof T>): string {
		let query = `(${subquery})`;
		for (const middleware of this.middlewares) {
			query = middleware.handle(query, subquery, props);
		}
		return query;
	}

	except<T>(subquery: string, props: Array<keyof T>): string {
		let query = `EXCEPT ${subquery}`;
		for (const middleware of this.middlewares) {
			query = middleware.handle(query, subquery, props);
		}
		return query;
	}
}

class JoinMiddleware implements Middleware {
	handle(query: string, obj: object, props: Array<keyof object>): string {
		return query + ' ' + this.buildJoin(obj, props);
	}
}

class FromMiddleware implements Middleware {
	handle(query: string, obj: object, props: Array<keyof object>): string {
		return query + ' FROM ' + obj.constructor.name;
	}
}
