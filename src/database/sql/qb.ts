export enum JOIN_TYPES {
	INNER = "INNER JOIN",
	LEFT = "LEFT JOIN",
	RIGHT = "RIGHT JOIN",
	FULL_OUTER = "FULL OUTER JOIN"
}

// Constants for SQL strings
const SELECT = "SELECT";
const FROM = "FROM";
const JOIN = "JOIN";
const WHERE = "WHERE";
const GROUP_BY = "GROUP BY";
const HAVING = "HAVING";
const ORDER_BY = "ORDER BY";
const LIMIT = "LIMIT";
const UPDATE = "UPDATE";
const SET = "SET";
const AND = "AND";
const DELETE = "DELETE";

interface EntityOptions {
	name: string;
	engine?: string;
	database?: string;
	schema?: string;
	synchronize?: boolean;
	orderBy?: { name: string[], type: 'ASC' | 'DESC' }
}

const ENTITY_NAME_KEY = "entity_name";
const COLUMN_PROPERTIES_KEY = "column_properties";
const ENTITY_OPTIONS_KEY = "entity_options";

export function Entity(options: EntityOptions) {
	return function (target: any) {
		Reflect.defineMetadata(ENTITY_NAME_KEY, options.name, target);
		Reflect.defineMetadata(ENTITY_OPTIONS_KEY, options, target);
	}
}

export function Column(options: { type?: any; primary?: boolean; nullable?: boolean; default?: any; name?: string; }) {
	return function (target: any, propertyKey: string) {
		const properties = Reflect.getMetadata(COLUMN_PROPERTIES_KEY, target) || {};
		properties[propertyKey] = options;
		Reflect.defineMetadata(COLUMN_PROPERTIES_KEY, properties, target);
	}
}

export class MyQueryBuilder2 {
	private selectProperties: string[] = [];
	private fromEntities: any[] = [];
	private joinEntities: any[] = [];
	private whereClause: any = {};
	private nestedWhereClause: any = {};
	private havingClause: any = {};
	private limitClause: number;
	private subQueryClause: any;
	private groupByEntities: any[] = [];
	private orderByEntities: any[] = [];
	private pagination: any = {};
	private unions: any = {};
	private unionsAll: any = {};
	private intersects: any = {};
	private excepts: any = {};
	private setEntities: any = {};
	private statement: string = "";
	private type: string = SELECT;

	select(...entities: any[]): MyQueryBuilder2 {
		if (this.type === SELECT) {
			entities.forEach(entity => {
				const properties = Object.getOwnPropertyNames(entity.prototype);
				properties.forEach(property => {
					this.selectProperties.push(`${property}`);
				});
			});
		}
		return this;
	}

	from(entities: any[]): MyQueryBuilder2 {
		this.fromEntities = entities;
		return this;
	}

	where(condition: any, operator: string = AND): MyQueryBuilder2 {
		this.whereClause = { condition, operator };
		return this;
	}

	andWhere(condition: any): MyQueryBuilder2 {
		return this.where(condition);
	}

	orWhere(condition: any): MyQueryBuilder2 {
		return this.where(condition, "OR");
	}

	nestedWhere(condition: any, operator: string = "AND"): MyQueryBuilder2 {
		this.nestedWhereClause = { condition, operator };
		return this;
	}

	andNestedWhere(condition: any): MyQueryBuilder2 {
		return this.nestedWhere(condition);
	}

	orNestedWhere(condition: any): MyQueryBuilder2 {
		return this.nestedWhere(condition, "OR");
	}

	join(entities: any[], type: string = JOIN_TYPES.LEFT): MyQueryBuilder2 {
		entities.forEach(entity => {
			this.joinEntities.push({ entity, type });
		});
		return this;
	}

	innerJoin(entities: any[]): MyQueryBuilder2 {
		return this.join(entities, JOIN_TYPES.INNER);
	}

	rightJoin(entities: any[]): MyQueryBuilder2 {
		return this.join(entities, JOIN_TYPES.RIGHT);
	}

	groupBy(properties: any[]): MyQueryBuilder2 {
		this.groupByEntities = properties;
		return this;
	}

