export interface MediaInterface {
  sources: Array<string>;
  nameOriginal: string;
  year: number;
  rating: {
    [key: string]: number;
  };
  images: Array<string>;
  links: {
    [key: string]: string;
  };
}
