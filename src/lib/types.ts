// This is a mock Timestamp class to ensure type compatibility after removing Firebase.
export interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

// The following types are for the raw data from data.ts
export interface Track {
id: string;
title: string;
artist: string;
coverUrl: string;
audioUrl: string;
releaseDate: Timestamp;
featured: boolean;
published: boolean;
order: number;
createdAt: Timestamp;
updatedAt: Timestamp;
blurb?: string;
lyrics?: string;
}

export interface Upcoming {
id: string;
title: string;
artist: string;
coverUrl: string;
teaserUrl?: string;
releaseDate: Timestamp;
createdAt: Timestamp;
updatedAt: Timestamp;
}

// The following types are for the data after it has been processed for the client
export interface ClientTrack extends Omit<Track, 'releaseDate' | 'createdAt' | 'updatedAt'> {
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientUpcoming extends Omit<Upcoming, 'releaseDate' | 'createdAt' | 'updatedAt'> {
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
