import themeConfig from '../themeConfig'

export const defaultSuggestionsData = [
  {
    category: 'Important Links',
    suggestions: [
      {
        icon: 'tabler:chart-line',
        suggestion: 'GL Transaction',
        link: '/gl/transactions/list'
      },
      {
        icon: 'tabler:clipboard-list',
        suggestion: 'Purchase',
        link: '/inventory/transactions/purchase/list'
      },
      {
        icon: 'tabler:clipboard-list',
        suggestion: 'Sales',
        link: '/inventory/transactions/sale/list'
      },
      {
        icon: 'tabler:user-shield',
        suggestion: 'User',
        link: '/admin/user'
      }
    ]
  }
]

export const listingTypes = {
  HOTELS: { LISTING_TYPE_ID: 1, ROUTE: 'hotels', LABEL: 'Hotels' },
  RENTAL: { LISTING_TYPE_ID: 2, ROUTE: 'rental', LABEL: 'Rental' }

  // NEW_HOMES: { LISTING_TYPE_ID: 3, ROUTE: 'newhome', LABEL: 'New Home' },
  // HOUSE_PRICE: { LISTING_TYPE_ID: 4, ROUTE: 'houseprice', LABEL: 'House Price' },
  // AGENT_VALUATION: { LISTING_TYPE_ID: 5, ROUTE: 'agentvaluation', LABEL: 'Agent Valuation' },
  // INSTANT_VALUATION: { LISTING_TYPE_ID: 6, ROUTE: 'instantvaluation', LABEL: 'Instant Valuation' }
}

export const productTypes = {
  FURNITURE: { PRODUCT_TYPE_ID: 1, ROUTE: 'furniture', LABEL: 'Furniture' }
}

export const footerData = [
  {
    id: 1,
    text: `Sold house prices provided by Land Registry/Registers of [?] © [${
      themeConfig.templateName
    }] copyright ${new Date().getFullYear()}. Our website is completely free for you to use but we may receive a commission from some of the companies we link to on the site.`
  },
  {
    id: 2,
    text: `[${themeConfig.templateName}] Limited is an appointed representative of ????? which is authorised and regulated by the Financial Conduct Authority (??? ??????) to provide the mortgage calculator tool and incorporated with company registration number ?????????? and registered office at [address]. ????? is authorised and regulated by the Financial Conduct Authority (???) under firm reference number ?????.`
  }
]

export const radiusOptions = [
  { value: '1', label: 'This area only' },
  { value: '2', label: '+ 0.25 miles' },
  { value: '3', label: '+ 0.5 miles' },
  { value: '4', label: '+ 1 miles' },
  { value: '5', label: '+ 3 miles' },
  { value: '6', label: '+ 5 miles' },
  { value: '7', label: '+ 10 miles' },
  { value: '8', label: '+ 15 miles' },
  { value: '9', label: '+ 20 miles' },
  { value: '10', label: '+ 30 miles' },
  { value: '11', label: '+ 40 miles' }
]

