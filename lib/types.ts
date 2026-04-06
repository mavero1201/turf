export type TurfRowResult = {
  k: number
  bestCombinationIndices: number[]
  bestCombinationLabels: string[]
  reachCount: number
  reachPct: number
  incrementalReachPct: number
}

export type TurfResponse = {
  meta: {
    respondents: number
    options: number
    maxK: number
    positiveValue: number
    fileName?: string
  }
  results: TurfRowResult[]
}
