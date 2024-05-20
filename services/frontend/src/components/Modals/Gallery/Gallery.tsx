import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { ReactComponent as LeftArrowIcon } from 'assets/icons/arrow_left_copy.svg'
import { ReactComponent as RightArrowIcon } from 'assets/icons/arrow_right.svg'
import { consts } from 'utils/consts'
import BaseModal from '../BaseModal/BaseModal'
import s from './Gallery.module.scss'

export const Gallery = () => {
  const cx = classNames.bind(s)
  const { UIOptions, setUIOption } = useUIOptions()
  const [isOpen, setIsOpen] = useState(false)
  const [currIndex, setCurrIndex] = useState(0)

  useEffect(() => {
    setIsOpen(Boolean(UIOptions[consts.GALLERY_STATE]?.isOpen))
    setCurrIndex(UIOptions[consts.GALLERY_STATE]?.pictureIndex)
  }, [UIOptions[consts.GALLERY_STATE]])

  const pictures = UIOptions[consts.GALLERY_PICTURES]

  const toggleModal = (open: boolean) => {
    if (!open) {
      setUIOption({ name: consts.GALLERY_STATE, value: { isOpen: false } })
    }
    setIsOpen(open)
  }

  return (
    <BaseModal isOpen={isOpen} setIsOpen={toggleModal} modalClassName={s.modal}>
      <img className={s.img} alt='' src={pictures[currIndex]?.picture} />
      <button
        className={cx('btnL')}
        onClick={() => {
          setCurrIndex(prev => (prev > 0 ? prev - 1 : pictures.length - 1))
        }}
      >
        <LeftArrowIcon />
      </button>
      <button
        className={cx('btnR')}
        onClick={() => {
          setCurrIndex(prev => (pictures[prev + 1] ? prev + 1 : 0))
        }}
      >
        <RightArrowIcon />
      </button>
    </BaseModal>
  )
}
