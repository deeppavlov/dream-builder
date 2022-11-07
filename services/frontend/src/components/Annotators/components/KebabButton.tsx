import styles from './KebabButton.module.scss'
export const KebabButton = () => {
  return (
    <button className={styles.kebab}>
      <figure className={styles.dots}></figure>
      <figure className={styles.dots}></figure>
      <figure className={styles.dots}></figure>
    </button>
  )
}
