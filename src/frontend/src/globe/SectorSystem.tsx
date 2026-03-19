export interface Sector {
  name: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

export const SECTORS: Sector[] = [
  { name: "ALPHA PRIME", latMin: 60, latMax: 90, lngMin: -180, lngMax: 180 },
  { name: "SECTOR BOREAL", latMin: 30, latMax: 60, lngMin: -180, lngMax: -90 },
  { name: "SECTOR TAURUS", latMin: 30, latMax: 60, lngMin: -90, lngMax: 0 },
  { name: "SECTOR ORION", latMin: 30, latMax: 60, lngMin: 0, lngMax: 90 },
  { name: "SECTOR VEGA", latMin: 30, latMax: 60, lngMin: 90, lngMax: 180 },
  { name: "EQUATORIAL WEST", latMin: 0, latMax: 30, lngMin: -180, lngMax: 0 },
  { name: "EQUATORIAL EAST", latMin: 0, latMax: 30, lngMin: 0, lngMax: 180 },
  { name: "SECTOR CAPELLA", latMin: -30, latMax: 0, lngMin: -180, lngMax: 0 },
  { name: "SECTOR RIGEL", latMin: -30, latMax: 0, lngMin: 0, lngMax: 180 },
  {
    name: "SECTOR SIRIUS",
    latMin: -60,
    latMax: -30,
    lngMin: -180,
    lngMax: -90,
  },
  { name: "SECTOR ANTARES", latMin: -60, latMax: -30, lngMin: -90, lngMax: 90 },
  {
    name: "OMEGA AUSTRAL",
    latMin: -90,
    latMax: -60,
    lngMin: -180,
    lngMax: 180,
  },
];

export function getSectorName(lat: number, lng: number): string {
  for (const sector of SECTORS) {
    if (
      lat >= sector.latMin &&
      lat < sector.latMax &&
      lng >= sector.lngMin &&
      lng < sector.lngMax
    ) {
      return sector.name;
    }
  }
  return "UNKNOWN SECTOR";
}
