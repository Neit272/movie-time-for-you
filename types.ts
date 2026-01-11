export enum ContentType {
  MOVIE = 'MOVIE',
  SERIES = 'SERIES',
  COMIC = 'COMIC',
  MANGA = 'MANGA'
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  coverImage: string;
  backdropImage: string;
  description: string;
  rating: number;
  year: number;
  tags: string[];
  progress?: number;
}

export interface Episode {
  id: string;
  title: string;
  number: number;
  duration: string;
  thumbnail: string;
  server_name?: string;
  link_embed?: string;
  link_m3u8?: string;
}

export interface Chapter {
  id: string;
  title: string;
  number: number;
  pages: string[];
  apiUrl?: string;
}

export interface ContentDetails extends ContentItem {
  episodes?: Episode[];
  chapters?: Chapter[];
  cast?: string[];
  author?: string;
  country?: string;
  countries?: Country[];
  status: string;
  categories?: Category[];
}

export enum ReaderMode {
  VERTICAL = 'VERTICAL',
  PAGINATED = 'PAGINATED'
}