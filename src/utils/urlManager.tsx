import { Basemap, BasemapByUrlId, UrlStateKeys } from '../constants'

const paramCache: Map<string, string> = new Map()

export const getStateFromUrl = (location: any): UrlState => {
  const searchParams = new URLSearchParams(location.search)
  let basemap: Basemap | undefined = undefined
  if (searchParams.has(UrlStateKeys.BASEMAP)) {
    const basemapId = searchParams.get(UrlStateKeys.BASEMAP)
    if (basemapId) {
      basemap = BasemapByUrlId.get(basemapId)
    }
  }
  const odPanelHidden = searchParams.get(UrlStateKeys.OD_PANEL_HIDDEN) === 'true'

  return {
    basemap,
    odPanelHidden,
  }
}

export const setUrlParam = (name: string, value: string, location: any, history: any) => {
  const searchParams = new URLSearchParams(location.search)
  paramCache.set(name, value)
  paramCache.forEach((v, k) => searchParams.set(k, v))
  history.push(`?${searchParams.toString()}`)
}
