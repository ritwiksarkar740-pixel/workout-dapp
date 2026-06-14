export default function ExerciseChecklist({
  workoutData,
  activeWorkoutId,
  setActiveWorkoutId,
  isChecked,
  toggleCheck,
  isCategoryExpanded,
  toggleCategory,
  onPlayExercise,
  onPlayFull,
  videoRef,
}) {
  const categoryIcons = {
    'hiit-strength': '⚡',
    'upper-body-back': '🏋️',
    'toned-arms': '💪',
    'home-legs': '🦵',
    'core-abs': '🔥',
    'cardio': '🏃',
    'total-body': '🌀',
  };

  return (
    <div className="flex flex-col gap-3">
      {workoutData.map((workout) => {
        const expanded = isCategoryExpanded(workout.id);
        const isActive = activeWorkoutId === workout.id;
        const doneCount = workout.exercises.filter((_, i) => isChecked(workout.id, i)).length;
        const pct = Math.round((doneCount / workout.exercises.length) * 100);

        return (
          <div
            key={workout.id}
            className={`rounded-xl border transition-all duration-200 ${
              isActive
                ? 'border-green-500/50 bg-slate-800/80'
                : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
            }`}
          >
            {/* Accordion header */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              onClick={() => {
                toggleCategory(workout.id);
                setActiveWorkoutId(workout.id);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{categoryIcons[workout.id] || '🏅'}</span>
                <div>
                  <p className={`font-semibold text-sm ${isActive ? 'text-green-400' : 'text-slate-200'}`}>
                    {workout.category}
                  </p>
                  <p className="text-slate-500 text-xs">{workout.source}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-400">{doneCount}/{workout.exercises.length}</p>
                  <div className="w-16 h-1 bg-slate-700 rounded-full mt-1">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Exercise list */}
            {expanded && (
              <div className="border-t border-slate-700/50 px-2 py-2">
                {workout.exercises.map((ex, i) => {
                  const done = isChecked(workout.id, i);
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        done ? 'opacity-50' : 'hover:bg-slate-800/60'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleCheck(workout.id, i)}
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          done
                            ? 'bg-green-500 border-green-500'
                            : 'border-slate-600 hover:border-green-500'
                        }`}
                      >
                        {done && (
                          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Exercise info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {ex.name}
                        </p>
                        <p className="text-xs font-mono text-slate-600">{ex.timestamp}</p>
                      </div>

                      {/* Play clip button */}
                      <button
                        onClick={() => onPlayExercise(workout, ex)}
                        className="flex-shrink-0 flex items-center gap-1 text-[11px] font-semibold text-green-500 hover:text-green-300 hover:bg-green-500/10 px-2 py-1 rounded transition-all"
                        title={`Jump to ${ex.timestamp}`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Play
                      </button>
                    </div>
                  );
                })}

                {/* Play full tutorial */}
                <div className="mt-3 px-2 pb-1">
                  <button
                    onClick={() => onPlayFull(workout)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-green-500/10 border border-slate-700 hover:border-green-500/50 text-slate-300 hover:text-green-400 text-xs font-semibold py-2.5 rounded-lg transition-all duration-200"
                  >
                    🎬 Play Full Tutorial Video
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
