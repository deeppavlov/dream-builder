import s from './Comment.module.scss'

export const Comment = (props: any) => {
  return (
    <div
      style={{
        width: `${props.width}`,
        height: `${props.height}`,
        borderRadius: `${props.radius}`,
        left: `${props.left}`,
        right: `${props.right}`,
        top: `${props.top}`,
        border: `${props.border}`,
        padding: `${props.padding}`,
        gap: `${props.gap}`,
        boxShadow: `${props.boxShadow}`,
      }}
      className={s.comment}>
      <img
        style={{
          width: `${props.imgSize}`,
          height: `${props.imgSize}`,
        }}
        src={props.avatar}></img>
      <p
        style={{
          fontSize: `${props.fontSize}`,
          lineHeight: `${props.lineHeight}`,
          color: `${props.color}`,
        }}>
        {props.text}
      </p>
    </div>
  )
}
