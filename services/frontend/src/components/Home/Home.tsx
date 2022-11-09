import { Link } from 'react-router-dom'
import Avatar_1 from '../../assets/images/comments_avatar(1).png'
import Avatar_2 from '../../assets/images/comments_avatar(2).png'
import Avatar_3 from '../../assets/images/comments_avatar(3).png'
import Avatar_4 from '../../assets/images/comments_avatar(4).png'
import { Comment } from './components/Comment'
import s from './Home.module.scss'

export const Home = () => {
  return (
    <>
      <div className={s.home}>
        <div className={s.left}>
          <h6>Build virtual assistatn as you used to play lego</h6>
          <div className={s.info}>
            <h2>
              Your Virtual
              <br />
              Assistant Platform
            </h2>
            <p>
              The Best Way to Develop Your <br />
              Virtual Assistant or Chat Bot
            </p>
            <div className={s.btns}>
              <Link to='/start'>
                <button className={s.db}>Explore Assistants</button>
              </Link>
              <button className={s.watch}>Start Building</button>
            </div>
          </div>
        </div>
        <div className={s.right}>
          <div className={s.circle}>
            <Comment
              avatar={Avatar_1}
              width='297px'
              height='76px'
              radius='12px'
              text='Hi, want to find a new book Whatll you suggest me?'
              right='254px'
              top='-33px'
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
              text='Wanna coffee, can you find coffee shop for me?'
              right='265px'
              top='87px'
              imgSize='40px'
              padding='8px'
              gap='5px'
            />
            <Comment
              avatar={Avatar_3}
              width='212px'
              height='53px'
              radius='8px'
              text='Where the nearest hospital?'
              right='-59px'
              top='245px'
              imgSize='40px'
              padding='8px'
              gap='5px'
            />
            <Comment
              avatar={Avatar_4}
              width='184px'
              height='76px'
              radius='12px'
              text='Alexa prize'
              top='390px'
              right='128px'
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
