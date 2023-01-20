import ReactTooltip from 'react-tooltip'
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
import s from './MenuList.module.scss'
import { trigger } from '../../utils/events'

interface MenuListProps {
  type:
    | 'main'
    | 'bots'
    | 'skills_page'
    | 'editor'
    | 'bot_public'
    | 'your_bot'
    | 'skills'
    | 'all_annotators'
    | 'response_annotators'
    | 'all_skills'
    | 'customizable_annotator'
    | 'customizable_skill'
    | 'non_customizable_annotator'
    | 'non_customizable_skill'
    | 'skill_selector'
    | 'response_selector'
    | null
  item: any
  privateDataFor: any
}

export const MenuList = ({ type, privateDataFor, item }: MenuListProps) => {
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
                <button>About Dream Builder</button>
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
              <button>About Dream Builder</button>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>Clone Bot</button>
            </li>
            <li className={s.item}>
              <button>Add From Template</button>
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
              <button>About Dream Builder</button>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>Add Skill</button>
            </li>
            <li className={s.item}>
              <button>Add From Template</button>
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
              <button>Save</button>
            </li>
            <li className={s.item}>
              <button>Save As</button>
            </li>
            <li className={s.item}>
              <button>Rename</button>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>Add Skills</button>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>Publish</button>
            </li>
            {/* <li className={s.item}>
              <button>Download</button>
            </li> */}
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>History</button>
            </li>
            <li className={s.item}>
              <button>Delete</button>
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
                <button>
                  <CloneIcon />
                  <p>Clone Bot</p>
                </button>
              </li>
            </Link> */}
            <li className={s.item}>
              <button>
                <PropertiesIcon />
                <p>Properties</p>
              </button>
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
              <button>
                <RenameIcon />
                <p>Rename</p>
              </button>
            </li>
            {/* <li className={s.item}>
              <button>
                <PropertiesIcon />
                <p>Properties</p>
              </button>
            </li> */}
            <li className={s.item}>
              <button>
                <PublishIcon />
                <p>Publish</p>
              </button>
            </li>
            {/* <li className={s.item}>
              <button>
                <DownloadIcon />
                <p>Download</p>
              </button>
            </li> */}
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>
                <DeleteIcon />
                <p>Delete</p>
              </button>
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
              <button>
                <AddIcon />
                <p>Add Skill</p>
              </button>
            </li>
            <li className={s.item}>
              <button>
                <PropertiesIcon />
                <p>Properties</p>
              </button>
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
              <button>
                <AddIcon />
                <p>Add Annotators</p>
              </button>
            </li>
            <li className={s.item}>
              <button>
                <DisableIcon />
                <p>Disable All Annotators</p>
              </button>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>
                <DeleteIcon />
                <p>Delete All Annotators</p>
              </button>
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
              <button>
                <AddIcon />
                <p>Add Annotators</p>
              </button>
            </li>
            <li className={s.item}>
              <button>
                <DisableIcon />
                <p>Disable All Annotators</p>
              </button>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>
                <DeleteIcon />
                <p>Delete All Annotators</p>
              </button>
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
              <button>
                <AddIcon />
                <p>Add Skills</p>
              </button>
            </li>
            <li className={s.item}>
              <button>
                <DisableIcon />
                <p>Disable All Skills</p>
              </button>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>
                <DeleteIcon />
                <p>Delete All Skills</p>
              </button>
            </li>
          </ul>
        </ReactTooltip>
      )
    case 'customizable_annotator':
      const MenuTT = () => (
        <ul className={s.menu}>
          <li className={s.item}>
            <button
              onClick={() => {
                switch (item.typeItem) {
                  case 'Intent Catcher':
                    trigger('IntentCatcherSidePanel', item.data)
                    break
                  default:
                    break
                }
              }}>
              <RenameIcon />
              <p>Edit Annotator</p>
            </button>
          </li>
          {/* <li className={s.item}>
            <button>
              <DisableIcon />
              <p>Disable Annotator</p>
            </button>
          </li> */}
          <li className={s.item}>
            <button onClick={() => trigger('AnnotatorsSidePanel', {})}>
              <PropertiesIcon />
              <p>Properties</p>
            </button>
          </li>
          {/* <hr style={{ border: '0.8px solid #8D96B5' }} />
          <li className={s.item}>
            <button>
              <DeleteIcon />
              <p>Delete</p>
            </button>
          </li> */}
        </ul>
      )
      return (
        <ReactTooltip
          event='click'
          globalEventOff='wheel'
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
          <li className={s.item}>
            <button
              onClick={() => {
                switch (item?.typeItem) {
                  case 'Dff Intent Responder Skill':
                    console.log(item, type)
                    trigger('IntentResponderSidePanel', item.data)
                    break
                  case 'Dialogpt':
                    trigger('SkillPromptModal', {
                      isEditingModal: true,
                      skill: item.data,
                    })
                    break
                  case 'Dialogpt Persona Based':
                    trigger('SkillPromptModal', {
                      isEditingModal: true,
                      skill: item.data,
                    })
                    break
                  default:
                    break
                }
              }}>
              <RenameIcon />
              <p>Edit Skill</p>
            </button>
          </li>
          <li className={s.item}>
            <button onClick={() => trigger('SkillSidePanel', {})}>
              <PropertiesIcon />
              <p>Properties</p>
            </button>
          </li>
          <li className={s.item}>
            <button>
              <DisableIcon />
              <p>Disable Skill</p>
            </button>
          </li>
          {/* <li className={s.item}>
            <button>
              <DownloadIcon />
              <p>Download</p>
            </button>
          </li> */}
          <hr style={{ border: '0.8px solid #8D96B5' }} />
          <li className={s.item}>
            <button>
              <DeleteIcon />
              <p>Delete</p>
            </button>
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
              <button>
                <DisableIcon />
                <p>Disable Annotator</p>
              </button>
            </li> */}
            <li className={s.item}>
              <button>
                <PropertiesIcon />
                <p>Properties</p>
              </button>
            </li>
            {/* <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>
                <DeleteIcon />
                <p>Delete</p>
              </button>
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
              <button>
                <DisableIcon />
                <p>Disable Skill</p>
              </button>
            </li>
            <li className={s.item}>
              <button>
                <PropertiesIcon />
                <p>Properties</p>
              </button>
            </li>
            <hr style={{ border: '0.8px solid #8D96B5' }} />
            <li className={s.item}>
              <button>
                <DeleteIcon />
                <p>Delete</p>
              </button>
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
              <button>
                <PropertiesIcon />
                <p>Properties</p>
              </button>
            </li>
            {/* 
            <li className={s.item}>
              <button>
                <RenameIcon />
                <p>Edit</p>
              </button>
            </li>
            <li className={s.item}>
              <button>
                <RollbackIcon />
                <p>Rollback</p>
              </button>
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
              <button>
                <RenameIcon />
                <p>Edit</p>
              </button>
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
          <button>
            <CloneIcon />
            <p>Clone Bot</p>
          </button>
        </li>
      </ul>
    </ReactTooltip>
  )
}
