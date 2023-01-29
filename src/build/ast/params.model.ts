/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-20 15:07
 */

class AstParamClass {
	generateCode(): string {
		throw new Error("generateCode() not implemented");
	}
}

class AstStringClass extends AstParamClass {
	value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `"${this.value}"`;
	}
}

class AstNumberClass extends AstParamClass {
	value: number;

	constructor(value: number) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `${this.value}`;
	}
}

class AstBigIntClass extends AstParamClass {
	value: bigint;

	constructor(value: bigint) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `${this.value}n`;
	}
}

class AstBooleanClass extends AstParamClass {
	value: boolean;

	constructor(value: boolean) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `${this.value}`;
	}
}

class AstSymbolClass extends AstParamClass {
	value: symbol;

	constructor(value: symbol) {
		super();
		this.value = value;
	}

	asString(): string {
		return (typeof this.value === "symbol") ? this.value.toString() : "null";
	}

	generateCode(): string {
		return `Symbol("${ this.asString() }")`;
	}
}