export const bedsOptions = [
  { value: '0', label: 'No Limit' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10+' }
]

export const priceOptions = [
  { value: '0', label: 'No Limit' },
  { value: '10000', label: '10,000' },
  { value: '20000', label: '20,000' },
  { value: '30000', label: '30,000' },
  { value: '40000', label: '40,000' },
  { value: '50000', label: '50,000' },
  { value: '60000', label: '60,000' },
  { value: '70000', label: '70,000' },
  { value: '80000', label: '80,000' },
  { value: '90000', label: '90,000' },
  { value: '100000', label: '100,000' },
  { value: '110000', label: '110,000' },
  { value: '120000', label: '120,000' },
  { value: '125000', label: '125,000' },
  { value: '130000', label: '130,000' },
  { value: '140000', label: '140,000' },
  { value: '150000', label: '150,000' },
  { value: '160000', label: '160,000' },
  { value: '170000', label: '170,000' },
  { value: '180000', label: '180,000' },
  { value: '190000', label: '190,000' },
  { value: '200000', label: '200,000' },
  { value: '210000', label: '210,000' },
  { value: '220000', label: '220,000' },
  { value: '230000', label: '230,000' },
  { value: '240000', label: '240,000' },
  { value: '250000', label: '250,000' },
  { value: '275000', label: '275,000' },
  { value: '300000', label: '300,000' },
  { value: '325000', label: '325,000' },
  { value: '350000', label: '350,000' },
  { value: '375000', label: '375,000' },
  { value: '400000', label: '400,000' },
  { value: '425000', label: '425,000' },
  { value: '450000', label: '450,000' },
  { value: '475000', label: '475,000' },
  { value: '500000', label: '500,000' },
  { value: '550000', label: '550,000' },
  { value: '600000', label: '600,000' },
  { value: '650000', label: '650,000' },
  { value: '700000', label: '700,000' },
  { value: '750000', label: '750,000' },
  { value: '800000', label: '800,000' },
  { value: '850000', label: '850,000' },
  { value: '900000', label: '900,000' },
  { value: '950000', label: '950,000' },
  { value: '1000000', label: '1,000,000' },
  { value: '1100000', label: '1,100,000' },
  { value: '1200000', label: '1,200,000' },
  { value: '1300000', label: '1,300,000' },
  { value: '1400000', label: '1,400,000' },
  { value: '1500000', label: '1,500,000' },
  { value: '1600000', label: '1,600,000' },
  { value: '1700000', label: '1,700,000' },
  { value: '1800000', label: '1,800,000' },
  { value: '1900000', label: '1,900,000' },
  { value: '2000000', label: '2,000,000' },
  { value: '2100000', label: '2,100,000' },
  { value: '2200000', label: '2,200,000' },
  { value: '2300000', label: '2,300,000' },
  { value: '2400000', label: '2,400,000' },
  { value: '2500000', label: '2,500,000' },
  { value: '2750000', label: '2,750,000' },
  { value: '3000000', label: '3,000,000' },
  { value: '3250000', label: '3,250,000' },
  { value: '3500000', label: '3,500,000' },
  { value: '3750000', label: '3,750,000' },
  { value: '4000000', label: '4,000,000' },
  { value: '4250000', label: '4,250,000' },
  { value: '4500000', label: '4,500,000' },
  { value: '4750000', label: '4,750,000' },
  { value: '5000000', label: '5,000,000' },
  { value: '5500000', label: '5,500,000' },
  { value: '6000000', label: '6,000,000' },
  { value: '6500000', label: '6,500,000' },
  { value: '7000000', label: '7,000,000' },
  { value: '7500000', label: '7,500,000' },
  { value: '8000000', label: '8,000,000' },
  { value: '8500000', label: '8,500,000' },
  { value: '9000000', label: '9,000,000' },
  { value: '9500000', label: '9,500,000' },
  { value: '10000000', label: '10,000,000' },
  { value: '12500000', label: '12,500,000' },
  { value: '15000000', label: '15,000,000' }
]

export const propertyTypesOptions = [
  { value: '1', label: 'Show all', checked: false },
  { value: '2', label: 'Detached', checked: false },
  { value: '3', label: 'Semi-detached', checked: false },
  { value: '4', label: 'Terraced', checked: false },
  { value: '5', label: 'Flats', checked: false },
  { value: '6', label: 'Bungalows', checked: false },
  { value: '7', label: 'Farms/land', checked: false },
  { value: '8', label: 'Park homes', checked: false }
]

export const ieoOptions = [
  { value: 'i', label: 'Include' },
  { value: 'e', label: 'Exclude' },
  { value: 's', label: 'Show Only' }
]

export const mustHavesOptions = [
  { value: '1', label: 'Garden', checked: false },
  { value: '2', label: 'Parking/garage', checked: false },
  { value: '3', label: 'Balcony/terrace', checked: false }
]

export const propertyStatusOptions = [
  { value: '1', label: 'Chain-free', checked: false },
  { value: '2', label: 'Price-reduced', checked: false },
  { value: '3', label: 'Under offer/Sold STC', checked: false }
]

export const addedToSiteOptions = [
  { value: 'at', label: 'Anytime', checked: false },
  { value: '24h', label: 'Last 24 hours', checked: false },
  { value: '3d', label: 'Last 3 days', checked: false },
  { value: '7d', label: 'Last 7 days', checked: false },
  { value: '14d', label: 'Last 14 days', checked: false },
  { value: '30d', label: 'Last 30 days', checked: false }
]

export const topNavBar = {
  navLeft: [
    {
      NAV_ID: 0,
      NAV_DESCRIPTION: 'Home',
      LINK: '/home/',
      SORT_ORDER: 0,
      TYPE: 1,
      ICON: null,
      ACTIVE: true
    },
    {
      NAV_ID: 1,
      NAV_DESCRIPTION: 'Hotels',
      LINK: '/hotels/',
      SORT_ORDER: 1,
      TYPE: 1,
      ICON: null,
      ACTIVE: true
    },
    {
      NAV_ID: 2,
      NAV_DESCRIPTION: 'Rental',
      LINK: '/rentals/',
      SORT_ORDER: 2,
      TYPE: 1,
      ICON: null,
      ACTIVE: true
    },
    {
      NAV_ID: 3,
      NAV_DESCRIPTION: 'New homes',
      LINK: '/newhome/',
      SORT_ORDER: 3,
      TYPE: 1,
      ICON: null,
      ACTIVE: true
    },
    {
      NAV_ID: 4,
      NAV_DESCRIPTION: 'House prices',
      LINK: '/houseprice/',
      SORT_ORDER: 4,
      TYPE: 1,
      ICON: null,
      ACTIVE: true
    },
    {
      NAV_ID: 5,
      NAV_DESCRIPTION: 'Agent Valuation',
      LINK: '/agentvaluation/',
      SORT_ORDER: 5,
      TYPE: 1,
      ICON: null,
      ACTIVE: true
    },
    {
      NAV_ID: 6,
      NAV_DESCRIPTION: 'Instant Valuation',
      LINK: '/instantvaluation/',
      SORT_ORDER: 6,
      TYPE: 1,
      ICON: null,
      ACTIVE: true
    }
  ],
  navRight: [
    {
      NAV_ID: 7,
      NAV_DESCRIPTION: 'My Home',
      LINK: '/',
      SORT_ORDER: 1,
      TYPE: 2,
      ICON: null,
      ACTIVE: true
    },
    {
      NAV_ID: 8,
      NAV_DESCRIPTION: 'Saved',
      LINK: '/saved/',
      SORT_ORDER: 2,
      TYPE: 2,
      ICON: null,
      ACTIVE: true
    },
    {
      NAV_ID: 9,
      NAV_DESCRIPTION: 'Sign in',
      LINK: '/login',
      SORT_ORDER: 3,
      TYPE: 2,
      ICON: null,
      ACTIVE: true
    }
  ]
}

export const displayTypes = {
  DISCOVER: '1'
}

export const alertTypes = [
  { value: 1, label: 'Instant property alerts' },
  { value: 2, label: 'Daily summary emails' },
  { value: 3, label: 'Summary every 3 days' },
  { value: 4, label: 'Weekly summary emails' },
  { value: 5, label: 'No email alerts' }
]
