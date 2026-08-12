import { api } from './api';
import { NewsItem } from '../types';

export const newsService = {
  async getNews(category?: string, region?: string): Promise<NewsItem[]> {
    const res = await api.get('/news', { params: { category, region } });
    return res.data;
  },

  async getLiveRssNews(): Promise<NewsItem[]> {
    const res = await api.get('/news/live-rss');
    return res.data;
  },

  async getNewsItem(newsId: number): Promise<NewsItem> {
    const res = await api.get(`/news/${newsId}`);
    return res.data;
  },

  async fetchAndAnalyzeUrl(url: string, category: string = 'Markets', region: string = 'Global Economy'): Promise<NewsItem> {
    const res = await api.post('/news/fetch-url', { url, category, region });
    return res.data;
  },

  async addCustomNews(data: {
    headline: string;
    summary: string;
    source?: string;
    category?: string;
    region?: string;
    related_markets?: string;
    full_content?: string;
  }): Promise<NewsItem> {
    const res = await api.post('/news/custom', data);
    return res.data;
  }
};
