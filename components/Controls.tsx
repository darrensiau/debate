import React from 'react';
import { Team } from '../types';

// Icon components defined within the file to avoid extra files
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>;
const PrevIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>;
const NextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M14.47 2.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06L18.19 9.75H9a6.75 6.75 0 0 0 0 13.5h3a.75.75 0 0 1 0 1.5H9a8.25 8.25 0 0 1 0-16.5h9.19l-4.72-4.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>;

interface ControlsProps {
  isActive: boolean;
  isFinished: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStage: boolean;
  isLastStage: boolean;
  isMultiStage?: boolean;
  team?: Team;
}

const Controls: React.FC<ControlsProps> = ({
  isActive, isFinished, onStartPause, onReset, onNext, onPrev, isFirstStage, isLastStage, isMultiStage = false, team
}) => {
  const baseButtonClass = "flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-40 disabled:cursor-not-allowed";
  
  const getPrimaryButtonColor = (team?: Team): string => {
    switch (team) {
      case 'A': return 'bg-sky-600 text-white hover:bg-sky-500 focus:ring-sky-500';
      case 'B': return 'bg-lime-600 text-white hover:bg-lime-500 focus:ring-lime-500';
      case 'C': return 'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500';
      default: return 'bg-sky-600 text-white hover:bg-sky-500 focus:ring-sky-500';
    }
  };

  const primaryButtonClass = getPrimaryButtonColor(team);
  const secondaryButtonClass = "bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500";
  const finishedButtonClass = "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500";

  let startPauseButtonClass = isActive ? secondaryButtonClass : primaryButtonClass;
  if(isFinished) startPauseButtonClass = finishedButtonClass;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-4 mt-6">
      {/* Left side: Prev Button */}
      <div className="w-full sm:w-auto sm:flex-1 flex justify-center sm:justify-end">
        <button onClick={onPrev} disabled={isFirstStage || isActive} className={`${baseButtonClass} ${secondaryButtonClass}`}>
          <PrevIcon /> Prev
        </button>
      </div>

      {/* Center: Start/Pause Button or placeholder */}
      <div className="flex-shrink-0">
        {isMultiStage ? (
          <div className={`${baseButtonClass} w-full sm:w-56 text-xl invisible`} aria-hidden="true">&nbsp;</div>
        ) : (
          <button onClick={onStartPause} className={`${baseButtonClass} w-full sm:w-56 text-xl ${startPauseButtonClass}`}>
              {isFinished ? (
                  <> <ResetIcon /> Reset Stage </>
              ) : isActive ? (
                  <> <PauseIcon /> Pause </>
              ) : (
                  <> <PlayIcon /> Start </>
              )}
          </button>
        )}
      </div>

      {/* Right side: Next and Reset Buttons */}
      <div className="w-full sm:w-auto sm:flex-1 flex justify-center sm:justify-start items-center gap-4">
        <button onClick={onNext} disabled={(isLastStage && !isFinished) || isActive} className={`${baseButtonClass} ${secondaryButtonClass}`}>
          Next <NextIcon />
        </button>

        <button
          onClick={onReset}
          disabled={isActive}
          aria-label="Reset stage timer"
          className="hidden sm:flex items-center justify-center p-4 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ResetIcon />
        </button>
      </div>
    </div>
  );
};

export default Controls;
