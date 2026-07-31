// Commerce UI strings for the active language, with an English fallback per
// section (so a missing HE/AR key never renders undefined). Pairs with useLang()
// for product content translation.
import { DICT, type Lang } from '~/i18n/commerce'

type Section = keyof typeof DICT['en']

export function useT() {
  const { lang } = useLang()
  // Merge English under the active language so any untranslated key falls back.
  const t = <S extends Section>(section: S): typeof DICT['en'][S] => {
    const en = DICT.en[section]
    const cur = (DICT as any)[lang.value as Lang]?.[section]
    return { ...(en as any), ...(cur || {}) }
  }
  return { t }
}
