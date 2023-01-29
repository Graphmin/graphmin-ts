/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-06-12
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

/*
import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
import * as express from 'express';'
import * as http from 'http';
//import { Shield } from './shield';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Shield', () => {
	let app: express.Application;
	let server: http.Server;

	beforeEach(() => {
		//app = express();
		server = http.createServer(app);
	});

	afterEach(() => {
		server.close();
	});

	it('should add the security headers', (done) => {
		Shield.addHeaders(app);
		chai.request(server)
			.get('/')
			.end((err, res) => {
				expect(res).to.have.header('X-XSS-Protection', '1; mode=block');
				expect(res).to.have.header('X-Frame-Options', 'SAMEORIGIN');
				expect(res).to.have.header('X-Content-Type-Options', 'nosniff');
				expect(res).to.have.header('Content-Security-Policy', "default-src 'self'");
				expect(res).to.have.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
				expect(res).to.have.header('Referrer-Policy', 'same-origin');
				expect(res).to.have.header('Feature-Policy', "geolocation 'none'; midi 'none'; notifications 'none'; push 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'none'; fullscreen 'none'; payment 'none'");
				expect(res).to.have.header('Expect-CT', 'max-age=864

*/
