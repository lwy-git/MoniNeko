import { TABLES } from './schema.js'

class StorageAdapter {
	constructor() {
		this.prefix = 'monineko_'
	}

	_getTable(table) {
		const data = uni.getStorageSync(this.prefix + table)
		return data ? JSON.parse(data) : []
	}

	_setTable(table, rows) {
		uni.setStorageSync(this.prefix + table, JSON.stringify(rows))
	}

	async init() {
		for (const table of Object.keys(TABLES)) {
			if (!uni.getStorageSync(this.prefix + table)) {
				this._setTable(table, [])
			}
		}
	}

	async insert(table, data) {
		const rows = this._getTable(table)
		const id = rows.length > 0 ? Math.max(...rows.map(r => r.id || 0)) + 1 : 1
		const record = { id, ...data }
		rows.push(record)
		this._setTable(table, rows)
		return record
	}

	async query(table, whereFn = null) {
		let rows = this._getTable(table)
		if (whereFn) rows = rows.filter(whereFn)
		return rows
	}

	async update(table, id, data) {
		const rows = this._getTable(table)
		const idx = rows.findIndex(r => r.id === id)
		if (idx >= 0) {
			rows[idx] = { ...rows[idx], ...data }
			this._setTable(table, rows)
			return rows[idx]
		}
		return null
	}

	async delete(table, id) {
		let rows = this._getTable(table)
		rows = rows.filter(r => r.id !== id)
		this._setTable(table, rows)
	}
}

export default StorageAdapter
