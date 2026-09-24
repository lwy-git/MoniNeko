const CHINESE_DIGITS = {
	零: 0,
	〇: 0,
	一: 1,
	二: 2,
	两: 2,
	三: 3,
	四: 4,
	五: 5,
	六: 6,
	七: 7,
	八: 8,
	九: 9
}

const CATEGORY_KEYWORDS = {
	expense: [
		{ key: 'food', words: ['早餐', '午餐', '晚餐', '夜宵', '吃饭', '外卖', '餐厅', '咖啡', '奶茶', '水果', '零食', '买菜', '火锅', '面包'] },
		{ key: 'transport', words: ['打车', '出租车', '地铁', '公交', '高铁', '火车', '机票', '加油', '停车', '过路费', '交通'] },
		{ key: 'shopping', words: ['购物', '淘宝', '京东', '拼多多', '衣服', '鞋子', '超市', '日用品', '买了'] },
		{ key: 'entertainment', words: ['电影', '游戏', '唱歌', 'KTV', '旅游', '门票', '演出', '娱乐', '会员'] },
		{ key: 'medical', words: ['医院', '看病', '买药', '药店', '体检', '挂号', '医疗'] },
		{ key: 'housing', words: ['房租', '水费', '电费', '燃气', '物业', '网费', '宽带', '住房'] },
		{ key: 'cat', words: ['猫粮', '猫砂', '宠物', '罐头', '逗猫棒', '鱼干'] }
	],
	income: [
		{ key: 'salary', words: ['工资', '薪水', '发薪', '薪资'] },
		{ key: 'bonus', words: ['奖金', '年终奖', '补贴', '津贴'] },
		{ key: 'invest', words: ['利息', '分红', '理财', '股票', '基金收益', '投资收益'] },
		{ key: 'parttime', words: ['兼职', '稿费', '副业', '佣金'] },
		{ key: 'redpacket', words: ['红包', '收款', '收到转账'] }
	]
}

const INCOME_WORDS = ['收入', '到账', '入账', '收到', '收款', '赚了', '挣了', '工资', '薪水', '奖金', '红包', '分红', '利息', '兼职', '稿费']
const EXPENSE_WORDS = ['支出', '消费', '花了', '花费', '付款', '付了', '买了', '用了']

const CATEGORY_LABELS = {
	food: '餐饮',
	transport: '交通',
	shopping: '购物',
	entertainment: '娱乐',
	medical: '医疗',
	housing: '住房',
	cat: '猫咪',
	other: '其他',
	salary: '工资',
	bonus: '奖金',
	invest: '理财',
	parttime: '兼职',
	redpacket: '红包',
	other_income: '其他'
}

function parseChineseInteger(value) {
	if (!value) return NaN
	if (!/[十百千万]/.test(value)) {
		const digits = [...value].map(char => CHINESE_DIGITS[char])
		if (digits.some(digit => digit === undefined)) return NaN
		return Number(digits.join(''))
	}

	let total = 0
	let section = 0
	let number = 0
	for (const char of value) {
		if (CHINESE_DIGITS[char] !== undefined) {
			number = CHINESE_DIGITS[char]
			continue
		}
		const unit = { 十: 10, 百: 100, 千: 1000, 万: 10000 }[char]
		if (!unit) continue
		if (unit === 10000) {
			total += (section + number) * unit
			section = 0
			number = 0
		} else {
			section += (number || 1) * unit
			number = 0
		}
	}
	return total + section + number
}

function parseChineseNumber(value) {
	if (!value) return NaN
	const normalized = value.replace(/两/g, '二')
	const [integerPart, decimalPart] = normalized.split('点')
	const integer = parseChineseInteger(integerPart)
	if (!Number.isFinite(integer)) return NaN
	if (!decimalPart) return integer
	const decimals = [...decimalPart]
		.map(char => CHINESE_DIGITS[char])
		.filter(digit => digit !== undefined)
	if (!decimals.length) return integer
	return Number(`${integer}.${decimals.join('')}`)
}

