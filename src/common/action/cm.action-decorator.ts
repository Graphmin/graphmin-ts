/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-21 14:10
 */

interface DecoratorOptions {
	successPropName?: string;
	pendingPropName?: string;
	dataPropName?: string;
	errorPropName?: string;
	startMethodName?: string;
	successMethodName?: string;
	failMethodName?: string;
	resetMethodName?: string;
	isErrorMethodName?: string;
	isSuccessMethodName?: string;
}

function AsyncActionClassDecorator<T, E>(options?: DecoratorOptions) {
	const opts: DecoratorOptions = Object.assign(
		{
			successPropName    : "success",
			pendingPropName    : "pending",
			dataPropName       : "data",
			errorPropName      : "error",
			startMethodName    : "start",
			successMethodName  : "success",
			failMethodName     : "fail",
			resetMethodName    : "reset",
			isErrorMethodName  : "isError",
			isSuccessMethodName: "isSuccess"
		}, options);

	return function(target: any) {
		Object.assign(target.prototype, {
			[ opts.successPropName ]    : false,
			[ opts.pendingPropName ]    : false,
			[ opts.dataPropName ]       : undefined,
			[ opts.errorPropName ]      : undefined,
			[ opts.startMethodName ]    : function(): void {
				this[ opts.resetMethodName ]();
				this[ opts.pendingPropName ] = true;
			},
			[ opts.successMethodName ]  : function(data: T): void {
				this[ opts.pendingPropName ] = false;
				this[ opts.successPropName ] = true;
				this[ opts.dataPropName ]    = data;
			},
			[ opts.failMethodName ]     : function(error: E): void {
				this[ opts.pendingPropName ] = false;
				this[ opts.successPropName ] = false;
				this[ opts.errorPropName ]   = error;
			},
			[ opts.resetMethodName ]    : function(): void {
				this[ opts.successPropName ] = false;
				this[ opts.pendingPropName ] = false;
				this[ opts.dataPropName ]    = undefined;
				this[ opts.errorPropName ]   = undefined;
			},
			[ opts.isErrorMethodName ]  : function(): boolean {
				return !this[ opts.successPropName ] && !this[ opts.pendingPropName ];
			},
			[ opts.isSuccessMethodName ]: function(): boolean {
				return this[ opts.successPropName ] && !this[ opts.pendingPropName ];
			}
		});
	};
}