	having(condition: any): MyQueryBuilder2 {
		this.havingClause = condition;
		return this;
	}

	fullOuterJoin(entities: any[]): MyQueryBuilder2 {
		return this.join(entities, JOIN_TYPES.FULL_OUTER);
	}

	union(query: MyQueryBuilder2): MyQueryBuilder2 {
		this.unions.push(query);
		return this;
	}

	unionAll(query: MyQueryBuilder2): MyQueryBuilder2 {
		this.unionsAll.push(query);
		return this;
	}

	intersect(query: MyQueryBuilder2): MyQueryBuilder2 {
		this.intersects.push(query);
		return this;
	}

	except(query: MyQueryBuilder): MyQueryBuilder2 {
		this.excepts.push(query);
		return this;
	}

	limit(n: number): MyQueryBuilder2 {
		this.limitClause = n;
		return this;
	}

	paginate(offset: number, limit: number): MyQueryBuilder2 {
		this.pagination = { offset, limit };
		return this;
	}

	update(entities: any[]): MyQueryBuilder2 {
		this.statement = UPDATE;
		return this.from(entities);
	}

	set(properties: any): MyQueryBuilder2 {
		this.setEntities = properties;
		return this;
	}

	delete(): MyQueryBuilder2 {
		this.statement = DELETE;
		return this;
	}

	subQuery(query: MyQueryBuilder2): MyQueryBuilder2 {
		this.subQueryClause = query;
		return this;
	}

	build(): string {
		let query = "";

		switch (this.type) {
			case SELECT:
				query = `${SELECT} ${this.selectProperties.join(', ')} ${FROM}`;
				break;
			case UPDATE:
				query = `${UPDATE} ${this.fromEntities[0].name} ${SET} `;
				for (const [key, value] of Object.entries(this.setEntities)) {
					query += `${key} = ${value}, `;
				}
				query = query.slice(0, -2);
				break;
			case DELETE:
				query = `${DELETE} ${FROM} ${this.fromEntities[0].name}`;
				break;
		}
		if (this.type !== DELETE) {
			for (const from of this.fromEntities) {
				query += ` ${from.name}`;
			}
			for (const join of this.joinEntities) {
				query += ` ${join.type} ${join.entity.name}`;
			}
			if (Object.keys(this.whereClause).length > 0) {
				query += ` ${WHERE}`;
				for (const [key, value] of Object.entries(this.whereClause)) {
					query += ` ${key} = ${value}`;
				}
			}
			if (this.groupByEntities.length > 0) {
				query += ` ${GROUP_BY} ${this.groupByEntities.join(', ')}`;
			}
			if (Object.keys(this.havingClause).length > 0) {
				query += ` ${HAVING}`;
				for (const [key, value] of Object.entries(this.havingClause)) {
					query += ` ${key} = ${value}`;
				}
			}
			if (this.orderByEntities.length > 0) {
				query += ` ${ORDER_BY} ${this.orderByEntities.join(', ')}`;
			}
			if (this.pagination) {
				query += ` ${LIMIT} ${this.pagination.offset}, ${this.pagination.limit}`;
			}
		}

		return query;
	}
}

@Entity({ name: 'users' })
export class User {
	@Column({ type: 'int', primary: true })
	id: number;

	@Column({ type: 'varchar', nullable: false, name: 'first_name' })
	firstName: string;

	@Column({ type: 'varchar', nullable: false, name: 'last_name' })
	lastName: string;

	@Column({ type: 'int', default: 18 })
	age: number;
}

@Entity({ name: 'role' })
class Role {
	@Column({ type: 'int', primary: true })
	id: number;

	@Column({ type: 'varchar', nullable: false, name: 'first_name' })
	roleName: string;
}


const queryBuilder = new MyQueryBuilder2();
const query = queryBuilder.select(User)
						  .from([User])
						  .join([Role])
						  .where({ age: User.age, name: User.name })
						  .groupBy([User.age, User.name])
						  .having({ age: 18, name: 'John'})
						  .subQuery(queryBuilder.select(Role)
												.from([Role]))
						  .limit(10)
						  .build();
console.log(query);
