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
    if (activeWorkoutId !== workout.id) {
      setActiveWorkoutId(workout.id);
    }
    scrollToPlayer();
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = exercise.seconds;
        videoRef.current.play();
      }
    }, 150);
  }, [activeWorkoutId, setActiveWorkoutId, scrollToPlayer]);

  const handlePlayFull = useCallback((workout) => {
    if (activeWorkoutId !== workout.id) {
      setActiveWorkoutId(workout.id);
    }
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#060a10]/90 backdrop-blur border-b border-slate-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">WorkoutDApp</h1>
              <p className="text-xs text-slate-500">Local video trainer</p>
            </div>
          </div>
          <WalletConnect connected={walletConnected} address={walletAddress} onConnect={connectWallet} />
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:grid lg:grid-cols-[1fr_420px] lg:gap-6 xl:gap-8">

        {/* LEFT — checklist */}
        <div className="order-2 lg:order-1 mt-6 lg:mt-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-200">Workout Modules</h2>
            <span className="text-xs text-slate-500">{completedCount}/{totalExercises} exercises</span>
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

        {/* RIGHT — sticky video player */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start" ref={playerRef}>
          <div className="mb-3">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-1">Now Playing</p>
            <h2 className="text-base font-bold text-white">{activeWorkout?.category}</h2>
            <p className="text-xs text-slate-500">by {activeWorkout?.source}</p>
          </div>
          <VideoPlayer
            workout={activeWorkout}
            onDurationLoad={setVideoDuration}
            videoRef={videoRef}
            onSeek={(t) => { if (videoRef.current) videoRef.current.currentTime = t; }}
          />
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 bg-slate-900" />
            <span>Hover dots on timeline to preview · click to jump</span>
          </div>
        </div>
      </div>
    </div>
  );
}
