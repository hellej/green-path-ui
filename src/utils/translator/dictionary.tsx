import fi from './fi.json'
import en from './en.json'
import { Lang } from '../../reducers/uiReducer'

const langs: Record<Lang, Record<string, string>> = {
  'fi': fi as Record<string, string>,
  'en': en as Record<string, string>
}

if (process.env.NODE_ENV !== 'production') {
  Object.keys(langs[Lang.EN]).forEach((key) => {
    if (!(key in langs[Lang.FI])) {
      console.error('missing key from FI dict:', key)
    }
  })
  Object.keys(langs[Lang.FI]).forEach((key) => {
    if (!(key in langs[Lang.EN])) {
      console.error('missing key from EN dict:', key)
    }
  })
}

export const text = (lang: Lang, key: string) => {
  if (key in langs[lang]) {
    return langs[lang][key]
  }
  return key
}

export default (lang: Lang) => {
  return langs[lang]
}
