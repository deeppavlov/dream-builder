declare module "*.svg" {
  const ref: React.RefForwardingComponent<
    SVGSVGElement,
    React.SVGAttributes<SVGSVGElement>
  >;
  export default ref;
}
