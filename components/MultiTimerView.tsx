import React, { useState, useEffect } from 'react';
import { MultiStage, MultiStageParticipant, Team } from '../types';

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>;

const getTeamColor = (team: Team): string => {
    switch (team) {
      case 'A': return 'text-sky-400 border-sky-500';
      case 'B': return 'text-lime-400 border-lime-500';
      case 'C': return 'text-rose-400 border-rose-500';
      default: return 'text-slate-400 border-slate-500';
    }
};

const getTeamButtonColor = (team: Team): string => {
    switch (team) {
        case 'A': return 'bg-sky-600 hover:bg-sky-500 focus:ring-sky-500';
        case 'B': return 'bg-lime-600 hover:bg-lime-500 focus:ring-lime-500';
        case 'C': return 'bg-rose-600 hover:bg-rose-500 focus:ring-rose-500';
        default: return 'bg-slate-600 hover:bg-slate-500 focus:ring-slate-500';
    }
};

const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

interface TimerItemProps {
  participant: MultiStageParticipant;
  timeLeft: number;
  isActive: boolean;
  onTimerToggle: () => void;
  onTimeChange: (newSeconds: number) => void;
}

const TimerItem: React.FC<TimerItemProps> = ({ participant, timeLeft, isActive, onTimerToggle, onTimeChange }) => {
  const { debater, team } = participant;
  const [minutesInput, setMinutesInput] = useState('00');
  const [secondsInput, setSecondsInput] = useState('00');
  const isFinished = timeLeft === 0;
  const isLow = timeLeft <= 30 && timeLeft > 0;

  useEffect(() => {
    const localSeconds = (parseInt(minutesInput, 10) || 0) * 60 + (parseInt(secondsInput, 10) || 0);
    if (timeLeft !== localSeconds) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      setMinutesInput(String(m).padStart(2, '0'));
      setSecondsInput(String(s).padStart(2, '0'));
    }
  }, [timeLeft, minutesInput, secondsInput]);

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

  const teamColorClass = getTeamColor(team);
  const buttonColorClass = getTeamButtonColor(team);
  const baseInputClass = "bg-transparent text-center outline-none focus:bg-slate-800/80 rounded-lg p-1 transition-colors duration-200";
  const timeColorClass = isFinished ? 'text-slate-500' : isLow ? 'text-red-500' : 'text-white';

  return (
    <div className={`w-full md:w-80 flex flex-col items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${isActive ? teamColorClass : 'border-slate-700'} ${isFinished ? 'opacity-50' : ''}`}>
      <div className="text-center">
        <p className={`text-3xl md:text-4xl font-bold ${teamColorClass.split(' ')[0]}`}>{debater}</p>
        {isActive ? (
          <p className={`font-mono text-[3.5rem] leading-none font-bold mt-2 ${timeColorClass}`}>
            {formatTime(timeLeft)}
          </p>
        ) : (
          <div className={`font-mono text-[3.5rem] leading-none font-bold mt-2 ${timeColorClass} flex items-center justify-center`}>
            <input
              type="number"
              value={minutesInput}
              onChange={handleMinutesChange}
              onBlur={handleInputBlur}
              className={`${baseInputClass} w-[2.1ch] text-right`}
              aria-label={`Editable minutes for ${debater}`}
            />
            <span className="mx-1 select-none">:</span>
            <input
              type="number"
              value={secondsInput}
              onChange={handleSecondsChange}
              onBlur={handleInputBlur}
              className={`${baseInputClass} w-[2.1ch] text-left`}
              aria-label={`Editable seconds for ${debater}`}
            />
          </div>
        )}
      </div>
      <button
        onClick={onTimerToggle}
        disabled={isFinished && !isActive}
        className={`flex items-center justify-center gap-2 w-full px-6 py-4 text-lg font-semibold rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-40 disabled:cursor-not-allowed ${isActive ? 'bg-slate-600 hover:bg-slate-500' : buttonColorClass}`}
      >
        {isActive ? <><PauseIcon /> Pause</> : <><PlayIcon /> Start</>}
      </button>
    </div>
  );
};

interface MultiTimerViewProps {
  stage: MultiStage;
  timers: { [debater: string]: { timeLeft: number } };
  activeTimer: string | null;
  onTimerToggle: (debater: string) => void;
  onTimeChange: (debater: string, newSeconds: number) => void;
}

const MultiTimerView: React.FC<MultiTimerViewProps> = ({ stage, timers, activeTimer, onTimerToggle, onTimeChange }) => {
  const allTimersFinished = stage.participants.every(p => timers[p.debater]?.timeLeft === 0);

  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="text-center p-4 rounded-lg mb-6 border border-slate-700">
        <p className="text-3xl md:text-4xl font-bold tracking-wide text-slate-100">
          {stage.stage}
        </p>
        {allTimersFinished && (
            <p className="text-xl md:text-2xl text-slate-300">
                All timers finished
            </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-6 my-4 md:my-6">
        {stage.participants.map((participant) => (
          <TimerItem
            key={participant.debater}
            participant={participant}
            timeLeft={timers[participant.debater]?.timeLeft ?? participant.duration}
            isActive={activeTimer === participant.debater}
            onTimerToggle={() => onTimerToggle(participant.debater)}
            onTimeChange={(newSeconds) => onTimeChange(participant.debater, newSeconds)}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiTimerView;