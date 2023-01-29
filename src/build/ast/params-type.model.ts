/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-21 19:54
 *

class AstCustomTypeClass extends AstClass {
	value: any;

	constructor(value: any) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `new CustomType(${this.value})`;
	}
}

class AstStringClass extends AstClass {
	value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `"${this.value}"`;
	}
}

class AstNumberClass extends AstClass {
	value: number;

	constructor(value: number) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `${this.value}`;
	}
}

class AstBigIntClass extends AstClass {
	value: bigint;

	constructor(value: bigint) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `${this.value}n`;
	}
}

class AstBooleanClass extends AstClass {
	value: boolean;

	constructor(value: boolean) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `${this.value}`;
	}
}

class AstSymbolClass extends AstClass {
	value: symbol;

	constructor(value: symbol) {
		super();
		this.value = value;
	}

	generateCode(): string {
		return `Symbol("${this.value}")`;
	}
}
*/
