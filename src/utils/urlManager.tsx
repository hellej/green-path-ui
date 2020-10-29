import { Basemap, BasemapByUrlId, UrlStateKey } from '../constants'

const paramCache: Map<string, string> = new Map()

export const getStateFromUrl = (location: any): UrlState => {
  const searchParams = new URLSearchParams(location.search)
  let basemap: Basemap | undefined = undefined
  if (searchParams.has(UrlStateKey.BASEMAP)) {
    const basemapId = searchParams.get(UrlStateKey.BASEMAP)
    if (basemapId) {
      basemap = BasemapByUrlId.get(basemapId)
    }
  }
  const odPanelVisible = searchParams.get(UrlStateKey.OD_PANEL_VISIBLE) === 't'

  return {
    basemap,
    odPanelVisible,
  }
}

export const setStringParam = (name: string, value: string, location: any, history: any) => {
  const searchParams = new URLSearchParams(location.search)
  paramCache.set(name, value)
  paramCache.forEach((v, k) => searchParams.set(k, v))
  history.push(`?${searchParams.toString()}`)
}

export const setBoolParam = (name: string, value: boolean, location: any, history: any) => {
  const stringVal = value ? 't' : 'f'
  setStringParam(name, stringVal, location, history)
}
