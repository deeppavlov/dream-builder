import s from './SidePanelButtons.module.scss'

interface Props {
  children?: React.ReactNode
}

const SidePanelButtons = ({ children }: Props) => {
  return <div className={s.sidePanelButtons}>{children}</div>
}

export default SidePanelButtons
