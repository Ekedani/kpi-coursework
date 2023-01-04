import { union, merge } from 'lodash';

export class Media {
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
  }) {
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
  }

  sources: Array<string>;
  nameOriginal: string | null;
  alternativeNames: Array<string>;
  year: number | null;
  imdbId: string | null;
  rating: {
    [service: string]: number;
  };
  genres: Array<string>;
  ids: {
    [service: string]: string;
  };
  images: Array<string>;
  links: {
    [service: string]: string;
  };

  public join(media: Media) {
    const joined = new Media({
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
