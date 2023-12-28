import i18n from 'i18n'

export const getAssistantTableHeaders = (type: 'private' | 'public') => {
  const tableHeaders = [
    i18n.t('assistant_table.name'),
    i18n.t('assistant_table.author'),
    i18n.t('assistant_table.desc'),
    i18n.t('assistant_table.visibility'),
    i18n.t('assistant_table.language'),
    i18n.t('assistant_table.actions'),
  ]

  const tableHeadersPrivate = [
    i18n.t('assistant_table.name'),
    i18n.t('assistant_table.author'),
    i18n.t('assistant_table.desc'),
    i18n.t('assistant_table.error'),
    i18n.t('assistant_table.visibility'),
    i18n.t('assistant_table.language'),
    i18n.t('assistant_table.actions'),
  ]

  return type === 'private' ? tableHeadersPrivate : tableHeaders
}
