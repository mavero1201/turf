import * as XLSX from 'xlsx'

export type ParsedExcel = {
  headers: string[]
  matrix: number[][]
  respondentCount: number
}

const ALLOWED_VALUES = new Set([0, 1])

function normalizeCell(value: unknown): number {
  if (typeof value === 'number') {
    if (ALLOWED_VALUES.has(value)) return value
    throw new Error('Файл должен содержать только значения 0 и 1 в строках данных.')
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '0' || trimmed === '1') return Number(trimmed)
    if (trimmed === '') {
      throw new Error('Пустые ячейки в области данных не допускаются. Используйте 0 или 1.')
    }
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }

  throw new Error('Файл должен содержать только значения 0 и 1 в строках данных.')
}

export function parseExcel(buffer: Buffer): ParsedExcel {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const firstSheet = workbook.SheetNames[0]

  if (!firstSheet) {
    throw new Error('В файле не найден ни один лист.')
  }

  const sheet = workbook.Sheets[firstSheet]
  const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1,
    blankrows: false,
    defval: null
  })

  if (rows.length < 2) {
    throw new Error('Нужны как минимум заголовок и одна строка данных.')
  }

  const rawHeaders = rows[0]
  const headers = rawHeaders.map((value, index) => {
    const label = String(value ?? '').trim()
    return label || `Option_${index + 1}`
  })

  if (headers.length < 2) {
    throw new Error('Для TURF нужны как минимум две опции (два столбца).')
  }

  const matrix = rows.slice(1).map((row, rowIndex) => {
    if (row.length < headers.length) {
      throw new Error(`Строка ${rowIndex + 2} короче заголовка. Заполните все ячейки 0 или 1.`)
    }

    return headers.map((_, colIndex) => normalizeCell(row[colIndex]))
  })

  if (matrix.length === 0) {
    throw new Error('В файле нет строк данных.')
  }

  return {
    headers,
    matrix,
    respondentCount: matrix.length
  }
}
