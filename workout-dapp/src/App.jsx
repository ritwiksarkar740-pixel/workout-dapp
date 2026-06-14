import { useRef, useCallback } from 'react';
import { useWorkoutState } from './hooks/useWorkoutState';
import VideoPlayer from './components/VideoPlayer';
import ExerciseChecklist from './components/ExerciseChecklist';
import WalletConnect from './components/WalletConnect';
import WorkoutLogger from './components/WorkoutLogger';

export default function App() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const {
    workoutData,
    activeWorkoutId,
    setActiveWorkoutId,
    activeWorkout,
    setVideoDuration,
    isChecked,
    toggleCheck,
    isCategoryExpanded,
    toggleCategory,
    completionPct,
    completedCount,
    totalExercises,
    walletConnected,
    walletAddress,
    connectWallet,
    txHash,
    logOnChain,
    logging,
  } = useWorkoutState();

  const scrollToPlayer = useCallback(() => {
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handlePlayExercise = useCallback((workout, exercise) => {
    if (activeWorkoutId !== workout.id) setActiveWorkoutId(workout.id);
    scrollToPlayer();
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = exercise.seconds;
        videoRef.current.play();
      }
    }, 150);
  }, [activeWorkoutId, setActiveWorkoutId, scrollToPlayer]);

  const handlePlayFull = useCallback((workout) => {
    if (activeWorkoutId !== workout.id) setActiveWorkoutId(workout.id);
    scrollToPlayer();
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 150);
  }, [activeWorkoutId, setActiveWorkoutId, scrollToPlayer]);

  return (
    <div className="min-h-screen bg-[#060a10] text-white">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#060a10]/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
              </svg>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide leading-none">WorkoutDApp</h1>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Local video trainer</p>
            </div>
          </div>

          {/* Progress pill — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full px-3 py-1.5">
            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
            </div>
            <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{completionPct}%</span>
          </div>

          <WalletConnect connected={walletConnected} address={walletAddress} onConnect={connectWallet} />
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">

        {/*
          Layout:
          Mobile (< md)   → stacked: video on top, checklist below
          Tablet (md–lg)  → stacked with wider padding
          Desktop (≥ lg)  → side by side: checklist left, sticky video right
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] lg:gap-6 xl:gap-8">

          {/* ── VIDEO PANEL (top on mobile/tablet, right-sticky on desktop) ── */}
          <div
            ref={playerRef}
            className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start mb-4 sm:mb-6 lg:mb-0"
          >
            {/* Now Playing label */}
            <div className="mb-2 sm:mb-3 flex items-start justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-green-400 uppercase tracking-widest mb-0.5">
                  Now Playing
                </p>
                <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {activeWorkout?.category}
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-500">by {activeWorkout?.source}</p>
              </div>
              {/* Mobile progress pill */}
              <div className="flex sm:hidden items-center gap-1.5 bg-slate-800/60 border border-slate-700 rounded-full px-2.5 py-1">
                <div className="w-10 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{completionPct}%</span>
              </div>
            </div>

            <VideoPlayer
              workout={activeWorkout}
              onDurationLoad={setVideoDuration}
              videoRef={videoRef}
              onSeek={(t) => { if (videoRef.current) videoRef.current.currentTime = t; }}
            />

            {/* Pit stop hint */}
            <div className="mt-2 flex items-center gap-2 text-[10px] sm:text-xs text-slate-600">
              <div className="w-2 h-2 rounded-full border-2 border-green-500 bg-slate-900 shrink-0" />
              <span>Tap timeline dots to jump to exercise</span>
            </div>
          </div>

          {/* ── CHECKLIST PANEL (bottom on mobile/tablet, left on desktop) ── */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-slate-200">Workout Modules</h2>
              <span className="text-[10px] sm:text-xs text-slate-500 font-mono">
                {completedCount}/{totalExercises}
              </span>
            </div>

            <ExerciseChecklist
              workoutData={workoutData}
              activeWorkoutId={activeWorkoutId}
              setActiveWorkoutId={setActiveWorkoutId}
              isChecked={isChecked}
              toggleCheck={toggleCheck}
              isCategoryExpanded={isCategoryExpanded}
              toggleCategory={toggleCategory}
              onPlayExercise={handlePlayExercise}
              onPlayFull={handlePlayFull}
              videoRef={videoRef}
            />

            <WorkoutLogger
              connected={walletConnected}
              completionPct={completionPct}
              completedCount={completedCount}
              totalExercises={totalExercises}
              onLog={logOnChain}
              logging={logging}
              txHash={txHash}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
