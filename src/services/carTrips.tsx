import axios from 'axios'

const endpoint = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'

interface CatTripPlanResponse {
  data: { data: { plan: { itineraries: { duration: number; legs: { distance: number }[] }[] } } }
}

export interface CarTripInfo {
  distance: number
  duration: number
  co2min: number
  co2max: number
}

const getItineraryQuery = (origCoords: Coords, destCoords: Coords): string => {
  return `{
        plan(
            from: {lat: ${origCoords[1]}, lon: ${origCoords[0]}}
            to: {lat: ${destCoords[1]}, lon: ${destCoords[0]}}
            numItineraries: 1
            transportModes: { mode: CAR }
            ) {
                itineraries {
                    duration
                    legs {
                      distance
                    }
                }
            }
        }`
}

export const getTripInfo = async (
  origCoords: Coords,
  destCoords: Coords,
): Promise<CarTripInfo | undefined> => {
  const query = getItineraryQuery(origCoords, destCoords)
  const headers = { 'Content-Type': 'application/json' }
  try {
    const response = (await axios({
      method: 'post',
      url: endpoint,
      headers,
      data: { query },
    })) as CatTripPlanResponse
    const itineraries = response.data.data.plan.itineraries
    const distance =
      itineraries.length > 0
        ? itineraries[0].legs.length > 0
          ? itineraries[0].legs[0].distance
          : 0
        : 0
    const duration = itineraries.length > 0 ? itineraries[0].duration : 0
    const co2min = Math.round((distance / 1000) * 100)
    const co2max = Math.round((distance / 1000) * 200)
    return {
      distance,
      duration,
      co2min,
      co2max,
    }
  } catch (error) {
    console.error(error)
  }
}
