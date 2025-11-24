import React, { useState, useEffect } from 'react';

interface TimerDisplayProps {
  seconds: number;
  isLow: boolean;
  isFinished: boolean;
  isActive: boolean;
  onTimeChange: (newSeconds: number) => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, isLow, isFinished, isActive, onTimeChange }) => {
  const [minutesInput, setMinutesInput] = useState('00');
  const [secondsInput, setSecondsInput] = useState('00');

  useEffect(() => {
    const localSeconds = (parseInt(minutesInput, 10) || 0) * 60 + (parseInt(secondsInput, 10) || 0);
    
    // Only update from parent if the external `seconds` prop is different 
    // from what our internal state represents. This avoids an update loop while typing.
    if (seconds !== localSeconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        setMinutesInput(String(m).padStart(2, '0'));
        setSecondsInput(String(s).padStart(2, '0'));
    }
  }, [seconds, minutesInput, secondsInput]);


  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinutesInput(value);
    const newMinutes = parseInt(value, 10) || 0;
    const currentSeconds = parseInt(secondsInput, 10) || 0;
    onTimeChange(newMinutes * 60 + currentSeconds);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSecondsInput(value);
    const newSeconds = parseInt(value, 10) || 0;
    const currentMinutes = parseInt(minutesInput, 10) || 0;
    onTimeChange(currentMinutes * 60 + newSeconds);
  };

  const handleInputBlur = () => {
    let mins = parseInt(minutesInput, 10) || 0;
    let secs = parseInt(secondsInput, 10) || 0;

    mins = Math.max(0, mins);
    secs = Math.max(0, Math.min(59, secs));

    setMinutesInput(String(mins).padStart(2, '0'));
    setSecondsInput(String(secs).padStart(2, '0'));
    
    onTimeChange(mins * 60 + secs);
  };


  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const colorClass = isFinished
    ? 'text-slate-500'
    : isLow
    ? 'text-red-500'
    : 'text-white';

  const baseInputClass = "bg-transparent text-center outline-none focus:bg-slate-800/80 rounded-lg p-1 transition-colors duration-200";

  return (
    <div className="flex items-center justify-center my-10 md:my-16">
      {isActive ? (
        <p className={`font-mono text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter transition-colors duration-300 ${colorClass}`}>
          {formatTime(seconds)}
        </p>
      ) : (
        <div className={`font-mono text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter ${colorClass} flex items-center`}>
          <input
            type="number"
            value={minutesInput}
            onChange={handleMinutesChange}
            onBlur={handleInputBlur}
            className={`${baseInputClass} w-[2.1ch] text-right`}
            aria-label="Editable minutes"
          />
          <span className="mx-1 sm:mx-2 select-none">:</span>
          <input
            type="number"
            value={secondsInput}
            onChange={handleSecondsChange}
            onBlur={handleInputBlur}
            className={`${baseInputClass} w-[2.1ch] text-left`}
            aria-label="Editable seconds"
          />
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
