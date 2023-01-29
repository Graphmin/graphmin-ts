/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-12-24
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { ValidationError }      from "class-validator";
import { validate }             from "class-validator";
import { Request }              from "express";
import { Response }             from "express";
import { NextFunction }         from "express";
import { HttpContentType }      from "../http/cm.http";
import { HttpHeaders }          from "../http/cm.http";
import { HttpStatusCode }       from "../http/http-status.type";
import { getHttpStatusMessage } from "../http/response/http-response";
import { ServerLogger }         from "../common/logging/server-logger";
import { EndpointResponse }     from "./ws.response";
import { IEndpointResponse }    from "./ws.response";

export interface IApiResponse {
}

export class BaseApiAction<T> {
	/**
	 * Create a new instance of the params class
	 * and validates the instance
	 * @param params
	 * @returns {Promise<boolean>}
	 */
	public async validateParams(params?: any): Promise<ValidationError[] | true> {
		console.log("Validate :: params ::", params);

		if (params === null) return true;

		const errors = await validate(params);

		console.log("Validate :: errors ::", errors);

		if (errors.length > 0) {
			errors[ "messages" ] = errors.map(error => Object.values(error.constraints)).join(', ');
			return errors;
		}

		return true;
	}
}

export class ApiAction<T = object> extends BaseApiAction<T> {
	public request: Request;
	public response: Response;
	public next: NextFunction;
	public params: T;
	public endpointResp?: IEndpointResponse;

	constructor(
		request: Request,
		response: Response,
		next: NextFunction,
		logger?: ServerLogger
	) {
		super();
		this.request  = request;
		this.response = response;
		this.next     = next;
	}

	/**
	 * Validate content type and accept
	 * @returns {any}
	 */
	validateRequest(): any {
		if (this.request.headers[ HttpHeaders.ContentType ] !== HttpContentType.JSON) {
			this.response.status(HttpStatusCode.UnsupportedMediaType).send();
			return false;
		}

		const accept = this.request.headers[ "accept" ] ?? "".toLocaleLowerCase;

		if (accept !== HttpContentType.JSON && accept !== "*/*") {
			this.response.status(HttpStatusCode.NotAcceptable).send();
			return false;
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////
	//
	//   Endpoint Response
	//
	////////////////////////////////////////////////////////////////////

	success(code: HttpStatusCode = HttpStatusCode.OK) {
		this.endpointResp = new EndpointResponse(null, code);
	}

	fail(data: any, code: HttpStatusCode = HttpStatusCode.InternalServerError) {
		this.endpointResp = new EndpointResponse(data, code);
	}

	send(data: any, code: HttpStatusCode = HttpStatusCode.OK) {
		this.endpointResp = new EndpointResponse(data, code);
	}

	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////

	// Send a successful response with the data
	sendData(data: any, code: HttpStatusCode = HttpStatusCode.OK) {
		const responseData = {
			status    : getHttpStatusMessage(code),
			statusCode: code,
			data
		}

		this.response.send(JSON.stringify(responseData));
	}

	/**
	 * Create a new instance of the params class
	 * and validates the instance
	 * @param params
	 * @returns {Promise<boolean>}
	 */
	public async validate(params?: any): Promise<boolean> {
		console.log("Validate :: params ::", params);

		if (!this.validateRequest()) return false;

		if (params === null) return true;

		const errors = await this.validateParams(params);

		console.log("Validate :: errors ::", errors);

		if (Array.isArray(errors) && errors.length) {
			this.response.status(HttpStatusCode.MethodNotAllowed).send(
				{
					message: 'Validation failed',
					details: errors
				}
			);

			return false;
		}

		return true;
	}

	/**
	 * Send a bad request response
	 * @param error
	 */
	public sendBadRequest() {
		this.response.status(400).json(
			{
				error: 'Bad Request'
			});
	}

	/**
	 * Send internal server error
	 * @param err
	 * @param code
	 */
	public sendError(err: any, code: number = HttpStatusCode.InternalServerError) {
		this.response.status(code).json(
			{
				error: "Server Error"
			});
	}
}
