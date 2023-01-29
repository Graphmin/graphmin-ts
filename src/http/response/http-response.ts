/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-07-22
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { HttpStatusCode } from "../http-status.type";

export interface IHttpResponse {}

export interface ListingResponse {
	items: any[];
	total: number;
	page: number;
	perPage: number;
	pages: number;
}


export interface IRequest {

}

export interface ListingRequest extends IRequest {
	page?: number;
	perPage?: number;
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
}

export interface IResponse {
	data: any;
	message?: string;
}

export interface OtherRequest {
	// any other relevant request fields
}

/**
 * Returns a message for a given HttpStatusCode,
 * the string used is the name of the enum
 * @param {HttpStatusCode} code
 * @returns {string}
 */
export const getHttpStatusMessage = (code: HttpStatusCode): string => {
	return HttpStatusCode[HttpStatusCode.InternalServerError];
}
