import type { PlaneSnapshot, Planes } from "./planeApi";

export function normalizeLivePlanes(responseData: any): Planes[] {
  const planeArr = getResponseArr(responseData);

  return planeArr.map((p: any) => {
    const src = p.plane_live ?? p;

    return {
      hex: src.hex,
      callsign: src.callsign ?? "UNKNOWN",
      latitude: Number(src.latitude),
      longitude: Number(src.longitude),
      originCountry: src.originCountry ?? "UNKNOWN",
      heading: Number(src.heading ?? 0),
      groundSpeed: Number(src.groudSpeed ?? 0),
    };
  });
}

export function normalizeSnapshots(
  responseData: { data?: PlaneSnapshot[] } | PlaneSnapshot[],
): Planes[] {
  const planeArr = getResponseArr(responseData);

  return planeArr.map((plane) => ({
    hex: plane.hex,
    callsign: plane.callsign ?? "UNKNOWN",
    latitude: Number(plane.latitude),
    longitude: Number(plane.longitude),
    originCountry: plane.originCountry ?? "Unknown",
    heading: Number(plane.heading ?? 0),
    groundSpeed: Number(plane.groundSpeed ?? 0),
  }));
}

export function getResponseArr<T>(responseData: { data?: T[] } | T[]): T[] {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  return [];
}
