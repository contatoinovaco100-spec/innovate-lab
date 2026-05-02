import React from 'react';
import { Goal } from '../types';

interface SavingsGoalsProps {
  goals: Goal[];
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({ goals }) => {
  return (
    <div className="space-y-6">
      {goals.map((goal) => {
        const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
        
        return (
          <div key={goal.id}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">{goal.name}</span>
              <span className="text-sm font-bold text-gray-500">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full transition-all duration-500" 
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: goal.color,
                  boxShadow: `0 0 10px ${goal.color}40`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>R$ {goal.currentAmount.toLocaleString('pt-BR')}</span>
              <span>R$ {goal.targetAmount.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        );
      })}
      
      <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium hover:border-primary hover:text-primary transition-all">
        + Nova Meta
      </button>
    </div>
  );
};

export default SavingsGoals;
