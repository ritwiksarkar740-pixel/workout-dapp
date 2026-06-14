import { useState, useCallback } from 'react';
import { workoutData } from '../data/workoutData';

export function useWorkoutState() {
  const [activeWorkoutId, setActiveWorkoutId] = useState(workoutData[0].id);
  const [videoFile, setVideoFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [checked, setChecked] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({ [workoutData[0].id]: true });
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [logging, setLogging] = useState(false);

  const activeWorkout = workoutData.find(w => w.id === activeWorkoutId);

  const totalExercises = workoutData.reduce((acc, w) => acc + w.exercises.length, 0);
  const completedCount = Object.values(checked).filter(Boolean).length;
  const completionPct = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  const toggleCheck = useCallback((workoutId, exerciseIndex) => {
    const key = `${workoutId}-${exerciseIndex}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isChecked = useCallback((workoutId, exerciseIndex) => {
    return !!checked[`${workoutId}-${exerciseIndex}`];
  }, [checked]);

  const toggleCategory = useCallback((id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const isCategoryExpanded = useCallback((id) => !!expandedCategories[id], [expandedCategories]);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      } catch {
        alert('Wallet connection rejected.');
      }
    } else {
      const mockAddr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setWalletAddress(mockAddr);
      setWalletConnected(true);
    }
  }, []);

  const logOnChain = useCallback(async () => {
    setLogging(true);
    await new Promise(r => setTimeout(r, 2000));
    const hash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setTxHash(hash);
    setLogging(false);
  }, []);

  return {
    workoutData,
    activeWorkoutId,
    setActiveWorkoutId,
    activeWorkout,
    videoFile,
    setVideoFile,
    videoDuration,
    setVideoDuration,
    checked,
    toggleCheck,
    isChecked,
    expandedCategories,
    toggleCategory,
    isCategoryExpanded,
    completionPct,
    completedCount,
    totalExercises,
    walletConnected,
    walletAddress,
    connectWallet,
    txHash,
    logOnChain,
    logging,
  };
}
