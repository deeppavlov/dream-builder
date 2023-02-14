import s from './SidePanelName.module.scss'

interface Props {
  children?: React.ReactNode
}

const SidePanelName = ({ children }: Props) => {
  return <div className={s.sidePanelName}>{children}</div>
}

export default SidePanelName