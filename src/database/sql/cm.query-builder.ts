import * as sqlstring from "sqlstring";

interface Middleware {
	handle(query: string, ...args: any[]): string;
}

class QueryBuilder {
	private middlewares: Middleware[] = [];
	private tableName:string;
	constructor(table:string) {
		this.tableName = table;
	}

	register(middleware: Middleware) {
		this.middlewares.push(middleware);
	}

	private validateProps<T = object>(obj: T, props: Array<keyof T>) {
		if (!Array.isArray(props) || props.length === 0) {
			throw new Error("Invalid input: props must be a non-empty array.");
		}

		props.forEach(props =>{

		})

		/*for (const prop of props) {
			if (!(prop in obj)) {
				throw new Error(`Invalid input: ${prop} is not a property of ${obj.constructor.name}`);
			}
			if (typeof obj[prop] !== "string" && typeof obj[prop] !== "number" && typeof obj[prop] !== "boolean") {
				throw new Error(`Invalid input: ${prop} must be a string, number, or boolean`);
			}
		}*/
	}

	private buildSelect(obj: object, props: Array<keyof object>) {
		this.validateProps(obj, props);
		const escapedProps = props.map(col => sqlstring.escape(obj[col]));
		return escapedProps.join(', ');
	}

	select<T>(obj: T, props: Array<keyof T>): string {
		let query = `SELECT ${this.buildSelect(obj, props)} FROM ${this.tableName}`;
		for (const middleware of this.middlewares) {
			query = middleware.handle(query, obj, props);
		}
		return query;
	}
	// ...
}

class JoinMiddleware implements Middleware {
	handle(query: string, obj: object, props: Array<keyof object>): string {
		const join = `JOIN ${obj.constructor.name} ON ${props[0]} = ${props[1]}`;
		return `${query} ${join}`;
	}
}

class FromMiddleware implements Middleware {
	handle(query: string, obj: object, props: Array<keyof object>): string {
		const from = `FROM ${obj.constructor.name}`;
		return `${query} ${from}`;
	}
}

const queryBuilder = new QueryBuilder("users");
queryBuilder.register(new JoinMiddleware());
queryBuilder.register(new FromMiddleware());

const query = queryBuilder.select<User>({id: 1, name: "jakke" } );
