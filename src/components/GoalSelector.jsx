import React from 'react';
import { HEALTH_GOALS } from '../constants/goals';

const GOAL_ICONS = {
  muscle_gain: '💪',
  fat_loss: '🔥',
  general_health: '🌿',
  diabetes: '🩺',
};

const GoalSelector = ({ selectedGoal, onSelect }) => {
  return (
    <div className="w-full">
      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
        {HEALTH_GOALS.map((goal) => {
          const isSelected = selectedGoal === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelect(goal.id)}
              className={`flex-none snap-start relative py-2.5 px-5 rounded-pill border text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? 'bg-primary/5 text-primary border-primary shadow-sm scale-[1.02]'
                  : 'bg-white text-gray-700 border-surface-variant hover:border-primary-lighter hover:bg-surface-variant/30 hover:shadow-sm'
              }`}
            >
              <span className="text-base">{GOAL_ICONS[goal.id]}</span>
              {goal.label}
              {isSelected && (
                <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GoalSelector;
