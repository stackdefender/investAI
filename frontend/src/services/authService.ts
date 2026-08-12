import { api } from './api';
import { User, UserProfile } from '../types';

export const authService = {
  async register(data: { email: string; password: str; full_name: string }) {
    const res = await api.post('/auth/register', data);
    if (res.data?.access_token) {
      localStorage.setItem('investai_token', res.data.access_token);
      localStorage.setItem('investai_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(data: { email: string; password: str }) {
    const res = await api.post('/auth/login', data);
    if (res.data?.access_token) {
      localStorage.setItem('investai_token', res.data.access_token);
      localStorage.setItem('investai_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('investai_token');
    localStorage.removeItem('investai_user');
  },

  getCurrentUser(): User | null {
    const u = localStorage.getItem('investai_user');
    return u ? JSON.parse(u) : null;
  },

  async fetchProfile(userId: number): Promise<UserProfile> {
    try {
      const res = await api.get(`/profile/${userId}`);
      return res.data;
    } catch (err) {
      // Fallback default profile if backend offline
      return {
        user_id: userId,
        age: 32,
        country: 'India',
        employment_status: 'Salaried',
        monthly_income: 120000,
        monthly_expenses: 50000,
        monthly_savings: 70000,
        existing_investments: 650000,
        existing_loans: 150000,
        emergency_fund: 300000,
        monthly_investment_capacity: 25000,
        initial_investment_amount: 100000,
        investment_duration: 15,
        risk_tolerance_label: 'Moderate',
        risk_score: 62,
        financial_goals: ['Wealth Creation', 'Retirement'],
      };
    }
  },

  async updateProfile(userId: number, profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await api.put(`/profile/${userId}`, profile);
    return res.data;
  }
};
