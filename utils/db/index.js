import StorageAdapter from './storage-adapter.js'

let db = null

export function getDB() {
	return db
}

export async function initDB() {
	// #ifdef APP-PLUS
	const { default: SQLiteAdapter } = await import('./sqlite-adapter.js')
	db = new SQLiteAdapter()
	// #endif

	// #ifndef APP-PLUS
	db = new StorageAdapter()
	// #endif

	await db.init()
	return db
}
