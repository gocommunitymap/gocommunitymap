/**
 *  Set Home URL based on User Type
 * User Type A (Admin)
 * User Type B (Agent)
 */
const getHomeRoute = role => {

  if (userType === 'A') return '/admin-dashboard'
  else return '/agent-dashboard'
}

export default getHomeRoute
