import SeoHead from 'src/components/SeoHead'
import CommunityMapLayout from 'src/@core/layouts/CommunityMapLayout'
import { LandingCommunityMap } from 'src/views/pages/home/landing'

const CommunityMapPage = () => {
  return (
    <>
      <SeoHead
        title='Go Community Map - Find Your Community'
        description='Discover your community around the world. Connect with Japanese, Spanish, Polish, English, Brazilian, Korean and other communities worldwide.'
        canonical='https://gocommunitymap.com/community-map'
      />
      <LandingCommunityMap />
    </>
  )
}

CommunityMapPage.guestGuard = true
CommunityMapPage.getLayout = page => <CommunityMapLayout>{page}</CommunityMapLayout>

export default CommunityMapPage
