import StorageAdapter from './storage-adapter.js'
import SQLiteAdapter from './sqlite-adapter.js'

let db = null

export function getDB() {
	return db
}

export async function initDB() {
	// #ifdef APP-PLUS
	db = new SQLiteAdapter()
	// #endif

	// #ifndef APP-PLUS
	db = new StorageAdapter()
	// #endif

	await db.init()
	return db
}
