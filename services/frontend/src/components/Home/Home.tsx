import { Link } from 'react-router-dom'
import Avatar_1 from '../../assets/images/comments_avatar(1).png'
import Avatar_2 from '../../assets/images/comments_avatar(2).png'
import Avatar_3 from '../../assets/images/comments_avatar(3).png'
import Avatar_4 from '../../assets/images/comments_avatar(4).png'
import Robot from '../../assets/images/robot.png'
import RobotCM from '../../assets/images/robot_comments.png'
import { Comment } from './components/Comment'
import s from './Home.module.scss'

export const Home = () => {
  return (
    <>
      <div className={s.home}>
        <div className={s.left}>
          <p className={s.description}>
            Build virtual assistant as you used to play lego
          </p>
          <div className={s.info}>
            <h1>
              Your Virtual
              <br />
              Assistant Platform
            </h1>
            <p>
              The best way to develop your <br />
              <span className={s.underline}> virtual assistant</span> or{' '}
              <span className={s.underline}> chat bot</span>
            </p>
          </div>
          <div className={s.btns_area}>
            <Link to='/start'>
              <button className={s.explore}>Explore Assistants</button>
            </Link>
            <Link to='/editor'>
              <button className={s.start}>Start Building</button>
            </Link>
          </div>
        </div>
        <div className={s.right}>
          <div className={s.circle}>
            <img className={s.robot} src={Robot} />
            <Comment
              avatar={Avatar_1}
              width='297px'
              height='76px'
              radius='12px'
              text="Hi, want to find a new book What'll you suggest me?"
              right='290px'
              top='53px'
              imgSize='60px'
              fontWeight='600'
              fontSize='16px'
              lineHeight='160%'
              color='#3300ff'
            />
            <Comment
              avatar={Avatar_2}
              width='205px'
              height='53px'
              radius='8px'
              text='Wanna coffee, can you find coffee shop close to me?'
              right='311px'
              top='173px'
              imgSize='40px'
              padding='6px 8px 6px 6px'
              gap='5px'
              boxShadow='0px 0px 13.6393px rgba(100, 99, 99, 0.15);'
            />
            <Comment
              avatar={Avatar_3}
              width='212px'
              height='53px'
              radius='8px'
              text="Where's the nearest hospital?"
              right='-39px'
              top='331px'
              imgSize='40px'
              padding='5px 8px 5px 5px'
              gap='5px'
              boxShadow='0px 0px 13.6393px rgba(100, 99, 99, 0.15);'
            />
            <Comment
              avatar={Avatar_4}
              width='184px'
              height='76px'
              radius='12px'
              text='Alexa prize'
              top='575px'
              right='154px'
              border='1px solid #FFCC00'
              imgSize='60px'
              fontSize='16px'
              lineHeight='160%'
              color='rgba(0, 0, 0, 0.9'
            />
          </div>
        </div>
      </div>
    </>
  )
}
