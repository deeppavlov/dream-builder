import Add from '../../assets/icons/+.svg'
import s from './AddButton.module.scss'

export const AddButton = ({ addBot, listView }: any) => {
  const handleClick = () => {
    console.log('clicked')
    addBot()
  }
  return (
    <>
      {!listView ? (
        <button
          onClick={() => {
            handleClick()
          }}
          className={s.add_card}>
          <img src={Add} />
        </button>
      ) : (
        <tr className={s.tr}>
          <td colSpan={6} className={s.td}>
            <button
              className={s.add_list_item}
              onClick={() => {
                handleClick()
              }}>
              <img src={Add} />
              <p>Create From a Scratch</p>
            </button>
          </td>
        </tr>
      )}
    </>
  )
}
