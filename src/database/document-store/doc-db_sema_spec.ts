/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-17 06:34
 */

import { expect }     from "chai";
import { CmDocStore } from "./cm.doc-store";
import { Document }   from "./cm.document_spec";

describe('DocumentStore', () => {
	let store: CmDocStore;
	const testDocument: Document = { id: '1', content: 'TestClass document', references: [] };

	beforeEach(() => {
		store = new CmDocStore();
	});

	afterEach(async () => {
		await store.transaction(async (db) => {
			await new Promise((resolve, reject) => {
				db.run('DELETE FROM documents', (err) => {
					if (err) {
						reject(err);
					} else {
						resolve(true);
					}
				});
			});
		});
	});

	describe('Semaphore', () => {
		it('should prevent concurrent access to the database', async () => {
			const promises: Array<Promise<boolean>> = [];
			for (let i = 0; i < 10; i++) {
				promises.push(store.addDocument({ ...testDocument, id: `${i}` }));
			}
			const results = await Promise.all(promises);
			expect(results.filter((result) => result === true).length).to.equal(1);
		});
	});
});
