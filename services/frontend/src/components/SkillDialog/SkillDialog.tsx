import classNames from 'classnames/bind'
import { ReactComponent as DialogTextIcon } from '@assets/icons/dialog_text.svg'
import { ReactComponent as DialogMicrophoneIcon } from '@assets/icons/dialog_microphone.svg'
import { ReactComponent as DownloadDialogIcon } from '@assets/icons/dialog_download.svg'
import { ReactComponent as Renew } from '@assets/icons/renew.svg'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import DialogButton from '../DialogButton/DialogButton'
import s from './SkillDialog.module.scss'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'

const SkillDialog = () => {
  let cx = classNames.bind(s)

  return (
    <form className={s.dialog}>
      <SidePanelHeader>
        <ul role='tablist'>
          <li role='tab' key='Current  Skill' aria-selected>
            Current Skill
          </li>
          <li role='tab' key='All Skills'>
            All Skills
          </li>
        </ul>
      </SidePanelHeader>

      <div className={s.container}>
        <SkillDropboxSearch
          label='Choose skill:'
          list={[]}
          props={{
            placeholder: 'Choose skill',
          }}
          fullWidth
        />
        <ul className={s.chat}>
          <li className={s.msg}>hello</li>
          <li className={cx('msg', 'bot')}>hello</li>
          <li className={s.msg}>hello</li>
          <li className={cx('msg', 'bot')}>hello</li>
          <li className={s.msg}>hello</li>
          <li className={cx('msg', 'bot')}>hello</li>
          <li className={s.msg}>hello</li>
          <li className={cx('msg', 'bot')}>hello</li>
          <li className={s.msg}>hello</li>
          <li className={cx('msg', 'bot')}>hello</li>
        </ul>
      </div>
      <div className={s.controls}>
        <div className={s.left}>
          <DialogButton active>
            <DialogTextIcon />
          </DialogButton>
          <DialogButton>
            <DialogMicrophoneIcon />
          </DialogButton>
          <div className={s.download}>
            <DialogButton>
              <DownloadDialogIcon />
            </DialogButton>
          </div>
        </div>
        <div className={s.right}>
          <Button small theme='secondary' withIcon>
            <div className={s['right-container']} data-tooltip-id='renew'>
              <Renew />
            </div>
          </Button>
        </div>
      </div>
      <div className={cx('textarea-container')}>
        <textarea className={s.textarea} rows={4} placeholder='Type...' />
      </div>
      <SidePanelButtons>
        <Button theme='secondary' props={{ type: 'submit' }}>
          Send
        </Button>
      </SidePanelButtons>
    </form>
  )
}

export default SkillDialog
