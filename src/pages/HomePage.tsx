function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 px-4 text-neutral-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/50 p-8 shadow-2xl backdrop-blur-xl">
        
        <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              홈
            </span>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              현재 위치는 홈입니다.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;