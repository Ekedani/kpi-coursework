import { MediaItem } from './media-item';
import { merge, union } from 'lodash';

export class DetailedMediaItem extends MediaItem {
  constructor(param: {
    alternativeNames: any;
    nameOriginal: string;
    images: any;
    sources: any;
    year: number;
    imdbId: string;
    genres: any;
    rating: any;
    ids: any;
    links: any;
    overview?: string;
    budget?: number;
    originalLanguage?: string;
  }) {
    super(param);
    this.sources = param.sources;
    this.nameOriginal = param.nameOriginal;
    this.alternativeNames = param.alternativeNames;
    this.year = param.year;
    this.imdbId = param.imdbId;
    this.rating = param.rating;
    this.genres = param.genres;
    this.ids = param.ids;
    this.images = param.images;
    this.links = param.links;
    this.budget = param.budget;
    this.overview = param.overview;
    this.originalLanguage = param.originalLanguage;
  }

  overview?: string;
  budget?: number;
  originalLanguage?: string;

  public join(media: DetailedMediaItem): DetailedMediaItem {
    const joined = new DetailedMediaItem({
      sources: union(this.sources, media.sources),
      nameOriginal: this.nameOriginal ?? media.nameOriginal,
      alternativeNames: union(this.alternativeNames, media.alternativeNames),
      year: this.year ?? media.year,
      imdbId: this.imdbId ?? media.imdbId,
      rating: merge(this.rating, media.rating),
      genres: union(this.genres, media.genres),
      ids: merge(this.ids, media.ids),
      images: union(this.images, media.images),
      links: merge(this.links, media.links),
      overview: this?.overview ?? media?.overview,
      budget: this?.budget ?? media?.budget,
      originalLanguage: this?.originalLanguage ?? media?.originalLanguage,
    });
    delete joined.rating.average;
    const ratings = Object.entries(joined.rating).map((x) => x[1]);
    if (ratings.length !== 0) {
      joined.rating.average =
        ratings.reduce((x, a) => x + a, 0) / ratings.length;
    }
    return joined;
  }
}
