import { useDynamicSvgImport } from '../../hooks/useDynamicSVGImport'

interface IProps {
  iconName: string
  // wrapperStyle?: string
  svgProp?: React.SVGProps<SVGSVGElement>
}

function SvgIcon(props: IProps) {
  const { iconName, svgProp } = props
  const { loading, SvgIcon } = useDynamicSvgImport(iconName)

  return (
    <>
      {/* {loading && <></>} */}
      {SvgIcon && <SvgIcon {...svgProp} />}
    </>
  )
}

export default SvgIcon
