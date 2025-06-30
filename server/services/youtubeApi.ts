import axios from 'axios';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
  duration: string;
  views: string;
  publishedAt: string;
}

export class YouTubeApiService {
  private apiKey: string;
  private baseUrl = 'https://youtube-search-and-download.p.rapidapi.com';

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || process.env.RAPID_API_KEY || '0e3a05e4c0msh3a58fa2b2bacbaep162600jsn4228aeea665f';
  }

  private getHeaders() {
    return {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com'
    };
  }

  async searchVideos(query: string, limit = 10): Promise<YouTubeVideo[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: this.getHeaders(),
        params: {
          query: `${query} exercise tutorial`,
          next: 'EogDEgVoZWxsbw%3D%3D',
          hl: 'en',
          gl: 'US'
        }
      });

      if (response.data && response.data.contents) {
        return response.data.contents
          .filter((item: any) => item.video)
          .slice(0, limit)
          .map((item: any) => ({
            id: item.video.videoId,
            title: item.video.title,
            description: item.video.descriptionSnippet?.[0]?.text || '',
            thumbnail: item.video.thumbnails?.[0]?.url || '',
            channel: item.video.author?.title || '',
            duration: item.video.lengthText || '',
            views: item.video.stats?.views || '0',
            publishedAt: item.video.publishedTimeText || ''
          }));
      }
      
      return [];
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return []; // Return empty array instead of throwing error for better UX
    }
  }

  async getChannelInfo(channelId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/channel/about`, {
        headers: this.getHeaders(),
        params: { id: channelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw new Error(`Failed to fetch channel info for ID: ${channelId}`);
    }
  }
}

export const youtubeApiService = new YouTubeApiService();
