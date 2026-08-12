import { api } from './api';
import { Portfolio, PortfolioHolding } from '../types';

export const portfolioService = {
  async getPortfolio(userId: number): Promise<Portfolio> {
    const res = await api.get(`/portfolio/${userId}`);
    return res.data;
  },

  async addHolding(userId: number, holding: Omit<PortfolioHolding, 'id'>) {
    const res = await api.post(`/portfolio/${userId}/holdings`, holding);
    return res.data;
  },

  async deleteHolding(holdingId: number) {
    const res = await api.delete(`/portfolio/holdings/${holdingId}`);
    return res.data;
  }
};
