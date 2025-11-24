
import { Stage, DebateFormat } from './types';

export const DEBATE_FORMATS: { [key: string]: DebateFormat } = {
  'Type A (4 v 4)': {
    name: 'Type A (4 v 4)',
    stages: [
      { type: 'single', debater: 'A1', stage: 'Opening Argument', duration: 4 * 60, team: 'A' },
      { type: 'single', debater: 'B1', stage: 'Opening Argument', duration: 4 * 60, team: 'B' },
      { type: 'single', debater: 'A2', stage: 'Questioning (on B2)', duration: 2 * 60, team: 'A' },
      { type: 'single', debater: 'B2', stage: 'Questioning (on A2)', duration: 2 * 60, team: 'B' },
      {
        type: 'multi',
        stage: 'Attack and Defend',
        participants: [
          { debater: 'A3', team: 'A', duration: 2 * 60 },
          { debater: 'B3', team: 'B', duration: 2 * 60 },
        ],
      },
      {
        type: 'multi',
        stage: 'Group Attack and Defend',
        participants: [
          { debater: 'Team A', team: 'A', duration: 5 * 60 },
          { debater: 'Team B', team: 'B', duration: 5 * 60 },
        ],
      },
      { type: 'single', debater: 'A4', stage: 'Conclude', duration: 4 * 60, team: 'A' },
      { type: 'single', debater: 'B4', stage: 'Conclude', duration: 4 * 60, team: 'B' },
    ]
  },
  'Type B (4 v 4 v 4)': {
    name: 'Type B (4 v 4 v 4)',
    stages: [
      { type: 'single', debater: 'A1', stage: 'Opening Argument', duration: 4 * 60, team: 'A' },
      { type: 'single', debater: 'B1', stage: 'Opening Argument', duration: 4 * 60, team: 'B' },
      { type: 'single', debater: 'C1', stage: 'Opening Argument', duration: 4 * 60, team: 'C' },
      { type: 'single', debater: 'A2', stage: 'Questioning (on B2)', duration: 2 * 60, team: 'A' },
      { type: 'single', debater: 'B2', stage: 'Questioning (on C2)', duration: 2 * 60, team: 'B' },
      { type: 'single', debater: 'C2', stage: 'Questioning (on A2)', duration: 2 * 60, team: 'C' },
      {
        type: 'multi',
        stage: 'Attack and Defend',
        participants: [
          { debater: 'A3', team: 'A', duration: 2 * 60 },
          { debater: 'B3', team: 'B', duration: 2 * 60 },
          { debater: 'C3', team: 'C', duration: 2 * 60 },
        ],
      },
      {
        type: 'multi',
        stage: 'Group Attack and Defend',
        participants: [
          { debater: 'Team A', team: 'A', duration: 5 * 60 },
          { debater: 'Team B', team: 'B', duration: 5 * 60 },
          { debater: 'Team C', team: 'C', duration: 5 * 60 },
        ],
      },
      { type: 'single', debater: 'A4', stage: 'Conclude', duration: 4 * 60, team: 'A' },
      { type: 'single', debater: 'B4', stage: 'Conclude', duration: 4 * 60, team: 'B' },
      { type: 'single', debater: 'C4', stage: 'Conclude', duration: 4 * 60, team: 'C' },
    ]
  },
  'Type C (5 v 5)': {
    name: 'Type C (5 v 5)',
    stages: [
      { type: 'single', debater: 'A1', stage: 'Opening Argument', duration: 4 * 60, team: 'A' },
      { type: 'single', debater: 'B1', stage: 'Opening Argument', duration: 4 * 60, team: 'B' },
      { type: 'single', debater: 'B2', stage: 'Rebut', duration: 2 * 60, team: 'B' },
      { type: 'single', debater: 'A2', stage: 'Rebut', duration: 2 * 60, team: 'A' },
      { type: 'single', debater: 'A3', stage: 'Questioning (on B3)', duration: 2 * 60, team: 'A' },
      { type: 'single', debater: 'B3', stage: 'Questioning (on A3)', duration: 2 * 60, team: 'B' },
      {
        type: 'multi',
        stage: 'Attack and Defend',
        participants: [
          { debater: 'A4', team: 'A', duration: 2 * 60 },
          { debater: 'B4', team: 'B', duration: 2 * 60 },
        ],
      },
      {
        type: 'multi',
        stage: 'Group Attack and Defend',
        participants: [
          { debater: 'Team A', team: 'A', duration: 5 * 60 },
          { debater: 'Team B', team: 'B', duration: 5 * 60 },
        ],
      },
      { type: 'single', debater: 'A5', stage: 'Conclude', duration: 4 * 60, team: 'A' },
      { type: 'single', debater: 'B5', stage: 'Conclude', duration: 4 * 60, team: 'B' },
    ]
  },
  'Type D (5 v 5 v 5)': {
    name: 'Type D (5 v 5 v 5)',
    stages: [
      { type: 'single', debater: 'A1', stage: 'Opening Argument', duration: 4 * 60, team: 'A' },
      { type: 'single', debater: 'B1', stage: 'Opening Argument', duration: 4 * 60, team: 'B' },
      { type: 'single', debater: 'C1', stage: 'Opening Argument', duration: 4 * 60, team: 'C' },
      { type: 'single', debater: 'C2', stage: 'Rebut', duration: 2 * 60, team: 'C' },
      { type: 'single', debater: 'B2', stage: 'Rebut', duration: 2 * 60, team: 'B' },
      { type: 'single', debater: 'A2', stage: 'Rebut', duration: 2 * 60, team: 'A' },
      { type: 'single', debater: 'A3', stage: 'Questioning (on B3)', duration: 2 * 60, team: 'A' },
      { type: 'single', debater: 'B3', stage: 'Questioning (on C3)', duration: 2 * 60, team: 'B' },
      { type: 'single', debater: 'C3', stage: 'Questioning (on A3)', duration: 2 * 60, team: 'C' },
      {
        type: 'multi',
        stage: 'Attack and Defend',
        participants: [
          { debater: 'A4', team: 'A', duration: 2 * 60 },
          { debater: 'B4', team: 'B', duration: 2 * 60 },
          { debater: 'C4', team: 'C', duration: 2 * 60 },
        ],
      },
      {
        type: 'multi',
        stage: 'Group Attack and Defend',
        participants: [
          { debater: 'Team A', team: 'A', duration: 5 * 60 },
          { debater: 'Team B', team: 'B', duration: 5 * 60 },
          { debater: 'Team C', team: 'C', duration: 5 * 60 },
        ],
      },
      { type: 'single', debater: 'A5', stage: 'Conclude', duration: 4 * 60, team: 'A' },
      { type: 'single', debater: 'B5', stage: 'Conclude', duration: 4 * 60, team: 'B' },
      { type: 'single', debater: 'C5', stage: 'Conclude', duration: 4 * 60, team: 'C' },
    ]
  },
};
