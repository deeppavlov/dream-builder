import s from "./Banner.module.scss"

export const Banner = () => {
  return (
    <div className={s.modalWindow}>
      <div className={s.header}>
        <h2>
          Welcome To <span className={s.accentText}> Dream Builder </span>
          Console!
        </h2>
        <button className={s.close}></button>
      </div>
      <div className={s.body}>
        <p className={s.info}>
          Now you can build and manage bots with more ease
        </p>
        <ul>
          <li>🤖</li>
          <li>👾</li>
          <li>💻</li>
          <li>💾</li>
          <li>🧑‍💻</li>
        </ul>
      </div>
    </div>
  )
}
