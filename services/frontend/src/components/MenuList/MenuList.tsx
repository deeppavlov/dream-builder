import { FC } from 'react'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { ReactComponent as CloneIcon } from '../../assets/icons/clone.svg'
import { ReactComponent as DisableIcon } from '../../assets/icons/disable.svg'
import { ReactComponent as AddIcon } from '../../assets/icons/add.svg'
import { ReactComponent as PropertiesIcon } from '../../assets/icons/properties.svg'
import { ReactComponent as DownloadIcon } from '../../assets/icons/download.svg'
import { ReactComponent as PublishIcon } from '../../assets/icons/publish.svg'
import { ReactComponent as RenameIcon } from '../../assets/icons/rename.svg'
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete.svg'
import { ReactComponent as RollbackIcon } from '../../assets/icons/rollback.svg'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { Link } from 'react-router-dom'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import IntentCatcherSidePanel from '../IntentCatcherSidePanel/IntentCatcherSidePanel'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import { dateToUTC } from '../../utils/dateToUTC'
import AnnotatorSidePanel from '../AnnotatorSidePanel/AnnotatorSidePanel'
import IntentResponderSidePanel from '../IntentResponderSidePanel/IntentResponderSidePanel'
import { MenuTypes } from '../../types/types'
import { usePreview } from '../../Context/PreviewProvider'
import s from './MenuList.module.scss'

export interface MenuListProps {
  type: MenuTypes
  item?: any
  privateDataFor?: any
}

