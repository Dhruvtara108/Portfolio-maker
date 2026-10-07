interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#0d1021] px-6 text-white">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold shadow-lg shadow-indigo-500/30">
              P
            </span>
            <span className="font-semibold tracking-tight">Portfolio Maker</span>
          </div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Your next opportunity starts here
          </p>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Build a portfolio tailored to the job you want.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            Bring your experience, resume, and target job description together. Portfolio Maker
            is designed to help you present your best work for the opportunity ahead.
          </p>
          <button
            className="mt-10 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-950 shadow-xl shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-50"
            onClick={onStart}
            type="button"
          >
            Create Your Portfolio <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
          <div className="rounded-2xl bg-white p-6 text-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <div className="h-3 w-28 rounded-full bg-indigo-100" />
                <div className="mt-3 h-2 w-44 rounded-full bg-slate-100" />
              </div>
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-300" />
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Your story', 'Selected work', 'Skills & tools', 'Contact'].map((item, index) => (
                <div className="rounded-xl bg-slate-50 p-4" key={item}>
                  <div className="mb-4 h-16 rounded-lg bg-gradient-to-br from-slate-100 to-indigo-50" />
                  <p className="text-sm font-semibold">{item}</p>
                  <div className="mt-2 h-2 w-2/3 rounded-full bg-slate-200" />
                  {index === 0 && <div className="mt-2 h-2 w-1/2 rounded-full bg-slate-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
