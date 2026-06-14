export default function WalletConnect({ connected, address, onConnect }) {
  return (
    <div className="flex items-center gap-3">
      {connected ? (
        <div className="flex items-center gap-2 bg-green-950 border border-green-700 rounded-lg px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-mono">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-green-500 text-slate-200 hover:text-green-400 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
