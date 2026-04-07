'use client'

import { useMemo, useState } from 'react'
import { BarChart3, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import * as XLSX from 'xlsx'
import ResultTable from '@/components/ResultTable'
import TurfChart from '@/components/TurfChart'
import InterpretationCard from '@/components/InterpretationCard'
import type { TurfResponse } from '@/lib/types'

const ACCEPT = '.xlsx'

export default function UploadPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [maxK, setMaxK] = useState(3)
  const [submittedMaxK, setSubmittedMaxK] = useState<number | null>(null)
  const [detectedOptionCount, setDetectedOptionCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TurfResponse | null>(null)

  const fileLabel = useMemo(() => file?.name ?? 'Файл ещё не выбран', [file])

  async function handleFileChange(nextFile: File | null) {
    setFile(nextFile)
    setResult(null)
    setError(null)
    setSubmittedMaxK(null)

    if (!nextFile) {
      setDetectedOptionCount(null)
      setMaxK(3)
      return
    }

    try {
      const buffer = await nextFile.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const firstSheet = workbook.SheetNames[0]

      if (!firstSheet) {
        setDetectedOptionCount(null)
        return
      }

      const sheet = workbook.Sheets[firstSheet]
      const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
        header: 1,
        blankrows: false,
        defval: null
      })

      const headerRow = rows[0] ?? []
      const optionCount = headerRow.length

      if (optionCount > 0) {
        setDetectedOptionCount(optionCount)
        setMaxK(optionCount)
      } else {
        setDetectedOptionCount(null)
      }
    } catch {
      setDetectedOptionCount(null)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setResult(null)

    if (!file) {
      setError('Сначала загрузите файл .xlsx.')
      return
    }

    const safeMaxK = Math.max(1, Math.floor(maxK || 1))
    setSubmittedMaxK(safeMaxK)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('maxK', String(safeMaxK))

    setIsLoading(true)

    try {
      const response = await fetch('/api/turf', {
        method: 'POST',
        body: formData
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Не удалось рассчитать TURF.')
      }

      setResult(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось рассчитать TURF.')
    } finally {
      setIsLoading(false)
    }
  }

  const wasKAdjusted =
    submittedMaxK !== null &&
    result !== null &&
    submittedMaxK !== result.meta.maxK

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_28%)]" />
          <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-blue-100/40 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/90 p-3 text-blue-600 shadow-sm">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Загрузка данных</h2>
              <p className="text-sm text-slate-600">
                Файл Excel (.xlsx), первый лист. Первая строка - названия атрибутов, со второй строки - данные респондентов 0/1.
              </p>
            </div>
          </div>

          <label className="relative flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-300/90 bg-slate-50/85 px-6 py-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-inner">
            <input
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)}
            />
            <FileSpreadsheet className="mb-3 h-10 w-10 text-slate-500 transition-transform duration-300 group-hover:scale-[1.02]" />
            <div className="text-base font-semibold text-slate-800">Выберите файл</div>
            <div className="mt-1 text-sm text-slate-600">Поддерживается формат .xlsx</div>
            <div
              className="mt-4 max-w-full truncate rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-sm"
              title={fileLabel}
            >
              {fileLabel}
            </div>
          </label>
        </div>

        <div className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_28%)]" />
          <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-emerald-100/40 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/90 p-3 text-emerald-600 shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Параметры расчёта</h2>
              <p className="text-sm text-slate-600">Точный расчёт без весов и без frequency.</p>
            </div>
          </div>

          <div className="relative space-y-4">
            <div>
              <label htmlFor="maxK" className="mb-2 block text-sm font-medium text-slate-700">
                Максимальный размер набора (k)
              </label>
              <input
                id="maxK"
                type="number"
                min={1}
                value={maxK}
                onChange={(event) => setMaxK(Number(event.target.value) || 1)}
                className="w-full rounded-2xl border border-slate-300 bg-white/95 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.10)]"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                По умолчанию используется максимально возможное значение k по числу атрибутов в файле. При необходимости можно задать меньшее значение для анализа наборов меньшего размера.
              </p>
              {detectedOptionCount !== null ? (
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Сейчас по умолчанию установлено: <span className="font-medium text-slate-700">{detectedOptionCount}</span>
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_16px_36px_rgba(15,23,42,0.22)] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_45%)]" />
              {isLoading ? <Loader2 className="relative h-4 w-4 animate-spin" /> : null}
              <span className="relative">{isLoading ? 'Считаем TURF...' : 'Рассчитать TURF'}</span>
            </button>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 text-xs leading-5 text-slate-600 shadow-sm">
              Текущая версия принимает бинарные данные 0/1. Первая строка используется как названия атрибутов. Расчёт выполняется точным перебором комбинаций, поэтому при большом числе атрибутов и высоком max k время обработки может увеличиваться.
            </div>
          </div>
        </div>
      </form>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/95 px-4 py-3 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-6">
          {wasKAdjusted ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/95 px-4 py-3 text-sm text-amber-900 shadow-sm">
              Вы указали k = {submittedMaxK}, но в загруженном файле доступно только {result.meta.options} атрибутов. Поэтому расчёт выполнен с максимально возможным значением k = {result.meta.maxK}.
            </div>
          ) : null}

          <section className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Респонденты" value={String(result.meta.respondents)} />
            <MetricCard label="Атрибуты" value={String(result.meta.options)} />
            <MetricCard label="Max k" value={String(result.meta.maxK)} />
            <MetricCard label="Файл" value={result.meta.fileName ?? '-'} small />
          </section>

          <section className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0)_28%)]" />
            <h2 className="relative mb-4 text-lg font-semibold text-slate-800">Оптимальные комбинации по размеру набора</h2>
            <ResultTable data={result} />
          </section>

          <section className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0)_28%)]" />
            <h2 className="relative mb-2 text-lg font-semibold text-slate-800">Кривая накопленного охвата</h2>
            <p className="relative mb-4 text-sm text-slate-600">
              График показывает максимальный уникальный охват для каждого размера оптимального набора.
            </p>
            <div className="relative">
              <TurfChart results={result.results} />
            </div>
            <div className="relative mt-4">
              <InterpretationCard />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

function MetricCard({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.11)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0)_30%)]" />
      <div className="relative text-sm text-slate-500">{label}</div>
      <div className={`relative mt-2 font-semibold text-slate-800 ${small ? 'text-base break-all' : 'text-2xl'}`}>{value}</div>
    </div>
  )
}
