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

export class CmAsyncAction<T> {
	success: boolean = true;
	pending: boolean = false;
	data: T;
	error: Error;

	start(): void {
		this.reset();
		this.pending = true;
	}

	setSuccess(data: T): void {
		this.pending = false;
		this.success = true;
		this.data = data;
	}

	fail(error: Error | string): void {
		if (typeof error === "string") {
			error = new Error(error);
		}
		this.pending = false;
		this.success = false;
		this.error = error;
	}

	reset(): void {
		this.success = false;
		this.pending = false;
		this.data = undefined;
		this.error = undefined;
	}

	isError(): boolean {
		return !this.success && !this.pending;
	}

	isSuccess(): boolean {
		return this.success && !this.pending;
	}
}
