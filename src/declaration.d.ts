declare module "*.png" {
  const ref: string
  export default ref
}

declare module "*.jpg" {
  const ref: string
  export default ref
}

declare module "*.svg" {
  const ref: React.RefForwardingComponent<
    SVGSVGElement,
    React.SVGAttributes<SVGSVGElement>
  >
  export default ref
}
