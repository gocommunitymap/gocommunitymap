import { useRouter } from 'next/router'
import { themeConfig } from 'src/configs/themeConfig'

const CompanyLogo = props => {
  const { style, width = 30 } = props
  const { replace } = useRouter()

  return (
    <div {...props}>
      <img
        src='/images/logo.png'
        width={width}
        style={{ ...style, borderRadius: 10 }}
        title={themeConfig?.companyName}
        alt={themeConfig?.companyName}
      />
    </div>
  )
}

export default CompanyLogo
