
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DEBATE_FORMATS } from './constants';
import { Stage, Team, StageTimeState } from './types';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import StageList from './components/StageList';
import ProgressBar from './components/ProgressBar';
import MultiTimerView from './components/MultiTimerView';

const getTeamColor = (team: Team): string => {
  switch (team) {
    case 'A': return 'text-sky-400';
    case 'B': return 'text-lime-400';
    case 'C': return 'text-rose-400';
    default: return 'text-slate-400';
  }
};

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
);

const FullScreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);

const ExitFullScreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
  </svg>
);

const initializeTimeStates = (stages: Stage[]): StageTimeState[] => {
    return stages.map(stage => {
        if (stage.type === 'single') {
            return stage.duration;
        } else {
            return stage.participants.reduce((acc, p) => {
                acc[p.debater] = p.duration;
                return acc;
            }, {} as { [debater: string]: number });
        }
    });
};

const App: React.FC = () => {
  const [debateType, setDebateType] = useState<string | null>(null);
  
  const DEBATE_STAGES = debateType ? DEBATE_FORMATS[debateType].stages : [];

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stageTimeStates, setStageTimeStates] = useState<StageTimeState[]>([]);
  const [activeMultiTimer, setActiveMultiTimer] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (debateType) {
        const stages = DEBATE_FORMATS[debateType].stages;
        setCurrentStageIndex(0);
        setIsActive(false);
        setActiveMultiTimer(null);
        setIsFinished(false);
        setStageTimeStates(initializeTimeStates(stages));
    }
  }, [debateType]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleDebateTypeChange = useCallback((newType: string) => {
    if (newType !== debateType) {
        setDebateType(newType);
    }
    setIsScheduleVisible(false);
  }, [debateType]);

  const handleToggleSchedule = useCallback(() => setIsScheduleVisible(prev => !prev), []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  }, []);

  const playDing = useCallback((startTime?: number) => {
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const context = audioContextRef.current;
    if (context.state === 'suspended') context.resume();
    
    const time = startTime || context.currentTime;
    // Increased pitch: 1760Hz is a high A6 (much higher than previous 987Hz)
    const fundamental = 1760; 
    const overtones = [2, 3, 4.1, 5.42];
    const volumes = [0.5, 0.3, 0.1, 0.2, 0.1]; // Slightly boosted relative volumes
    const decay = 1.5;

    const masterGain = context.createGain();
    // Increased volume: 1.2 is much louder (previously 0.3)
    masterGain.gain.setValueAtTime(1.2, time); 
    masterGain.connect(context.destination);

    const playOscillator = (freq: number, vol: number, type: OscillatorType = 'sine') => {
        const osc = context.createOscillator();
        const gainNode = context.createGain();
        osc.connect(gainNode);
        gainNode.connect(masterGain);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);
        gainNode.gain.setValueAtTime(vol, time);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, time + decay);
        osc.start(time);
        osc.stop(time + decay + 0.1);
    };
    
    // Use 'triangle' wave for the fundamental to make the tone sharper and brighter
    playOscillator(fundamental, volumes[0], 'triangle');
    overtones.forEach((ratio, i) => playOscillator(fundamental * ratio, volumes[i + 1], 'sine'));
  }, []);

  const playEndSound = useCallback(() => {
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const context = audioContextRef.current;
    playDing(context.currentTime);
    playDing(context.currentTime + 0.4);
  }, [playDing]);

  const playWarningSound = useCallback(() => playDing(), [playDing]);

  const executeReset = useCallback(() => {
    setIsActive(false);
    setActiveMultiTimer(null);
    setIsFinished(false);

    const currentStage = DEBATE_STAGES[currentStageIndex];
    if (!currentStage) return;

    const newTimeStateForCurrentStage = currentStage.type === 'single'
      ? currentStage.duration
      : currentStage.participants.reduce((acc, p) => {
          acc[p.debater] = p.duration;
          return acc;
        }, {} as { [debater: string]: number });

    setStageTimeStates(prevStates => {
      const newStates = [...prevStates];
      newStates[currentStageIndex] = newTimeStateForCurrentStage;
      return newStates;
    });
    setShowResetConfirm(false);
  }, [currentStageIndex, DEBATE_STAGES]);

  const handleResetClick = useCallback(() => {
    setShowResetConfirm(true);
  }, []);
  
  const cancelReset = useCallback(() => {
    setShowResetConfirm(false);
  }, []);

  useEffect(() => {
    let interval: number | null = null;
    if (!debateType || !DEBATE_STAGES[currentStageIndex]) return;

    const currentStage = DEBATE_STAGES[currentStageIndex];
    const currentTimeState = stageTimeStates[currentStageIndex];

    if (currentStage.type === 'single' && typeof currentTimeState === 'number') {
      if (isActive && currentTimeState === 30) playWarningSound();
      if (isActive && currentTimeState > 0) {
        interval = window.setInterval(() => {
          setStageTimeStates(prevStates => {
            const newStates = [...prevStates];
            newStates[currentStageIndex] = (newStates[currentStageIndex] as number) - 1;
            return newStates;
          });
        }, 1000);
      } else if (currentTimeState === 0 && isActive) {
        setIsActive(false);
        playEndSound();
        if (currentStageIndex === DEBATE_STAGES.length - 1) setIsFinished(true);
      }
    } else if (currentStage.type === 'multi' && typeof currentTimeState === 'object') {
      if (activeMultiTimer) {
        const debaterTimeLeft = currentTimeState[activeMultiTimer];
        if (debaterTimeLeft === 30) playWarningSound();
        if (debaterTimeLeft > 0) {
          interval = window.setInterval(() => {
            setStageTimeStates(prevStates => {
                const newStates = [...prevStates];
                const currentMultiState = { ...(newStates[currentStageIndex] as { [key: string]: number }) };
                currentMultiState[activeMultiTimer] -= 1;
                newStates[currentStageIndex] = currentMultiState;
                return newStates;
            });
          }, 1000);
        } else if (debaterTimeLeft === 0) {
          setActiveMultiTimer(null);
          playEndSound();
        }
      }
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, stageTimeStates, currentStageIndex, playEndSound, playWarningSound, activeMultiTimer, DEBATE_STAGES, debateType]);


  const handleStartPause = useCallback(() => {
    if (isFinished) {
      handleResetClick();
      return;
    }
    
    // Resume audio context if suspended (browser policy fix)
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }

    if (!isActive) {
      setIsScheduleVisible(false);
    }
    setIsActive(prev => !prev);
  }, [isFinished, handleResetClick, isActive]);

  const handleMultiTimerToggle = useCallback((debater: string) => {
    // Resume audio context if suspended (browser policy fix)
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }

    if (activeMultiTimer === debater) {
      setActiveMultiTimer(null);
    } else {
      const currentTimeState = stageTimeStates[currentStageIndex] as { [debater: string]: number };
      if (currentTimeState[debater] > 0) {
        setIsScheduleVisible(false);
        setActiveMultiTimer(debater);
      }
    }
  }, [activeMultiTimer, stageTimeStates, currentStageIndex]);

  const handleMultiTimerTimeChange = useCallback((debater: string, newTimeInSeconds: number) => {
    setStageTimeStates(prev => {
        const newStates = [...prev];
        const currentMultiState = { ...(newStates[currentStageIndex] as { [key: string]: number }) };
        currentMultiState[debater] = Math.max(0, newTimeInSeconds);
        newStates[currentStageIndex] = currentMultiState;
        return newStates;
    });
  }, [currentStageIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!debateType || document.activeElement?.tagName.toLowerCase() === 'input') return;
      if (event.code === 'Space') {
        event.preventDefault();
        const stage = DEBATE_STAGES[currentStageIndex];
        if (stage && stage.type === 'single') handleStartPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStartPause, currentStageIndex, DEBATE_STAGES, debateType]);

  const changeStage = useCallback((direction: 'next' | 'prev') => {
    setIsActive(false);
    setActiveMultiTimer(null);
    const newIndex = direction === 'next'
      ? Math.min(currentStageIndex + 1, DEBATE_STAGES.length - 1)
      : Math.max(currentStageIndex - 1, 0);
    setCurrentStageIndex(newIndex);
    setIsFinished(false);
  }, [currentStageIndex, DEBATE_STAGES.length]);
  
  const handleNextStage = useCallback(() => changeStage('next'), [changeStage]);
  const handlePrevStage = useCallback(() => changeStage('prev'), [changeStage]);

  const handleStageSelect = useCallback((index: number) => {
    if (index === currentStageIndex) return;
    setIsActive(false);
    setActiveMultiTimer(null);
    setCurrentStageIndex(index);
    setIsFinished(false);
    setIsScheduleVisible(false);
  }, [currentStageIndex]);

  const handleTimeChange = useCallback((newTimeInSeconds: number) => {
    if (!isActive) {
        setStageTimeStates(prev => {
            const newStates = [...prev];
            newStates[currentStageIndex] = Math.max(0, newTimeInSeconds);
            return newStates;
        });
    }
  }, [isActive, currentStageIndex]);

  if (!debateType) {
    return (
      <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center py-8 px-4 font-sans">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">TAR UMT SCM Debating Championship</h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12">Please select a debate format to begin.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(DEBATE_FORMATS).map(key => (
              <button
                key={key}
                onClick={() => setDebateType(key)}
                className="p-6 bg-slate-800 rounded-lg text-white font-semibold text-xl border border-slate-700 hover:bg-sky-600 hover:border-sky-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
              >
                {DEBATE_FORMATS[key].name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentStage: Stage | undefined = DEBATE_STAGES[currentStageIndex];
  
  if (!currentStage) {
    return (
        <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center">
            <p className="text-xl text-slate-400">Loading debate format...</p>
        </div>
    );
  }

  const teamColorClass = currentStage.type === 'single' ? getTeamColor(currentStage.team) : 'text-slate-400';
  const teamForProgressBar = currentStage.type === 'single' ? currentStage.team : undefined;
  
  const currentTimeState = stageTimeStates[currentStageIndex];
  const timeLeft = currentStage.type === 'single' ? (currentTimeState as number) : 0;
  const multiTimerState = currentStage.type === 'multi'
    ? Object.fromEntries(
        Object.entries(currentTimeState as { [debater: string]: number } || {})
          .map(([debater, timeLeft]) => [debater, { timeLeft }])
      )
    : {};

  return (
    <div className="min-h-screen text-slate-100 flex flex-col items-center py-8 px-4 font-sans">
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out" aria-modal="true" role="dialog">
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700 w-full max-w-xs text-center">
            <p className="text-xl font-semibold text-white mb-6">Confirm reset?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={cancelReset} 
                className="flex-1 px-5 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500"
              >
                No
              </button>
              <button 
                onClick={executeReset}
                className="flex-1 px-5 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto flex flex-col flex-grow">
        <div className="absolute top-6 right-6 z-20 flex gap-2">
            <button 
                onClick={toggleFullScreen}
                title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
                aria-label={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
                className="p-3 text-slate-400 rounded-lg hover:bg-slate-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-200"
            >
                {isFullscreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
            </button>
            <button onClick={handleToggleSchedule} title={isScheduleVisible ? "Hide Schedule" : "Show Schedule"} aria-label={isScheduleVisible ? "Hide Schedule" : "Show Schedule"} className="p-3 text-slate-400 rounded-lg hover:bg-slate-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-200">
              <MenuIcon />
            </button>
        </div>

        <main className={`grid grid-cols-1 ${isScheduleVisible ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8 transition-all duration-300 ease-in-out flex-grow`}>
          <div className={`bg-slate-800/50 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between backdrop-blur-sm border border-slate-700 ${isScheduleVisible ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            {currentStage.type === 'multi' ? (
                <MultiTimerView 
                    stage={currentStage}
                    timers={multiTimerState}
                    activeTimer={activeMultiTimer}
                    onTimerToggle={handleMultiTimerToggle}
                    onTimeChange={handleMultiTimerTimeChange}
                />
            ) : (
                <div className="flex flex-col flex-grow justify-center">
                    <div>
                        <div className={`text-center p-4 rounded-lg mb-6 border border-slate-700`}>
                            <p className={`text-4xl md:text-5xl font-bold tracking-wide ${teamColorClass}`}>{currentStage.debater}</p>
                            <p className="text-2xl md:text-3xl text-slate-300">{currentStage.stage}</p>
                        </div>
                        <TimerDisplay seconds={timeLeft} isLow={timeLeft <= 30 && timeLeft > 0} isFinished={timeLeft === 0} isActive={isActive} onTimeChange={handleTimeChange} />
                    </div>
                </div>
            )}
            <Controls isActive={isActive || !!activeMultiTimer} isFinished={isFinished} onStartPause={handleStartPause} onReset={handleResetClick} onNext={handleNextStage} onPrev={handlePrevStage} isFirstStage={currentStageIndex === 0} isLastStage={currentStageIndex === DEBATE_STAGES.length - 1} isMultiStage={currentStage.type === 'multi'} team={teamForProgressBar} />
          </div>

          {isScheduleVisible && (
            <div className="bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700 p-2">
              <StageList
                stages={DEBATE_STAGES}
                currentStageIndex={currentStageIndex}
                onStageSelect={handleStageSelect}
                debateFormats={Object.keys(DEBATE_FORMATS)}
                currentDebateType={debateType}
                onDebateTypeChange={handleDebateTypeChange}
              />
            </div>
          )}
        </main>

        <footer className="w-full mt-auto pt-8">
            <ProgressBar current={currentStageIndex} total={DEBATE_STAGES.length} team={teamForProgressBar} />
            <p className="text-center text-slate-400 text-lg mt-4 font-semibold">{debateType}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
