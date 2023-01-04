export interface MediaInterface {
  sources: Array<string>;
  nameOriginal: string | null;
  alternativeNames: Array<string>
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
}