function extractAmount(text) {
	const arabicOralDecimal = text.match(/(\d+)\s*块\s*(\d{1,2})(?:毛|角)?/)
	if (arabicOralDecimal) {
		return Number(`${arabicOralDecimal[1]}.${arabicOralDecimal[2]}`)
	}

	const arabicWithUnit = text.match(/(\d+(?:\.\d{1,2})?)\s*(?:元|圆|块钱|块)/)
	if (arabicWithUnit) return Number(arabicWithUnit[1])

	const arabicAfterVerb = text.match(/(?:花了|花费|消费|支出|收入|到账|收到|赚了|挣了|付了|付款)\s*(\d+(?:\.\d{1,2})?)/)
	if (arabicAfterVerb) return Number(arabicAfterVerb[1])

	const chineseOralDecimal = text.match(/([零〇一二两三四五六七八九十百千万]+)块([零〇一二三四五六七八九]{1,2})(?:毛|角)?/)
	if (chineseOralDecimal) {
		const integer = parseChineseInteger(chineseOralDecimal[1])
		const decimalDigits = [...chineseOralDecimal[2]].map(char => CHINESE_DIGITS[char]).join('')
		return Number(`${integer}.${decimalDigits}`)
	}

	const chineseYuanJiao = text.match(/([零〇一二两三四五六七八九十百千万]+)(?:元|圆|块钱|块)([零〇一二三四五六七八九])(?:毛|角)/)
	if (chineseYuanJiao) {
		return parseChineseInteger(chineseYuanJiao[1]) + CHINESE_DIGITS[chineseYuanJiao[2]] / 10
	}

	const chineseWithUnit = text.match(/([零〇一二两三四五六七八九十百千万点]+)(?:元|圆|块钱|块)/)
	if (chineseWithUnit) return parseChineseNumber(chineseWithUnit[1])

	const chineseAfterVerb = text.match(/(?:花了|花费|消费|支出|收入|到账|收到|赚了|挣了|付了)\s*([零〇一二两三四五六七八九十百千万点]+)/)
	if (chineseAfterVerb) return parseChineseNumber(chineseAfterVerb[1])

	return null
}

function detectType(text) {
	const hasIncomeWord = INCOME_WORDS.some(word => text.includes(word))
	const hasExpenseWord = EXPENSE_WORDS.some(word => text.includes(word))
	if (hasIncomeWord && !hasExpenseWord) return 'income'
	return 'expense'
}

function detectCategory(text, type) {
	const mappings = CATEGORY_KEYWORDS[type]
	for (const mapping of mappings) {
		if (mapping.words.some(word => text.includes(word))) return mapping.key
	}
	return type === 'income' ? 'other_income' : 'other'
}

function buildRemark(text, amount, type, category) {
	let remark = text
		.replace(/[，。！？,.!?]/g, '')
		.replace(/\d+\s*块\s*\d{1,2}(?:毛|角)?/g, '')
		.replace(/\d+(?:\.\d{1,2})?\s*(?:元|圆|块钱|块)?/g, '')
		.replace(/[零〇一二两三四五六七八九十百千万点]+(?:元|圆|块钱|块)?[零〇一二三四五六七八九]?(?:毛|角)?/g, '')
		.replace(/(?:帮我|给我|记一笔|记账|记录一下|今天|刚刚|刚才)/g, '')
		.replace(/(?:花了|花费|消费|支出|收入|到账了?|入账了?|收到|收款|赚了|挣了|付款|付了|用了)/g, '')
		.replace(/\s+/g, '')
		.trim()

	if (remark) return remark.slice(0, 30)
	return CATEGORY_LABELS[category] || (amount ? '语音记账' : '')
}

export function parseVoiceExpense(input) {
	const text = String(input || '').trim()
	if (!text) {
		return {
			success: false,
			text: '',
			type: 'expense',
			amount: null,
			category: 'other',
			remark: '',
			missing: ['amount']
		}
	}

	const compactText = text.replace(/\s+/g, '')
	const type = detectType(compactText)
	const amount = extractAmount(compactText)
	const category = detectCategory(compactText, type)
	const remark = buildRemark(compactText, amount, type, category)
	const missing = []
	if (!Number.isFinite(amount) || amount <= 0) missing.push('amount')

	return {
		success: missing.length === 0,
		text,
		type,
		amount: Number.isFinite(amount) ? Number(amount.toFixed(2)) : null,
		category,
		remark,
		missing
	}
}
