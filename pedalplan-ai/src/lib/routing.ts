export type LatLng = [number, number];

const ORS_URL = "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson";

/**
 * Returns a road-following cycling route between multiple waypoints.
 */
export async function getCyclingRoute(
  points: LatLng[],
): Promise<LatLng[]> {
  if (points.length < 2) return points;

  const apiKey = import.meta.env.VITE_ORS_API_KEY;

  if (!apiKey) {
    console.warn("Missing OpenRouteService API key.");
    return points;
  }

  try {
    const response = await fetch(ORS_URL, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: points.map(([lat, lng]) => [lng, lat]),
      }),
    });

    if (!response.ok) {
      throw new Error(`ORS returned ${response.status}`);
    }

    const data = await response.json();

    return data.features[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng],
    );
  } catch (err) {
    console.error("Routing failed:", err);

    // Fallback to straight lines
    return points;
  }
}
