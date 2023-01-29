/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-17 06:31
 */

import { expect }     from 'chai';
import { CmDocStore } from "./cm.doc-store";
import { Document }   from "./cm.doc-store";
import { DBPersist }  from "./persist/cm.doc-store-persist";

describe('DocumentStore', () => {
	let store: CmDocStore;
	const testDocument: Document = { id: '1', content: 'TestClass document', references: [] };
	const updatedTestDocument: Document = { id: '1', content: 'Updated test document', references: [] };

	beforeEach(() => {
		store = new CmDocStore();
		persist = new DBPersist():
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

	describe('addDocument', () => {
		it('should add a new document to the store', async () => {
			const result = await store.addDocument(testDocument);
			expect(result).to.be.true;
			const retrievedDocument = await store.getDocument(testDocument.id);
			expect(retrievedDocument).to.deep.equal(testDocument);
		});
	});

	describe('getDocument', () => {
		it('should retrieve an existing document from the store', async () => {
			await store.addDocument(testDocument);
			const retrievedDocument = await store.getDocument(testDocument.id);
			expect(retrievedDocument).to.deep.equal(testDocument);
		});

		it('should return undefined for a non-existent document', async () => {
			const retrievedDocument = await store.getDocument(testDocument.id);
			expect(retrievedDocument).to.be.undefined;
		});
	});

	describe('updateDocument', () => {
		it('should update an existing document in the store', async () => {
			await store.addDocument(testDocument);
			const result = await store.updateDocument(testDocument.id, updatedTestDocument);
			expect(result).to.be.true;
			const retrievedDocument = await store.getDocument(testDocument.id);
			expect(retrievedDocument).to.deep.equal(updatedTestDocument);
		});

		it('should return false for a non-existent document', async () => {
			const result = await store.updateDocument(testDocument.id, updatedTestDocument);
			expect(result).to.be.false;
		});
	});

	describe('deleteDocument', () => {
		it('should delete an existing document from the store', async () => {
			await store.addDocument(testDocument);
			const result = await store.deleteDocument(testDocument.id);
			expect(result).to.be.true;
			const retrievedDocument = await store.getDocument(testDocument.id);
			expect(retrievedDocument).to.be.undefined;
		});

		it('should return false for a non-existent document', async () => {
			const result = await store.deleteDocument(testDocument.id);
			expect(result).to.be.false;
		});
	});
});
