import { api } from './api';

export const educationService = {
  async getModules() {
    const res = await api.get('/education');
    return res.data;
  }
};
