import aqiLayerData from './aqi_map.json'

export const getAqiLayerData = (): Map<number, number> => {
  return new Map(aqiLayerData.data as [number, number][])
}
