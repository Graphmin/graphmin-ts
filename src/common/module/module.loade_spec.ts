/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-19
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { expect }       from 'chai';
import { ModuleLoader } from "./module.loader";

describe('ModuleLoader', () => {
	let loader: ModuleLoader;

	beforeEach(() => {
		loader = ModuleLoader.getInstance();
	});

	afterEach(() => {
		loader = undefined;
	});

	it('should load a module successfully', () => {
		const result = loader.loadModule('lodash');
		expect(result.success).to.be.true;
		expect(result.module).to.exist;
		expect(result.error).to.not.exist;
	});

	it('should not load a non-dependency module', () => {
		const result = loader.loadModule('non-existent-module');
		expect(result.success).to.be.false;
		expect(result.module).to.not.exist;
		expect(result.error).to.exist;
	});

	it('should return the cached module if it was already loaded', () => {
		loader.loadModule('lodash');
		const result = loader.loadModule('lodash');
		expect(result.success).to.be.true;
		expect(result.module).to.exist;
		expect(result.error).to.not.exist;
	});

	it('should use the fallback module if the module fails to load', () => {
		loader.setFallbackModule({ fallback: true });
		const result = loader.loadModule('non-existent-module');
		expect(result.success).to.be.true;
		expect(result.module).to.exist;
		expect(result.module).to.have.property('fallback', true);
		expect(result.error).to.not.exist;
	});

});
