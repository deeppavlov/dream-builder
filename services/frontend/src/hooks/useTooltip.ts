import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

export const useTooltip = () => {
  useEffect(() => {
    ReactTooltip.rebuild()
  })
}
