import { expect }      from 'chai';
import { CmHashTable } from "./cm.hashtable";

describe('Hashtable', () => {
	let ht: CmHashTable<string>;

	beforeEach(() => {
		ht = new CmHashTable<string>();
	});

	it('should add key-value pairs', () => {
		ht.put('key1', 'value1');
		ht.put('key2', 'value2');
		expect(ht.get('key1')).to.equal('value1');
		expect(ht.get('key2')).to.equal('value2');
	});

	it('should update values for existing keys', () => {
		ht.put('key1', 'value1');
		ht.put('key1', 'newvalue1');
		expect(ht.get('key1')).to.equal('newvalue1');
	});

	it('should remove key-value pairs', () => {
		ht.put('key1', 'value1');
		ht.put('key2', 'value2');
		ht.remove('key1');
		expect(ht.get('key1')).to.be.undefined;
		expect(ht.get('key2')).to.equal('value2');
	});

	it('should return the correct size', () => {
		ht.put('key1', 'value1');
		ht.put('key2', 'value2');
		expect(ht.size()).to.equal(2);
		ht.remove('key1');
		expect(ht.size()).to.equal(1);
	});

});

/**
 * TestClass Hashtable Events
 */
describe('Hashtable Events', () => {
	let ht: CmHashTable<string>;

	beforeEach(() => {
		ht = new CmHashTable<string>(true);
	});

	it('should emit correct event values when adding key-value pair', (done) => {
		ht.on("add", (event) => {
			expect(event.key).to.equal("key1");
			expect(event.value).to.equal("value1");
			done();
		});
		ht.put("key1", "value1");
	});

	it('should emit correct event values when updating key-value pair', (done) => {
		ht.put("key1", "value1");
		ht.on("change", (event) => {
			expect(event.key).to.equal("key1");
			expect(event.value).to.equal("newvalue1");
			done();
		});
		ht.put("key1", "newvalue1");
	});

	it('should emit correct event values when removing key-value pair', (done) => {
		ht.put("key1", "value1");
		ht.on("remove", (key) => {
			expect(key).to.equal("key1");
			done();
		});
		ht.remove("key1");
	});
});
