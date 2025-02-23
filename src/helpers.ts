export const findMaxId = (records: { id: number }[]): number =>
  records.reduce((maxId, { id }) => (id > maxId ? id : maxId), 0)
