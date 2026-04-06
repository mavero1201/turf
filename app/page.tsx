import UploadPanel from '@/components/UploadPanel'

export default function Page() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-8 md:py-10">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              TURF MVP
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Анализ Total Unduplicated Reach
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Загрузите Excel-файл с бинарными данными 0/1 и получите оптимальные комбинации опций, охват по
              каждому размеру набора и кривую накопленного охвата.
            </p>
          </div>
        </section>

        <UploadPanel />
      </div>
    </main>
  )
}
