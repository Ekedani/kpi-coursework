import { FindMediaDto } from '../dto/find-media.dto';

export default (findMediaDto: FindMediaDto): string => {
  return JSON.stringify({
    keyword: findMediaDto.keyword,
    yearFrom: findMediaDto.yearFrom,
    yearTo: findMediaDto.yearTo,
    ratingFrom: findMediaDto.ratingFrom,
    ratingTo: findMediaDto.ratingTo,
  });
};
