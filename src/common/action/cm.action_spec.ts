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

import { expect }   from "chai";
import { CmAction } from "./cm.action";

describe("AsyncActionClassDecorator", () => {
	it("should add the setSuccess, pending, data, and error properties to the decorated class", () => {
		@AsyncActionClassDecorator<string, Error>()
		class Test {}

		const test = new Test();
		expect(test).to.have.property("success").that.is.a("boolean");
		expect(test).to.have.property("pending").that.is.a("boolean");
		expect(test).to.have.property("data").that.is.a("string");
		expect(test).to.have.property("error").that.is.an.instanceof(Error);
	});

	it("should add the start, setSuccess, fail, reset, isError, and isSuccess methods to the decorated class", () => {
		@AsyncActionClassDecorator<string, Error>()
		class Test {}

		const test = new Test();
		expect(test).to.respondTo("start");
		expect(test).to.respondTo("success");
		expect(test).to.respondTo("fail");
		expect(test).to.respondTo("reset");
		expect(test).to.respondTo("isError");
		expect(test).to.respondTo("isSuccess");
	});
});

describe("GenericAction", () => {
	it("should have a setSuccess property set to true by default", () => {
		const action = new CmAction<string, Error>();
		expect(action.success).to.be.true;
	});

	it("should set setSuccess to false and data to the passed object when calling fail with a non-error object", () => {
		const action = new CmAction<string, Error>();
		action.fail(new Error("test data"));
		expect(action.success).to.be.false;
		expect(action.data).to.equal("test data");
	});

	it("should set setSuccess to false and error to the passed object when calling fail with an error object", () => {
		const action = new CmAction<string, Error>();
		const error = new Error("test error");
		action.fail(error);
		expect(action.success).to.be.false;
		expect(action.error).to.equal(error);
	});
});
