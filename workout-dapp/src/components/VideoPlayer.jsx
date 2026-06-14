import { useRef, useState, useEffect, useCallback } from 'react';

function getVideoUrl(localPath) {
  const filename = localPath.split('/').pop();
  return `https://pub-d0ef339ae4b3450f936c79a3e1f4b6e7.r2.dev/${filename}`;
}

export default function VideoPlayer({ workout, onDurationLoad, videoRef, onSeek }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  const videoUrl = getVideoUrl(workout.localPath);

  // Reset state when workout changes
  useEffect(() => {
    setVideoError(false);
    setLoading(true);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [workout.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => setCurrentTime(video.currentTime);
    const onDur = () => {
      setDuration(video.duration);
      setLoading(false);
      onDurationLoad(video.duration);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => { setVideoError(true); setLoading(false); };
    const onCanPlay = () => setLoading(false);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('loadedmetadata', onDur);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);
    video.addEventListener('canplay', onCanPlay);
    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('loadedmetadata', onDur);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
      video.removeEventListener('canplay', onCanPlay);
    };
  }, [videoRef, onDurationLoad, workout.id]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    isPlaying ? v.pause() : v.play();
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const seekTo = useCallback((clientX) => {
    if (!trackRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const t = pct * duration;
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  }, [duration, videoRef]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) seekTo(e.clientX);
  }, [isDragging, seekTo]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const pitStops = workout.exercises.map((ex) => ({
    ...ex,
    pct: duration > 0 ? (ex.seconds / duration) * 100 : null,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Video area */}
      <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
        {videoError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            <svg className="w-12 h-12 text-red-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-slate-400 text-sm font-medium text-center">Could not load video</p>
            <p className="text-slate-600 text-xs text-center font-mono">Make sure video is in:</p>
            <code className="bg-slate-800 text-green-400 text-xs px-3 py-2 rounded-lg">
              public/videos/{workout.localPath.split('/').pop()}
            </code>
          </div>
        ) : (
          <>
            <video
              key={workout.id}
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              preload="metadata"
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-8 h-8 text-green-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <p className="text-slate-400 text-xs">Loading video…</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom controls */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
        <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Timeline track */}
        <div
          ref={trackRef}
          className="relative h-2 bg-slate-700 rounded-full cursor-pointer mb-4"
          onClick={(e) => seekTo(e.clientX)}
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all" style={{ width: `${progress}%` }} />

          {/* Pit stop nodes */}
          {pitStops.map((ex, i) => ex.pct !== null && (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
              style={{ left: `${ex.pct}%` }}
              onMouseEnter={() => setTooltip(ex)}
              onMouseLeave={() => setTooltip(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) {
                  videoRef.current.currentTime = ex.seconds;
                  videoRef.current.play();
                }
                onSeek(ex.seconds);
              }}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-green-400 cursor-pointer transition-all duration-150 ${
                currentTime >= ex.seconds ? 'bg-green-400' : 'bg-slate-900'
              } hover:scale-150 hover:bg-green-400`} />
              {tooltip === ex && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur border border-green-500/40 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  <p className="text-green-400 font-mono text-[10px] mb-0.5">{ex.timestamp}</p>
                  <p className="font-medium">{ex.name}</p>
                </div>
              )}
            </div>
          ))}

          {/* Scrub head */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-green-400 shadow z-20 cursor-grab active:cursor-grabbing"
            style={{ left: `${progress}%` }}
            onMouseDown={() => setIsDragging(true)}
          />
        </div>

        {/* Playback buttons */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, currentTime - 10); }} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
          </button>
          <button onClick={togglePlay} disabled={videoError || loading} className="w-11 h-11 rounded-full bg-green-500 hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
            {isPlaying ? (
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.min(duration, currentTime + 10); }} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
