
export type Team = 'A' | 'B' | 'C';

export interface SingleStage {
  type: 'single';
  debater: string;
  stage: string;
  duration: number; // in seconds
  team: Team;
}

export interface MultiStageParticipant {
  debater: string;
  team: Team;
  duration: number;
}

export interface MultiStage {
  type: 'multi';
  stage: string;
  participants: MultiStageParticipant[];
}

export type Stage = SingleStage | MultiStage;

export interface DebateFormat {
  name: string;
  stages: Stage[];
}

export type StageTimeState = number | { [debater: string]: number };
