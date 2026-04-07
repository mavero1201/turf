import UploadPanel from '@/components/UploadPanel'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f8fafc_35%,_#eef4ff_100%)] px-4 py-10 md:px-8">
      {/* animated ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[8%] h-[320px] w-[320px] animate-[pulse_18s_ease-in-out_infinite] rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[22%] right-[6%] h-[360px] w-[360px] animate-[pulse_24s_ease-in-out_infinite] rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="absolute bottom-[8%] left-[18%] h-[300px] w-[300px] animate-[pulse_22s_ease-in-out_infinite] rounded-full bg-sky-100/30 blur-3xl" />
        <div className="absolute bottom-[12%] right-[14%] h-[260px] w-[260px] animate-[pulse_26s_ease-in-out_infinite] rounded-full bg-emerald-100/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-10">
        <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/80 px-8 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.10)] ring-1 ring-slate-100/80 backdrop-blur-sm md:px-10 md:py-12">
          {/* мягкий премиальный glow */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0)_30%)]" />

          <div className="relative max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
              TURF-анализ: Total Unduplicated Reach and Frequency
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Загрузите Excel-файл, в котором:
              <br />
              строки - отдельные респонденты,
              <br />
              столбцы - атрибуты (начиная с первого столбца),
              <br />
              значения - бинарные (1 - выбран, 0 - не выбран).
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
