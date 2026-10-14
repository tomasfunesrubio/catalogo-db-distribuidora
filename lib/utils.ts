// Quita tildes y pasa a minúsculas para comparar textos en las búsquedas
export const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
