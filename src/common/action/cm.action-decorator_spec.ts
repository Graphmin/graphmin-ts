/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-21
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { expect }        from "chai";

class CmActionAsync {
}

describe("AsyncAction", () => {
	@AsyncActionClassDecorator<string, Error>()
	class TestAsyncAction extends CmActionAsync {
        pending: any;
        start() {
            throw new Error("Method not implemented.");
        }
        error(error: any) {
            throw new Error("Method not implemented.");
        }
        fail(error: Error) {
            throw new Error("Method not implemented.");
        }
        data: any;
        success(arg0: string) {
            throw new Error("Method not implemented.");
        }
		// class implementation here
	}
	it("should set pending to true when calling start method", () => {
		const action = new TestAsyncAction();
		action.start();
		expect(action.pending).to.be.true;
	});

	it("should set setSuccess to true and data to the passed object when calling setSuccess method", () => {
		const action = new TestAsyncAction();
		action.success("test data");
		expect(action.success).to.be.true;
		expect(action.data).to.equal("test data");
	});

	it("should set setSuccess to false and error to the passed object when calling fail method with an error object", () => {
		const action = new TestAsyncAction();
		const error = new Error("test error");
		action.fail(error);
		expect(action.success).to.be.false;
		expect(action.error).to.equal(error);
	});
});
