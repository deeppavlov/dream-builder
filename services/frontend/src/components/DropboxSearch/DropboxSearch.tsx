import { useState } from 'react'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import Search from '../../ui/Search/Search'
import IntentList from '../IntentList/IntentList'
import IntentListItem, {
  IntentListItemInterface,
} from '../IntentListItem/IntentListItem'
import s from './DropboxSearch.module.scss'

interface DropboxSearchProps {
  intents?: IntentListItemInterface[]
  activeIntentId?: string
  onSelect?: (intent: IntentListItemInterface) => void
}

const DropboxSearch = ({
  intents,
  activeIntentId,
  onSelect,
}: DropboxSearchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(
    intents?.find(({ id }) => id === activeIntentId) ?? null
  )

  const handleDropdownClick = () => setIsOpen(!isOpen)

  return (
    <div className={s.dropboxSearch}>
      <div onClick={handleDropdownClick} className={s.dropboxSearch__dropdown}>
        {activeItem?.name ?? 'Select intent'}
      </div>
      <div
        className={`${s.dropboxSearch__list} ${
          isOpen ? s.dropboxSearch__list_open : ''
        }`}>
        <IntentList>
          {/* <div className={s.dropboxSearch__search}>
            <Input props={{ placeholder: 'Search intents' }} />
          </div> */}
          <Search />
          <Accordeon title='Custom' small>
            {intents?.map(({ id, name, status }) => (
              <IntentListItem key={id} id={id} name={name} status={status} />
            ))}
          </Accordeon>
          <Accordeon title='Prebuilt' small>
            {intents?.map(({ id, name }) => (
              <IntentListItem key={id} id={id} name={name} status={'default'} />
            ))}
          </Accordeon>
        </IntentList>
      </div>
    </div>
  )
}

export default DropboxSearch