export const equipmentOptions = ['TV', 'Retro Projecteur']

export const columns = Array.from({ length: 13 }, (_, i) => {
  const hour = 8 + i
  return { id: `${hour}:00`, label: `${hour}:00` }
})
