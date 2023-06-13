/// <reference types="vite/client" />

declare module '*.module.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}
declare module '*.png' {
  const value: any
  export = value
}
declare module '*.svg' {
  const value: any
  export = value
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
