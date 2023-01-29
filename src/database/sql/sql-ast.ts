/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-21 11:15
 */

class AST {
	setColumns: Property[];
	table: Entities;
	setValues: any[];
	whereColumns: Property[];
	whereValues: any[];
	whereOperators: string[];
	joinColumns: Property[];
	joinTables: Entities[];
	joinType: JoinType;
	dialect: Dialect;
	orderByColumns: Property[];
	orderByType: OrderByType;
	limit: number;
	offset: number;
	subqueries: MyQueryBuilder[];
	queryType: QueryType;

	constructor(
		setColumns: Property[],
		table: Entities,
		setValues: any[],
		whereColumns: Property[], whereValues: any[], whereOperators: string[], joinColumns: Property[], joinTables: Entities[], joinType: JoinType, dialect: Dialect, orderByColumns: Property[], orderByType: OrderByType, limit: number, offset: number, subqueries: MyQueryBuilder[], queryType: QueryType) {
		this.setColumns = setColumns;
		this.table = table;
		this.setValues = setValues;
		this.whereColumns = whereColumns;
		this.whereValues = whereValues;
		this.whereOperators = whereOperators;
		this.joinColumns = joinColumns;
		this.joinTables = joinTables;
		this.joinType = joinType;
		this.dialect = dialect;
		this.orderByColumns = orderByColumns;
		this.orderByType = orderByType;
		this.limit = limit;
		this.offset = offset;
		this.subqueries = subqueries;
		this.queryType = queryType;
	}
}
