
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Team } from '../types';

interface StageListProps {
  stages: Stage[];
  currentStageIndex: number;
  onStageSelect: (index: number) => void;
  debateFormats: string[];
  currentDebateType: string;
  onDebateTypeChange: (type: string) => void;
}

const getTeamClasses = (team: Team | undefined, isActive: boolean): string => {
  if (isActive) {
    switch (team) {
      case 'A': return 'bg-sky-500/20 border-sky-500';
      case 'B': return 'bg-lime-500/20 border-lime-500';
      case 'C': return 'bg-rose-500/20 border-rose-500';
      default: return 'bg-slate-500/20 border-slate-500';
    }
  }
  return 'bg-slate-800 border-transparent hover:bg-slate-700/50';
};

const getTeamTextClass = (team: Team | undefined): string => {
  switch (team) {
    case 'A': return 'text-sky-400';
    case 'B': return 'text-lime-400';
    case 'C': return 'text-rose-400';
    default: return 'text-slate-400';
  }
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

const StageList: React.FC<StageListProps> = ({ stages, currentStageIndex, onStageSelect, debateFormats, currentDebateType, onDebateTypeChange }) => {
  const activeItemRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentStageIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-full max-h-[80vh] lg:max-h-[calc(100vh-16rem)] flex flex-col">
        <div className="p-4 sticky top-0 bg-slate-800/50 backdrop-blur-sm z-10">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="w-full flex items-center justify-between text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span className="text-xl font-bold text-white">{currentDebateType}</span>
              <svg className={`w-6 h-6 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-700 rounded-lg shadow-lg z-20 border border-slate-600 p-1.5">
                {debateFormats.map(format => (
                  <button
                    key={format}
                    onClick={() => {
                      onDebateTypeChange(format);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base rounded-md hover:bg-sky-600 hover:text-white transition-colors duration-200"
                    role="menuitem"
                  >
                    {format}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-y-auto flex-grow p-2">
        {stages.map((stage, index) => {
            const isActive = index === currentStageIndex;
            const isMulti = stage.type === 'multi';

            const team = isMulti ? undefined : stage.team;
            const debaterText = isMulti ? stage.participants.map(p => p.debater.replace('Team ','')).join(' / ') : stage.debater;
            const duration = isMulti ? stage.participants[0].duration : stage.duration;

            return (
            <div
                key={index}
                ref={isActive ? activeItemRef : null}
                onClick={() => onStageSelect(index)}
                className={`flex justify-between items-center p-3 my-1.5 rounded-lg border-l-4 transition-all duration-300 cursor-pointer ${getTeamClasses(team, isActive)}`}
            >
                <div className="flex-1">
                <p className={`font-bold text-lg ${isActive ? 'text-white' : 'text-slate-300'} ${getTeamTextClass(team)}`}>
                    {debaterText}
                </p>
                <p className="text-base text-slate-400">{stage.stage}</p>
                </div>
                <div className="font-mono text-slate-300 text-right">
                {formatDuration(duration)}
                {isMulti && <span className="text-xs"> x{stage.participants.length}</span>}
                </div>
            </div>
            );
        })}
        </div>
    </div>
  );
};

export default StageList;
