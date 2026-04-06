import { NextRequest, NextResponse } from 'next/server'
import { calculateTurf, combinationCount } from '@/lib/turf'
import { parseExcel } from '@/lib/parseExcel'

const MAX_OPTIONS = 20
const MAX_K = 5
const MAX_FILE_SIZE_MB = 10
const MAX_EXACT_SET_OPERATIONS = 300000

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const maxKValue = Number(formData.get('maxK') ?? 3)

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Не найден файл для загрузки.' }, { status: 400 })
    }

    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({ error: 'Поддерживаются только файлы .xlsx.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Файл слишком большой. Лимит для MVP - ${MAX_FILE_SIZE_MB} МБ.` },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const parsed = parseExcel(buffer)

    if (parsed.headers.length > MAX_OPTIONS) {
      return NextResponse.json(
        { error: `Для MVP поддерживается не более ${MAX_OPTIONS} столбцов с опциями.` },
        { status: 400 }
      )
    }

    const safeMaxK = Math.min(Math.max(1, Math.floor(maxKValue || 3)), MAX_K, parsed.headers.length)

    let plannedOperations = 0
    for (let k = 1; k <= safeMaxK; k += 1) {
      plannedOperations += combinationCount(parsed.headers.length, k)
    }

    if (plannedOperations > MAX_EXACT_SET_OPERATIONS) {
      return NextResponse.json(
        {
          error:
            'Комбинаторика для точного расчёта слишком большая для MVP. Уменьшите число опций или max k.'
        },
        { status: 400 }
      )
    }

    const result = calculateTurf({
      matrix: parsed.matrix,
      headers: parsed.headers,
      maxK: safeMaxK,
      fileName: file.name
    })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось обработать файл.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
