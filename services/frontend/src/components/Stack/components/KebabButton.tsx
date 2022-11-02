import styles from "./KebabButton.module.scss"
export const KebabButton = () => {
  return (
    <div className={styles.kebab}>
      <figure className={styles.dots}></figure>
      <figure className={styles.dots}></figure>
      <figure className={styles.dots}></figure>
    </div>
  )
}
