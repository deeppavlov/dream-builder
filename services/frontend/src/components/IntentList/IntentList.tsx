import s from './IntentList.module.scss'

const IntentList = ({ children }: React.PropsWithChildren) => {
  return <div className={s.intentList}>{children}</div>
}

export default IntentList
