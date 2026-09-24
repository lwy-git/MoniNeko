export const DB_NAME = 'monineko'
export const DB_VERSION = 1

export const TABLES = {
	user: `CREATE TABLE IF NOT EXISTS user (
		id TEXT PRIMARY KEY,
		account_type TEXT DEFAULT 'guest',
		nickname TEXT DEFAULT '铲屎官',
		avatar_url TEXT DEFAULT '',
		created_at TEXT NOT NULL,
		last_login_at TEXT NOT NULL
	)`,
	monthly_budget: `CREATE TABLE IF NOT EXISTS monthly_budget (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id TEXT NOT NULL,
		year_month TEXT NOT NULL,
		budget_amount REAL NOT NULL,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL,
		UNIQUE(user_id, year_month)
	)`,
	expense_record: `CREATE TABLE IF NOT EXISTS expense_record (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id TEXT NOT NULL,
		type TEXT DEFAULT 'expense',
		expense_date TEXT NOT NULL,
		expense_time TEXT NOT NULL,
		item_name TEXT NOT NULL,
		amount REAL NOT NULL,
		category TEXT DEFAULT 'other',
		remark TEXT DEFAULT '',
		photo_url TEXT DEFAULT '',
		is_template INTEGER DEFAULT 0,
		created_at TEXT NOT NULL
	)`,
	cat_status: `CREATE TABLE IF NOT EXISTS cat_status (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id TEXT NOT NULL UNIQUE,
		cat_name TEXT DEFAULT '招财',
		breed TEXT DEFAULT 'orange',
		current_fish INTEGER DEFAULT 0,
		current_level INTEGER DEFAULT 1,
		current_accessory TEXT DEFAULT '',
		last_checkin_date TEXT DEFAULT ''
	)`,
	cat_accessory: `CREATE TABLE IF NOT EXISTS cat_accessory (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id TEXT NOT NULL,
		accessory_key TEXT NOT NULL,
		purchase_price INTEGER NOT NULL,
		purchased_at TEXT NOT NULL,
		UNIQUE(user_id, accessory_key)
	)`,
	achievement: `CREATE TABLE IF NOT EXISTS achievement (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id TEXT NOT NULL,
		achievement_key TEXT NOT NULL,
		unlocked_at TEXT NOT NULL,
		UNIQUE(user_id, achievement_key)
	)`
}

export const INDEXES = [
	'CREATE INDEX IF NOT EXISTS idx_expense_user_date ON expense_record(user_id, expense_date)',
	'CREATE INDEX IF NOT EXISTS idx_budget_user_month ON monthly_budget(user_id, year_month)',
	'CREATE INDEX IF NOT EXISTS idx_accessory_user ON cat_accessory(user_id)',
	'CREATE INDEX IF NOT EXISTS idx_achievement_user ON achievement(user_id)'
]
