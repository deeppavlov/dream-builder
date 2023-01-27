type resources = 'ram_usage' | 'gpu_usage' | 'disk_usage'

export const countResources = (
  componentGroup: object,
  resourceType: resources
) => {
  const cleanType = resourceType.split('_')[0]
  const total: number = componentGroup?.reduce(
    (accum: number, item: object) => {
      return accum + parseInt(item[resourceType])
    },
    0
  )
  return cleanType !== 'disk'
    ? `${total}.0 GB ${cleanType.toUpperCase()}`
    : `${total}.0 GB`
}
