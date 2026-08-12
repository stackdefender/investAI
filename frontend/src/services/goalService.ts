import { api } from './api';
import { FinancialGoal } from '../types';

export const goalService = {
  async getGoals(userId: number): Promise<FinancialGoal[]> {
    const res = await api.get(`/goals/${userId}`);
    return res.data;
  },

  async createGoal(userId: number, goal: Omit<FinancialGoal, 'id' | 'monthly_sip_required'>): Promise<FinancialGoal> {
    const res = await api.post(`/goals/${userId}`, goal);
    return res.data;
  },

  async deleteGoal(goalId: number) {
    const res = await api.delete(`/goals/${goalId}`);
    return res.data;
  }
};
