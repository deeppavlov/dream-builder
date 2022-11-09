import { Router } from './Router/Router'
import ReactTooltip from 'react-tooltip'

export const App = () => {
  return (
    <div className='app'>
      <ReactTooltip
        place='bottom'
        effect='solid'
        className='tooltips'
        arrowColor='#8d96b5'
        offset={{ right: 55 }}
        delayShow={1000}
      />
      <Router />
    </div>
  )
}
