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

import { ICmAction } from "./cm.action.type";

export class CmAction<T = any, E = Error> implements ICmAction<T, E> {
	success: boolean;
	pending: boolean;
	data?: T;
	error?: E;

	constructor() {
		this.reset();
	}

	start(): ICmAction<T, E> {
		this.reset();
		this.pending = true;

		return this;
	}

	/**
	 * Set the success flag to true
	 * @param value
	 */
	setSuccess(value: boolean = true): ICmAction<T, E> {
		this.success = value;
		return this;
	}

	/**
	 * Set error data and set successflag to false
	 * @param value
	 */
	setError(value: any): ICmAction<T, E> {
		this.error = value;
		this.setSuccess(false)
		return this;
	}

	/**
	 * Set the action data
	 * @param value
	 */
	setData(data: T): ICmAction<T, E> {
		this.data = data;
		return this;
	}

	/**
	 * Set the action as failed
	 * @param {E} error
	 */
	fail(error: E): ICmAction<T, E> {
		this.pending = false;
		this.success = false;
		this.error   = error;

		return this;
	}

	/**
	 * Reset the action object to it´s initial state
	 */
	reset(): void {
		this.success = false;
		this.pending = false;
		this.data    = undefined;
		this.error   = undefined;
	}

	isError(): boolean {
		return !this.setSuccess && !this.pending;
	}

	isSuccess(): boolean {
		return this.setSuccess && !this.pending;
	}
}
