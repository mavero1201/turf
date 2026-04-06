import type { TurfResponse, TurfRowResult } from '@/lib/types'

export type CalculateTurfInput = {
  matrix: number[][]
  headers: string[]
  maxK: number
  positiveValue?: number
  fileName?: string
}

const MAX_COMBINATIONS_PER_STEP = 200000

export function combinationCount(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1

  const effectiveK = Math.min(k, n - k)
  let result = 1

  for (let i = 1; i <= effectiveK; i += 1) {
    result = (result * (n - effectiveK + i)) / i
  }

  return Math.round(result)
}

function getCombinations(items: number[], k: number): number[][] {
  const results: number[][] = []

  function backtrack(start: number, current: number[]) {
    if (current.length === k) {
      results.push([...current])
      return
    }

    for (let i = start; i < items.length; i += 1) {
      current.push(items[i])
      backtrack(i + 1, current)
      current.pop()
    }
  }

  backtrack(0, [])
  return results
}

function calculateReachCount(matrix: number[][], combo: number[], positiveValue: number): number {
  let covered = 0

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    const row = matrix[rowIndex]
    let hasPositive = false

    for (const columnIndex of combo) {
      if (row[columnIndex] === positiveValue) {
        hasPositive = true
        break
      }
    }

    if (hasPositive) covered += 1
  }

  return covered
}

export function calculateTurf({
  matrix,
  headers,
  maxK,
  positiveValue = 1,
  fileName
}: CalculateTurfInput): TurfResponse {
  const respondentCount = matrix.length
  const optionCount = headers.length

  if (respondentCount === 0) {
    throw new Error('Нет данных для расчёта.')
  }

  if (optionCount < 2) {
    throw new Error('Для TURF нужны как минимум две опции.')
  }

  const safeMaxK = Math.max(1, Math.min(maxK, optionCount))
  const optionIndices = Array.from({ length: optionCount }, (_, index) => index)
  const results: TurfRowResult[] = []
  let previousReachPct = 0

  for (let k = 1; k <= safeMaxK; k += 1) {
    const totalCombinations = combinationCount(optionCount, k)

    if (totalCombinations > MAX_COMBINATIONS_PER_STEP) {
      throw new Error(
        `Слишком много комбинаций для точного расчёта при k=${k} (${totalCombinations.toLocaleString('ru-RU')}). Уменьшите max k или число атрибутов.`
      )
    }

    const combos = getCombinations(optionIndices, k)
    let bestReachCount = -1
    let bestCombo: number[] = []

    for (const combo of combos) {
      const reachCount = calculateReachCount(matrix, combo, positiveValue)

      if (reachCount > bestReachCount) {
        bestReachCount = reachCount
        bestCombo = combo
      }
    }

    const reachPct = bestReachCount / respondentCount

    results.push({
      k,
      bestCombinationIndices: bestCombo,
      bestCombinationLabels: bestCombo.map((index) => headers[index]),
      reachCount: bestReachCount,
      reachPct,
      incrementalReachPct: reachPct - previousReachPct
    })

    previousReachPct = reachPct
  }

  return {
    meta: {
      respondents: respondentCount,
      options: optionCount,
      maxK: safeMaxK,
      positiveValue,
      fileName
    },
    results
  }
}
