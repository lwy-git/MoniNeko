import { DB_NAME, TABLES, INDEXES } from './schema.js'

class SQLiteAdapter {
	constructor() {
		this.isOpen = false
	}

	open() {
		return new Promise((resolve, reject) => {
			plus.sqlite.openDatabase({
				name: DB_NAME,
				path: `_doc/${DB_NAME}.db`,
				success: () => {
					this.isOpen = true
					resolve()
				},
				fail: (e) => reject(e)
			})
		})
	}

	executeSql(sql) {
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: DB_NAME,
				sql: sql,
				success: () => resolve(),
				fail: (e) => reject(e)
			})
		})
	}

	selectSql(sql) {
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: DB_NAME,
				sql: sql,
				success: (data) => resolve(data),
				fail: (e) => reject(e)
			})
		})
	}

	async init() {
		await this.open()
		for (const sql of Object.values(TABLES)) {
			await this.executeSql(sql)
		}
		for (const sql of INDEXES) {
			await this.executeSql(sql)
		}
	}

	async insert(table, data) {
		const keys = Object.keys(data)
		const values = keys.map(k => {
			const v = data[k]
			return typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
		})
		const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.join(',')})`
		await this.executeSql(sql)
		const result = await this.selectSql(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`)
		return result[0]
	}

	async update(table, id, data) {
		const sets = Object.entries(data).map(([k, v]) => {
			return typeof v === 'string' ? `${k}='${v.replace(/'/g, "''")}'` : `${k}=${v}`
		})
		const sql = `UPDATE ${table} SET ${sets.join(',')} WHERE id=${typeof id === 'string' ? `'${id}'` : id}`
		await this.executeSql(sql)
		const result = await this.selectSql(
			`SELECT * FROM ${table} WHERE id=${typeof id === 'string' ? `'${id}'` : id}`
		)
		return result[0]
	}

	async delete(table, id) {
		const sql = `DELETE FROM ${table} WHERE id=${typeof id === 'string' ? `'${id}'` : id}`
		await this.executeSql(sql)
	}

	async query(table, whereFn = null) {
		const sql = `SELECT * FROM ${table}`
		const results = await this.selectSql(sql)
		if (whereFn) return results.filter(whereFn)
		return results
	}
}

export default SQLiteAdapter