export const MenuList: FC<MenuListProps> = ({ type, privateDataFor, item }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    switch (e?.currentTarget?.innerText!) {
      case 'Rename':
        trigger('AssistantModal', { action: 'edit', distribution: '' })
        break
      case 'Delete':
        trigger('DeleteAssistantModal', {
          // bot: {
          //   routingName: '', // TODO: get variables
          //   name: 'EnDreamToDebug', // TODO: get variables
          // },
        })
        break
      case 'Publish':
        trigger('PublishAssistantModal', {})
        break
    }
  }

  const { isPreview } = usePreview()
  const cx = classNames.bind(s)

  switch (type) {
    case 'main':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          offset={{ right: 90, top: -3 }}
          id='main'
          place='bottom'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <a href={'http://deepdream.builders'} target='_blank'>
                <div>About Dream Builder</div>
              </a>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'bots':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          offset={{ right: 90, top: -3 }}
          id='bots'
          place='bottom'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>About Dream Builder</div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>Clone Bot</div>
            </li>
            <li className={s.item}>
              <div>Add From Template</div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'skills_page':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          offset={{ right: 90, top: -3 }}
          id='skills_page'
          place='bottom'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>About Dream Builder</div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>Add Skill</div>
            </li>
            <li className={s.item}>
              <div>Add From Template</div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'editor':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          offset={{ right: 90, top: -3 }}
          id='editor'
          place='bottom'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>Save</div>
            </li>
            <li className={s.item}>
              <div>Save As</div>
            </li>
            <li className={s.item}>
              <div>Rename</div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>Add Skills</div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>Publish</div>
            </li>
            {/* <li className={s.item}>
              <div>Download</div>
            </li> */}
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>History</div>
            </li>
            <li className={s.item}>
              <div>Delete</div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'bot_public':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          id='bot_public'
          place='right'
          effect='solid'>
          <ul className={s.menu}>
            {/* <Link to='/editor'>
              <li className={s.item}>
                <div>
                  <CloneIcon />
                  <p>Clone Bot</p>
                </div>
              </li>
            </Link> */}
            <li className={s.item}>
              <div>
                <PropertiesIcon />
                <p>Properties</p>
              </div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'your_bot':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          id='your_bot'
          place='right'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div onClick={handleClick}>
                <RenameIcon />
                <p>Rename</p>
              </div>
            </li>
            <li className={s.item}>
              <div onClick={handleClick}>
                <PublishIcon />
                <p>Publish</p>
              </div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div onClick={handleClick}>
                <DeleteIcon />
                <p>Delete</p>
              </div>
            </li>
          </ul>
          {/* <hr style={{ border: '0.8px solid #F0F0F3' }} />
          <div style={{ padding: '10px' }}>
            <Wrapper padding='5px 12px' borderRadius='8px'>
              <p className={s.edited}>
                Last Edited by {author ? author : 'Irina Nikitenko'}
                <br />
                {day ? day : 'Today'} at {time ? time : '04:20'}
              </p>
            </Wrapper>
          </div> */}
        </ReactTooltip>
      )
    case 'skills':
      return (
        <ReactTooltip
          event='click'
          possibleCustomEventsOff='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          id='skills'
          place='right'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>
                <AddIcon />
                <p>Add Skill</p>
              </div>
            </li>
            <li className={s.item}>
              <div>
                <PropertiesIcon />
                <p>Properties</p>
              </div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'all_annotators':
      return (
        <ReactTooltip
          event='click'
          possibleCustomEventsOff='click'
          globalEventOff='wheel'
          clickable={true}
          className={s.menulist}
          id='all_annotators'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>
                <AddIcon />
                <p>Add Annotators</p>
              </div>
            </li>
            <li className={s.item}>
              <div>
                <DisableIcon />
                <p>Disable All Annotators</p>
              </div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>
                <DeleteIcon />
                <p>Delete All Annotators</p>
              </div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'response_annotators':
      return (
        <ReactTooltip
          event='click'
          possibleCustomEventsOff='click'
          globalEventOff='wheel'
          clickable={true}
          className={s.menulist}
          place='left'
          offset={{ top: -90 }}
          id='response_annotators'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>
                <AddIcon />
                <p>Add Annotators</p>
              </div>
            </li>
            <li className={s.item}>
              <div>
                <DisableIcon />
                <p>Disable All Annotators</p>
              </div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>
                <DeleteIcon />
                <p>Delete All Annotators</p>
              </div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'all_skills':
      return (
        <ReactTooltip
          event='click'
          possibleCustomEventsOff='click'
          globalEventOff='wheel'
          clickable={true}
          className={s.menulist}
          id='all_skills'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>
                <AddIcon />
                <p>Add Skills</p>
              </div>
            </li>
            <li className={s.item}>
              <div>
                <DisableIcon />
                <p>Disable All Skills</p>
              </div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>
                <DeleteIcon />
                <p>Delete All Skills</p>
              </div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'customizable_annotator':
      const MenuTT = () => (
        <ul className={s.menu}>
          <li className={cx('item', isPreview && 'disabled')}>
            <div
              onClick={() => {
                switch (item.typeItem) {
                  case 'Intent Catcher':
                    trigger(BASE_SP_EVENT, {
                      children: (
                        <IntentCatcherSidePanel
                          key='Editor'
                          annotator={{
                            name: item.data.display_name,
                            author: item.data.author,
                            authorImg: DeepPavlovLogo,
                            type: item.data.type,
                            desc: item.data.description,
                          }}
                          activeTab='Editor'
                        />
                      ),
                    })
                    break
                  default:
                    break
                }
              }}>
              <RenameIcon />
              <p>Edit Annotator</p>
            </div>
          </li>
          {/* <li className={s.item}>
            <div>
              <DisableIcon />
              <p>Disable Annotator</p>
            </div>
          </li> */}
          <li className={s.item}>
            <div
              onClick={() => {
                switch (item.typeItem) {
                  case 'Intent Catcher':
                    trigger(BASE_SP_EVENT, {
                      children: (
                        <IntentCatcherSidePanel
                          key='Properties'
                          annotator={{
                            name: item.data.display_name,
                            author: item.data.author,
                            authorImg: DeepPavlovLogo,
                            type: item.data.type,
                            desc: item.data.description,
                          }}
                        />
                      ),
                    })
                    break

                  default:
                    trigger(BASE_SP_EVENT, {
                      children: (
                        <AnnotatorSidePanel
                          key={item.typeItem}
                          annotator={{
                            name: item.data.display_name,
                            author: item.data.author,
                            authorImg: DeepPavlovLogo,
                            type: item.data.type,
                            desc: item.data.description,
                          }}
                        />
                      ),
                    })
                    break
                }
              }}>
              <PropertiesIcon />
              <p>Properties</p>
            </div>
          </li>
          {/* <hr style={{ border: '0.8px solid #8D96B5' }} />
          <li className={s.item}>
            <div>
              <DeleteIcon />
              <p>Delete</p>
            </div>
          </li> */}
        </ul>
      )
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          data-event-off='click'
          possibleCustomEventsOff='click'
          clickable={true}
          className={s.menulist}
          id={privateDataFor}
          place='right'
          effect='solid'>
          <MenuTT />
        </ReactTooltip>
      )
    case 'customizable_skill':
      const CusSkillMenu = () => (
        <ul className={s.menu}>
          <li className={cx('item', isPreview && 'disabled')}>
            <div
              onClick={() => {
                switch (item?.typeItem) {
                  case 'Dff Intent Responder Skill':
                    !isPreview &&
                      trigger(BASE_SP_EVENT, {
                        children: (
                          <IntentResponderSidePanel
                            key='Editor'
                            skill={{
                              name: item.data.display_name,
                              author: item.data.author,
                              authorImg: DeepPavlovLogo,
                              skillType: item.data.type,
                              botName: 'Name of The Bot',
                              desc: item.data.description,
                              dateCreated: dateToUTC(
                                new Date(item.data.date_created)
                              ),
                              version: item.data.version,
                              ram: item.data.ram_usage,
                              gpu: item.data.gpu_usage,
                              executionTime: item.data.execution_time,
                            }}
                            activeTab='Editor'
                          />
                        ),
                      })
                    break
                  case 'Dialogpt':
                  case 'Dialogpt Persona Based':
                  // case 'Dff Intent Responder Skil≠l':
                  case 'Dummy Skill':
                  case 'Dff Empathetic Marketing Prompted Skill':
                  case 'Dff Scheduling Prompted Skill':
                  case 'Dff Da Costa Clothes Prompted Skill':
                  case 'Dff Home Automation Prompted Skill':
                  case 'Dff Nutrition Prompted Skill':
                  case 'Dff Rhodes Coaching Prompted Skill':
                  case 'Dff Dream Persona Prompted Skill':
                    trigger('SkillPromptModal', {
                      skill: item.data,
                    })
                    break
                  default:
                    break
                }
              }}>
              <RenameIcon />
              <p>Edit Skill</p>
            </div>
          </li>
          <li className={s.item}>
            <div
              onClick={() => {
                switch (item.typeItem) {
                  case 'Dff Intent Responder Skill':
                    trigger(BASE_SP_EVENT, {
                      children: (
                        <IntentResponderSidePanel
                          key='Properties'
                          skill={{
                            name: item.data.display_name,
                            author: item.data.author,
                            authorImg: DeepPavlovLogo,
                            skillType: item.data.type,
                            botName: 'Name of The Bot',
                            desc: item.data.description,
                            dateCreated: dateToUTC(
                              new Date(item.data.date_created)
                            ),
                            version: item.data.version,
                            ram: item.data.ram_usage,
                            gpu: item.data.gpu_usage,
                            executionTime: item.data.execution_time,
                          }}
                        />
                      ),
                    })
                    break

                  default:
                    trigger(BASE_SP_EVENT, {
                      children: (
                        <SkillSidePanel
                          key={item.typeItem}
                          skill={{
                            name: item.data.display_name,
                            author: item.data.author,
                            authorImg: DeepPavlovLogo,
                            skillType: item.data.type,
                            botName: 'Name of The Bot',
                            desc: item.data.description,
                            dateCreated: dateToUTC(
                              new Date(item.data.date_created)
                            ),
                            version: item.data.version,
                            ram: item.data.ram_usage,
                            gpu: item.data.gpu_usage,
                            executionTime: item.data.execution_time,
                          }}
                        />
                      ),
                    })
                    break
                }
              }}>
              <PropertiesIcon />
              <p>Properties</p>
            </div>
          </li>
          <li className={cx('item', isPreview && 'disabled')}>
            <div>
              <DisableIcon />
              <p>Disable Skill</p>
            </div>
          </li>
          <hr style={{ border: '0.8px solid #8D96B5' }} />
          <li className={cx('item', isPreview && 'disabled')}>
            <div>
              <DeleteIcon />
              <p>Delete</p>
            </div>
          </li>
        </ul>
      )
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          id={privateDataFor}
          place='right'
          effect='solid'>
          <CusSkillMenu />
          {/* <hr style={{ border: '0.8px solid #F0F0F3' }} /> */}
          {/* <div style={{ padding: '10px' }}>
            <Wrapper padding='5px 12px' borderRadius='8px'>
              <p className={s.edited}>
                Last Edited by {author ? author : 'Irina Nikitenko'}
                <br />
                {day ? day : 'Today'} at {time ? time : '04:20'}
              </p>
            </Wrapper>
          </div> */}
        </ReactTooltip>
      )
    case 'non_customizable_annotator':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          id='non_customizable_annotator'
          place='right'
          effect='solid'>
          <ul className={s.menu}>
            {/* <li className={s.item}>
              <div>
                <DisableIcon />
                <p>Disable Annotator</p>
              </div>
            </li> */}
            <li className={s.item}>
              <div>
                <PropertiesIcon />
                <p>Properties</p>
              </div>
            </li>
            {/* <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>
                <DeleteIcon />
                <p>Delete</p>
              </div>
            </li> */}
          </ul>
        </ReactTooltip>
      )
    case 'non_customizable_skill':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click'
          arrowColor='#fff'
          clickable={true}
          className={s.menulist}
          id='non_customizable_skill'
          place='right'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>
                <DisableIcon />
                <p>Disable Skill</p>
              </div>
            </li>
            <li className={s.item}>
              <div>
                <PropertiesIcon />
                <p>Properties</p>
              </div>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <div>
                <DeleteIcon />
                <p>Delete</p>
              </div>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'skill_selector':
      return (
        <ReactTooltip
          event='click'
          possibleCustomEventsOff='click'
          globalEventOff='wheel'
          clickable={true}
          className={s.menulist}
          id='skill_selector'
          place='bottom'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>
                <PropertiesIcon />
                <p>Properties</p>
              </div>
            </li>
            {/* 
            <li className={s.item}>
              <div>
                <RenameIcon />
                <p>Edit</p>
              </div>
            </li>
            <li className={s.item}>
              <div>
                <RollbackIcon />
                <p>Rollback</p>
              </div>
            </li> */}
          </ul>
        </ReactTooltip>
      )
    case 'response_selector':
      return (
        <ReactTooltip
          event='click'
          globalEventOff='click wheel'
          clickable={true}
          className={s.menulist}
          id='response_selector'
          place='left'
          effect='solid'>
          <ul className={s.menu}>
            <li className={s.item}>
              <div>
                <RenameIcon />
                <p>Edit</p>
              </div>
            </li>
          </ul>
        </ReactTooltip>
      )
  }
  return (
    <ReactTooltip
      event='click'
      globalEventOff='click'
      arrowColor='#fff'
      clickable={true}
      className={s.menulist}
      id='your_bot'
      place='right'
      effect='solid'>
      <ul className={s.menu}>
        <li className={s.item}>
          <div>
            <CloneIcon />
            <p>Clone Bot</p>
          </div>
        </li>
      </ul>
    </ReactTooltip>
  )
}
