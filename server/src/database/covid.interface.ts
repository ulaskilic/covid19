export interface Covid {
  timestamp: Date,
  day: string,
  type: string,
  name: string,
  code: string,
  location: {
    type: string,
    coordinates: number[]
  },
  region: string,
  subRegion: string,
  confirmed: number,
  death: number,
  cured: number,
}
