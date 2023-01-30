/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-01-21
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { CmAsyncAction } from "./cm.action-async";
import { expect }        from "chai";

describe("AsyncAction", () => {
	it("should throw an error if the passed object is not of the expected type", () => {
		const action = new CmAsyncAction<string>();
		expect(() => action.fail(
			new Error("not a TypeError")
		)).to.throw(
			TypeError,
			"Expected error to be of type TypeError but got String"
		);
	});
});

describe("CmAsyncAction with custom options", () => {
	@AsyncActionClassDecorator<string, Error>(
		{
			successPropName    : "isCompleted",
			pendingPropName    : "isLoading",
			dataPropName       : "response",
			errorPropName      : "errorMessage",
			startMethodName    : "load",
			successMethodName  : "complete",
			failMethodName     : "fail",
			resetMethodName    : "reset",
			isErrorMethodName  : "hasError",
			isSuccessMethodName: "isSuccess"
		})
	class TestAsyncAction {
		// class implementation here
	}

	it("should have the expected properties and methods with the custom names", () => {
		const action = new TestAsyncAction();
		expect(action).to.have.property("isCompleted").that.is.a("boolean");
		expect(action).to.have.property("isLoading").that.is.a("boolean");
		expect(action).to.have.property("response").that.is.a("string");
		expect(action).to.have.property("errorMessage").that.is.an.instanceof(Error);
		expect(action).to.respondTo("load");
		expect(action).to.respondTo("complete");
		expect(action).to.respondTo("fail");
		expect(action).to.respondTo("reset");
		expect(action).to.respondTo("hasError");
		expect(action).to.respondTo("isSuccess");
	});
});
