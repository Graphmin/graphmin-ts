class MyQueryBuilder {
	private selectProperties: string[] = [];
	private fromEntities: any[]        = [];
	private joinEntities: any[]        = [];
	private whereClause: any           = {};
	private groupByProperties: any[]   = [];
	private havingClause: any          = {};
	private limitClause: number;
	private subquery: any;
	private orderByProperties: any[]   = [];
	private pagination: any            = {};
	private setProperties: any         = {};
	private statement: string          = "";
	private type: string               = "SELECT";

	// Enum for join types
	private JOIN_TYPES = {
		INNER     : "INNER JOIN",
		LEFT      : "LEFT JOIN",
		RIGHT     : "RIGHT JOIN",
		FULL_OUTER: "FULL OUTER JOIN"
	}

	// Constants for SQL strings
	private SELECT   = "SELECT";
	private FROM     = "FROM";
	private JOIN     = "JOIN";
	private WHERE    = "WHERE";
	private GROUP_BY = "GROUP BY";
	private HAVING   = "HAVING";
	private ORDER_BY = "ORDER BY";
	private LIMIT    = "LIMIT";
	private UPDATE   = "UPDATE";
	private SET      = "SET";
	private DELETE   = "DELETE";

	constructor(type: string = "SELECT") {
		this.type = type;
	}

	select(...entities: any[]): MyQueryBuilder {
		if (this.type === "SELECT") {
			entities.forEach(entity => {
				const properties = Object.getOwnPropertyNames(entity.prototype);
				properties.forEach(property => {
					this.selectProperties.push(`${ property }`);
				});
			});
		}
		return this;
	}

	from(entities: any[]): MyQueryBuilder {
		this.fromEntities = entities;
		return this;
	}

	join(entities: any[], type: string = this.JOIN_TYPES.LEFT): MyQueryBuilder {
		entities.forEach(entity => {
			this.joinEntities.push({ entity, type });
		});
		return this;
	}

	innerJoin(entities: any[]): MyQueryBuilder {
		return this.join(entities, this.JOIN_TYPES.INNER);
	}

	rightJoin(entities: any[]): MyQueryBuilder {
		return this.join(entities, this.JOIN_TYPES.RIGHT);
	}

	fullOuterJoin(entities: any[]): MyQueryBuilder {
		return this.join(entities, this.JOIN_TYPES.FULL_OUTER);
	}

	where(condition: any): MyQueryBuilder {
		this.whereClause = condition;
		return this;
	}

	groupBy(properties: any[]): MyQueryBuilder {
		this.groupByProperties = properties;
		return this;
	}

	having(condition: any): MyQueryBuilder {
		this.havingClause = condition;
		return this;
	}

	orderBy(properties: any[]): MyQueryBuilder {
		this.orderByProperties = properties;
		return this;
	}

	limit(n: number): MyQueryBuilder {
		this.limitClause = n;
		return this;
	}

	paginate(offset: number, limit: number): MyQueryBuilder {
		this.pagination = { offset, limit };
		return this;
	}

	update(entities: any[]): MyQueryBuilder {
		this.statement = this.UPDATE;
		return this.from(entities);
	}

	set(properties: any): MyQueryBuilder {
		this.setProperties = properties;
		return this;
	}

	delete(): MyQueryBuilder {
		this.statement = this.DELETE;
		return this;
	}

	build(): string {
		let query = "";
		switch (this.type) {
			case "SELECT":
				query = `${ this.SELECT } ${ this.selectProperties.join(', ') } ${ this.FROM }`;
				break;
			case "UPDATE":
				query = `${ this.UPDATE } ${ this.fromEntities[ 0 ].name } ${ this.SET } `;
				for (const [ key, value ] of Object.entries(this.setProperties)) {
					query += `${ key } = ${ value }, `;
				}
				query = query.slice(0, -2);
				break;
			case "DELETE":
				query = `${ this.DELETE } ${ this.FROM } ${ this.fromEntities[ 0 ].name }`;
				break;
		}

		if (this.type !== "DELETE") {
			for (const from of this.fromEntities) {
				query += ` ${ from.name }`;
			}
			for (const join of this.joinEntities) {
				query += ` ${ join.type } ${ join.entity.name }`;
			}
			if (Object.keys(this.whereClause).length > 0) {
				query += ` ${ this.WHERE }`;
				for (const [ key, value ] of Object.entries(this.whereClause)) {
					query += ` ${ key } = ${ value }`;
				}
			}
			if (this.groupByProperties.length > 0) {
				query += ` ${ this.GROUP_BY } ${ this.groupByProperties.join(', ') }`;
			}
			if (Object.keys(this.havingClause).length > 0) {
				query += ` ${ this.HAVING }`;
				for (const [ key, value ] of Object.entries(this.havingClause)) {
					query += ` ${ key } = ${ value }`;
				}
			}
			if (this.orderByProperties.length > 0) {
				query += ` ${ this.ORDER_BY } ${ this.orderByProperties.join(', ') }`;
			}
			if (this.pagination) {
				query += ` ${ this.LIMIT } ${ this.pagination.offset }, ${ this.pagination.limit }`;
			}
		}
		return query;
	}
}
