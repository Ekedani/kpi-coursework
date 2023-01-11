import { FindMediaDto } from '../dto/find-media.dto';

/**
 * Summary: A helper function for generating a cache key
 */
export default (findMediaDto: FindMediaDto): string => {
  return JSON.stringify({
    keyword: findMediaDto.keyword,
    yearFrom: findMediaDto.yearFrom,
    yearTo: findMediaDto.yearTo,
    ratingFrom: findMediaDto.ratingFrom,
    ratingTo: findMediaDto.ratingTo,
  });
};
