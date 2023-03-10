import { useEffect } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

export const useTooltip = () => {
  useEffect(() => {
    ReactTooltip.rebuild()
  })
}
