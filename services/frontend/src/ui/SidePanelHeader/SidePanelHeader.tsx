import s from './SidePanelHeader.module.scss'

interface Props {
  children?: React.ReactNode
}

const SidePanelHeader = ({ children }: Props) => {
  return <div className={s.sidePanelHeader}>{children}</div>
}

export default SidePanelHeader
