export interface Record {
  id: string;
  name: string;
  url: string;
  artist: string;
  releaseDate: Date;
}

// Type for the MapMarker so typescript doesn't give errors
export interface MapMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
}
