/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-06-08
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import semaphore      from 'semaphore';
import { Document }   from './cm.document_spec';
import { DBPersist }  from "./persist/cm.doc-store-persist";
import { IDBPersist } from "./persist/cm.doc-store-persist";

export enum EventType {
	ADD    = 'add',
	UPDATE = 'update',
	DELETE = 'delete'
}

export class CmDocStore {
	private dbPersist: IDBPersist;
	private sem: semaphore.Semaphore;
	private cache: Map<string, Document>; // in-memory cache for frequently accessed documents
	private listeners = new Map<string, Array<(document: Document) => void>>();

	constructor() {
		this.dbPersist = new DBPersist();
	}

	/**
	 * Add a listener for a specific event
	 * @param event - The event to listen for
	 * @param cb - The callback function to execute when the event is triggered
	 */
	public on(event: 'add' | 'update' | 'delete', cb: (document: Document) => void) {
		let eventListeners = this.listeners.get(event);
		if (!eventListeners) {
			eventListeners = [];
			this.listeners.set(event, eventListeners);
		}

		eventListeners.push(cb);
	}

	/**
	 * Trigger an event and execute all listeners
	 * @param event - The event to trigger
	 * @param document - The document associated with the event
	 */
	private triggerEvent(event: 'add' | 'update' | 'delete', document: Document) {
		const eventListeners = this.listeners.get(event);
		if (eventListeners) {
			for (const listener of eventListeners) {
				listener(document);
			}
		}
	}

	/**
	 * Initializes the database by creating the "documents" table and creating indexes on the columns
	 */
	private async init() {

	}

	/**
	 * Adds a new document to the store
	 * @param document - The document to add
	 * @returns A boolean indicating whether the operation was successful or not
	 */
	public async addDocument(document: Document): Promise<boolean> {
		await this.sem.acquire();
		try {
			let success = true;
			this.dbPersist.add(document);
			this.cache.set(document.id, document);
			this.triggerEvent(EventType.ADD, document);
			return success;
		}
		finally {
			this.sem.release();
		}
	}

	/**
	 * Retrieves a document from the store
	 * @param id - The ID of the document to retrieve
	 * @returns The retrieved document or undefined if it does not exist
	 */
	public async getDocument(id: string): Promise<Document | undefined> {
		let result: Document;

		if (this.cache.has(id)) {
			return this.cache.get(id);
		}

		await this.sem.acquire();

		try {
			let row: any = await this.dbPersist.select(id);

			result = {
				...JSON.parse(row.document),
				references: JSON.parse(row.references)
			}

			if (result) {
				this.cache.set(id, result);
			}
			return result;
		}
		finally {
			this.sem.release();
		}
		/*
		 try {
		 result = await this.dbPersist.select(id);
		 this.db.get(id);
		 'SELECT document, references FROM documents WHERE id = ?',
		 [ id ],
		 (err, row) => {
		 if (err) {
		 reject(err);
		 }
		 else {
		 resolve(row ? {
		 ...JSON.parse(row.document),
		 references: JSON.parse(row.references)
		 } : undefined);
		 }
		 }
		 );
		 });
		 if (result) {
		 this.cache.set(id, result);
		 }
		 return result;
		 }
		 finally {
		 this.sem.release();
		 }
		 */
	}

	/**
	 * Updates an existing document in the store
	 * @param id - The ID of the document to update
	 * @param updatedDocument - The updated document
	 * @returns A boolean indicating whether the operation was successful or not
	 */
	public async updateDocument(id: string, updatedDocument: Document): Promise<boolean> {
		await this.sem.acquire();
		try {
			let success = true;
			await this.dbPersist.update(id, updatedDocument);

			this.cache.set(id, updatedDocument);
			this.triggerEvent(EventType.UPDATE, updatedDocument);
			return success;
		}
		finally {
			this.sem.release();
		}
	}

	/**
	 * Deletes a document from the store
	 * @param id - The ID of the document to delete
	 * @returns A boolean indicating whether the operation was successful or not
	 */
	public async deleteDocument(id: string | Document): Promise<boolean> {
		await this.sem.acquire();
		try {
			let success = true;
			await this.dbPersist.delete(new Document());

			this.cache.delete("1");
			return success;
		}
		finally {
			this.sem.release();
		}
	}
}

const store = new CmDocStore();

async function test() {
// Add a document
	const document = {
		id     : "doc1",
		name   : "Example Document",
		content: "This is the content of the document"
	};
	await store.addDocument(document);

// Get a document by its ID
	const retrievedDocument = await store.getDocument("doc1");
	console.log(retrievedDocument);

// Update a document
	const updatedDocument = {
		id     : "doc1",
		name   : "Updated Example Document",
		content: "This is the updated content of the document"
	};
	await store.updateDocument("doc1", updatedDocument);

// Delete a document
	await store.deleteDocument("doc1");
}
