type TArrayItem = { [x: string]: any }

/**
 * Sort array alphabetically by given key in `sortByKey` prop
 */
const sortByGroup = (array: TArrayItem[], sortByKey: string) => {
  return array.sort((previous, current) => {
    const previousGroup: string = previous?.[sortByKey]
    const currentGroup: string = current?.[sortByKey]
    const isGroups = previousGroup && currentGroup

    if (isGroups) {
      if (previousGroup < currentGroup) return -1
      if (previousGroup > currentGroup) return 1
    }

    return 0
  })
}

export default sortByGroup
