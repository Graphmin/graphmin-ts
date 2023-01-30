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

export interface ICmAction<T = any, E = Error> {
	success: boolean;
	pending: boolean;
	data?: T;
	error?: E;

	start(): ICmAction<T, E>;
	setSuccess(value?: boolean): ICmAction<T, E>;
	setError(e: any): ICmAction<T, E>;
	setData(data: T): ICmAction<T, E>
	fail(error: E): ICmAction<T, E>;
	reset(): void;
	isError(): boolean;
	isSuccess(): boolean;
}
