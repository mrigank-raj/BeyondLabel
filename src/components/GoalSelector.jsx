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
    <div className="w-full mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3 text-left">
        Select your health goal <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3 stagger-children">
        {HEALTH_GOALS.map((goal) => {
          const isSelected = selectedGoal === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelect(goal.id)}
              className={`relative py-3.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-md scale-[1.02]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-lighter hover:bg-green-50/50 hover:shadow-sm'
              }`}
            >
              <span className="text-lg">{GOAL_ICONS[goal.id]}</span>
              {goal.label}
              {isSelected && (
                <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
