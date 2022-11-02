declare module "*.scss" {
  const styles: { [className: string]: string }
  export default styles
}
declare module "*.png" {
  const value: any
  export = value
}
declare module '*.svg' {
  const value: any
  export = value
}