'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';

interface ActionButtonsProps {
    actions: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    onAction: (action: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const ActionButtons = ({ actions, onAction }: ActionButtonsProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validActions = actions.filter((action: any) =>
        ['create_goal', 'edit_goal', 'create_habit', 'edit_habit', 'show_goal_ui', 'show_habit_ui'].includes(action.type)
    );

    if (validActions.length === 0) return null;

    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {validActions.map((action: any, index: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                const mappedActionType = action.type.replace('show_', '').replace('_ui', '');

                const actionConfig = {
                    create_goal: { label: 'Create Goal', icon: 'Target', gradient: 'from-primary to-secondary' },
                    edit_goal: { label: 'Edit Goal', icon: 'Edit', gradient: 'from-orange-500 to-orange-400' },
                    create_habit: { label: 'Create Habit', icon: 'Repeat', gradient: 'from-accent to-emerald-400' },
                    edit_habit: { label: 'Edit Habit', icon: 'Edit', gradient: 'from-violet-500 to-purple-500' },
                    goal: { label: 'Create Goal', icon: 'Target', gradient: 'from-primary to-secondary' },
                    habit: { label: 'Create Habit', icon: 'Repeat', gradient: 'from-accent to-emerald-400' }
                }[mappedActionType as string] || { label: 'Action', icon: 'Plus', gradient: 'from-slate-600 to-slate-700' };

                return (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAction({ ...action, type: mappedActionType.includes('_') ? mappedActionType : `create_${mappedActionType}` })}
                        className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${actionConfig.gradient} text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
                    >
                        <Icon name={actionConfig.icon} className="w-4 h-4" />
                        <span>{actionConfig.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};
