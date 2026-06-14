import SeoHead from 'src/components/SeoHead'
import CommunityMapLayout from 'src/@core/layouts/CommunityMapLayout'
import { LandingCommunityMap } from 'src/views/pages/home/landing'
import themeConfig from 'src/configs/themeConfig'

const CommunityMapPage = () => {
  return (
    <>
      <SeoHead
        title={`${themeConfig.templateName} - Find Your Community`}
        description='Discover your community around the world. Connect with Japanese, Spanish, Polish, English, Brazilian, Korean and other communities worldwide.'
        canonical='https://gocommunitymap.com/community-map'
      />
      <LandingCommunityMap />
    </>
  )
}

CommunityMapPage.guestGuard = true

// CommunityMapPage.getLayout = page => <CommunityMapLayout>{page}</CommunityMapLayout>

export default CommunityMapPage
