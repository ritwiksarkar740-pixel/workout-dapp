export default function WorkoutLogger({ connected, completionPct, completedCount, totalExercises, onLog, logging, txHash }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mt-2">
      {/* Progress ring area */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#1e293b" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="26"
              fill="none"
              stroke="#22c55e"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - completionPct / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-400 font-bold text-sm">{completionPct}%</span>
          </div>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Daily Progress</p>
          <p className="text-slate-400 text-xs">{completedCount} of {totalExercises} exercises done</p>
          {txHash && (
            <p className="text-green-500 text-xs font-mono mt-1 truncate max-w-[160px]">
              ✓ {txHash.slice(0, 10)}…{txHash.slice(-6)}
            </p>
          )}
        </div>
      </div>

      {/* Log button */}
      <button
        onClick={onLog}
        disabled={!connected || logging || completionPct === 0}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
          !connected
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            : completionPct === 0
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : logging
            ? 'bg-green-700 text-green-200 cursor-wait border border-green-600'
            : 'bg-green-500 hover:bg-green-400 text-black border border-green-400'
        }`}
      >
        {logging ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Writing to chain…
          </>
        ) : txHash ? (
          '✓ Streak Logged On-Chain'
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {connected ? 'Log Completed Workout On-Chain' : 'Connect wallet to log'}
          </>
        )}
      </button>
    </div>
  );
}
