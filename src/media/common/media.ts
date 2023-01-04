import { union, merge } from 'lodash';
import { createJestPreset } from 'ts-jest';

export class Media {
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
    const joined Media = {
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
    };
    delete joined.rating.average;
    const ratings = Object.entries(joined.rating).map((x) => x[1]);
    if (ratings.length !== 0) {
      joined.rating.average =
        ratings.reduce((x, a) => x + a, 0) / ratings.length;
    }
    return joined;
  }
}
