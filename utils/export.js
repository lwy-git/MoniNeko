import { CATEGORIES, INCOME_CATEGORIES } from '@/config/constants.js'

const allCategories = [...CATEGORIES, ...INCOME_CATEGORIES]
const categoryLabelMap = {}
allCategories.forEach(c => { categoryLabelMap[c.key] = c.label })

export function exportToCSV(records) {
	const BOM = '﻿'
	const totalExpense = records
		.filter(r => r.type !== 'income')
		.reduce((sum, r) => sum + r.amount, 0)
	const totalIncome = records
		.filter(r => r.type === 'income')
		.reduce((sum, r) => sum + r.amount, 0)

	const summary = [
		`汇总统计`,
		`总支出,¥${totalExpense.toFixed(2)}`,
		`总收入,¥${totalIncome.toFixed(2)}`,
		`净支出,¥${(totalExpense - totalIncome).toFixed(2)}`,
		`记录数,${records.length}条`,
		``
	]

	const header = '日期,时间,类型,分类,金额,备注'
	const rows = records.map(r => {
		const type = r.type === 'income' ? '收入' : '支出'
		const category = categoryLabelMap[r.category] || r.category || ''
		const remark = (r.remark || '').replace(/,/g, '，')
		return `${r.expense_date},${r.expense_time || ''},${type},${category},${r.amount},${remark}`
	})
	return BOM + summary.join('\n') + '\n' + header + '\n' + rows.join('\n')
}

export function downloadCSV(csvContent, filename) {
	// #ifdef H5
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = filename
	link.click()
	URL.revokeObjectURL(url)
	// #endif

	// #ifdef APP-PLUS
	const filePath = `_doc/${filename}`
	plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
		fs.root.getFile(filePath, { create: true }, (fileEntry) => {
			fileEntry.createWriter((writer) => {
				writer.write(csvContent)
				writer.onwrite = () => {
					uni.shareFile({
						filePath: fileEntry.toLocalURL(),
						success() {},
						fail() {
							uni.showToast({ title: '导出成功，文件已保存', icon: 'none' })
						}
					})
				}
			})
		})
	})
	// #endif
}
