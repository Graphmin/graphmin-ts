/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-12 21:36
 */

import * as chai          from "chai";
import * as sinon         from "sinon";
import { CmEventEmitter } from "./cm.event-emitter";

describe('CmEventEmitter', () => {
	let emitter;

	beforeEach(() => {
		emitter = new CmEventEmitter();
	});

	it('emits an event', () => {
		const callback = sinon.spy();
		emitter.on('customEvent', callback);
		emitter.emit('customEvent');
		chai.expect(callback.calledOnce).to.be.true;
	});

	it('does not emit an event if there are no listeners', () => {
		const callback = sinon.spy();
		emitter.emit('customEvent');
		chai.expect(callback.called).to.be.false;
	});
});
