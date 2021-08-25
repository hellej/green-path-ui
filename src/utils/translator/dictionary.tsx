import fi from './fi.json'
import sv from './sv.json'
import en from './en.json'
import { Lang } from '../../reducers/uiReducer'

const langs: Record<Lang, Record<string, string>> = {
  fi: fi as Record<string, string>,
  sv: sv as Record<string, string>,
  en: en as Record<string, string>,
}

if (process.env.NODE_ENV === 'development') {
  Object.keys(langs[Lang.EN]).forEach(key => {
    if (!(key in langs[Lang.FI])) {
      console.error(`missing key "${key}" (FI)`)
    }
    if (!(key in langs[Lang.SV])) {
      console.log(`missing key "${key}" (SV)`)
    }
  })
  Object.keys(langs[Lang.FI]).forEach(key => {
    if (!(key in langs[Lang.EN])) {
      console.warn(`missing key "${key}" (EN)`)
    }
  })
  Object.keys(langs[Lang.SV]).forEach(key => {
    if (!(key in langs[Lang.EN])) {
      console.error(`found invalid key "${key}" in SV dict`)
    }
  })
}

export const text = (lang: Lang, key: string): string => {
  if (key in langs[lang]) {
    return langs[lang][key]
  }
  // translate Swedish to English if translation is missing
  if (lang === Lang.SV && key in langs[Lang.EN]) {
    return langs[Lang.EN][key]
  }
  // return key if translation was not found
  return key
}

export const getErrorNotifKey = (errorKey: string): string => {
  const errorNotifKey = 'notif.error.routing.' + errorKey
  if (errorNotifKey in langs[Lang.EN]) {
    return errorNotifKey
  } else if (process.env.NODE_ENV === 'development') {
    console.error('Received unknown error key:', errorNotifKey)
  }
  return 'notif.error.routing.general_routing_error'
}

const dictionary = (lang: Lang) => {
  return langs[lang]
}

export default dictionary
