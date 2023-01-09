import { registerAs } from '@nestjs/config';

export default registerAs('media', () => {
  return {
    kinopoiskHost: process.env.KINOPOISK_HOST,
    kinopoiskKey: process.env.KINOPOISK_KEY,
    tmdbHost: process.env.TMDB_HOST,
    tmdbKey: process.env.TMDB_KEY,
  };
});
