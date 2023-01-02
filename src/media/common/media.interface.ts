export interface MediaInterface {
  sources: Array<string>;
  nameOriginal: string;
  year: number;
  rating: {
    [rating: string]: number;
  };
  ids: {
    [service: string]: string;
  };
  images: Array<string>;
  links: {
    [service: string]: string;
  };
}
