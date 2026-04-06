import UploadPanel from '@/components/UploadPanel'

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-[36px] bg-white px-8 py-10 shadow-md md:px-10 md:py-12">
          <div className="max-w-3xl">
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
