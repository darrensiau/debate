import React from 'react';
import { Team } from '../types';

interface ProgressBarProps {
    current: number;
    total: number;
    team?: Team;
}

const getTeamBgClass = (team?: Team): string => {
    switch (team) {
        case 'A': return 'bg-sky-500';
        case 'B': return 'bg-lime-500';
        case 'C': return 'bg-rose-500';
        default: return 'bg-slate-500';
    }
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, team }) => {
    const percentage = total > 1 ? (current / (total - 1)) * 100 : 0;
    const teamBgClass = getTeamBgClass(team);

    return (
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
                className={`${teamBgClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;