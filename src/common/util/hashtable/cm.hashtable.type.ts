/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-13 15:09
 */

export interface IHashtable<T> {
	getIndexKeys(): IterableIterator<T>;

	/**
	 * Add a key-value pair to the hashtable.
	 * @param key The key to add.
	 * @param value The associated value.
	 */
	put(key: string, value: T): IHashtable<T>;

	/**
	 * Remove a key-value pair from the hashtable.
	 * @param key The key to remove.
	 */
	remove(key: string): void;

	/**
	 * Retrieve the value associated with a given key.
	 * @param key The key to look up.
	 * @return The associated value, or undefined if the key is not found.
	 */
	get(key: string): T | undefined;

	/**
	 * Check if the hashtable contains a given key.
	 * @param key The key to look up.
	 * @return true if the key is found, false otherwise.
	 */
	contains(key: string): boolean;

	/**
	 * Get the number of key-value pairs in the hashtable.
	 * @return The number of key-value pairs.
	 */
	size(): number;

	/**
	 * Serialize the hashtable to a string.
	 * @return A string representation of the hashtable.
	 */
	serialize(): string;

	/**
	 * Deserialize a hashtable from a string.
	 * @param str The string to deserialize.
	 */
	deserialize(str: string): IHashtable<T>;

	/**
	 * Save the hashtable to a file.
	 * @param filepath The path of the file to save to.
	 */
	saveToFile(filepath: string): Promise<IHashtable<T>>;
	/**
	 * Load a hashtable from a file.
	 * @param filepath The path of the file to load from.
	 */
	loadFromFile(filepath: string): Promise<IHashtable<T>>;

	/**
	 * Removes all key-value pairs from the hashtable
	 */
	clear(): IHashtable<T>;

	/**
	 * Returns a standard array representation of the hashtable.
	 * @returns An array of key-value pairs.
	 */
	toArray(): [ string, T ][];

	/**
	 * Returns a standard array representation of the hashtable.
	 * @returns An array of keys.
	 */
	getKeys(): Array<string>;

	/**
	 * Emit an event if event emitter is present.
	 * @param eventName The name of the event to emit.
	 * @param eventValue The value of the event.
	 */
	emitEvent(eventName: string, eventValue: any): void;

	/**
	 * Subscribe to events if event emitter is present.
	 * @param eventName The name of the event to subscribe to.
	 * @param listener The event listener to subscribe.
	 */
	on(eventName: string, listener: (event: any) => void): void;

	/**
	 * Serialize the hashtable to a string.
	 * @return A string representation of the hashtable.
	 */
	serialize(): string;

	/**
	 * Deserialize a hashtable from a string.
	 * @param str The string to deserialize.
	 */
	deserialize(str: string): IHashtable<T>;

	/**
	 * Save the hashtable to a file.
	 * @param filepath The path of the file to save to.
	 */
	saveToFile(filepath: string): Promise<IHashtable<T>>;

	/**
	 * Load a hashtable from a file.
	 * @param filepath The path of the file to load from.
	 */
	loadFromFile(filepath: string): Promise<IHashtable<T>>;
}
