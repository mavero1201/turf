import UploadPanel from '@/components/UploadPanel'

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-10">

        <section className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white/80 px-8 py-10 shadow-xl backdrop-blur-sm md:px-10 md:py-12">

          {/* мягкий премиальный glow */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />

          <div className="relative max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
              Анализ Total Unduplicated Reach (TURF)
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Загрузите Excel-файл, в котором:
              <br />
              строки — отдельные респонденты,
              <br />
              столбцы — атрибуты (начиная с первого столбца),
              <br />
              значения — бинарные (1 — выбран, 0 — не выбран).
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600">
              В результате вы получите оптимальные комбинации атрибутов, охват по каждому размеру набора и кривую накопленного охвата.
            </p>
          </div>
        </section>

        <UploadPanel />
      </div>
    </main>
  )
}
