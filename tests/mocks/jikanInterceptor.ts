import { JikanSchema } from '@/types/jikanSchema';
import { httpInterceptor } from 'zimic/interceptor/http';

export const jikanInterceptor = httpInterceptor.create<JikanSchema>({
  type: 'local',
  baseURL: 'https://api.jikan.moe/v4',
  saveRequests: process.env.NODE_ENV === 'test',
});

httpInterceptor.default.onUnhandledRequest((request, context) => {
  const url = new URL(request.url);

  if (!(url.hostname === '127.0.0.1' || url.hostname === 'localhost')) {
    context.log();
  }
});
