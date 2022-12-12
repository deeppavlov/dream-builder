import s from './IntentList.module.scss'

const IntentList = ({ children }: React.PropsWithChildren) => {
  return <ul className={s.intentList}>{children}</ul>
}

export default IntentList
