// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from './admin/user'
import role from './admin/role'
import news from './website/news'
import nav from './website/nav'
import sections from './website/sections'
import hotels from './guest/property/hotels'
import rental from './guest/property/rental'
import bedrooms from './website/bedrooms'
import bathrooms from './website/bathrooms'
import councilTaxBand from './website/council-tax-band'
import floors from './website/floors'
import listingStatus from './website/listing-status'
import priceModifier from './website/price-modifier'
import receptions from './website/receptions'
import siteStatus from './website/site-status'
import tenure from './website/tenure'
import units from './website/units'
import contentType from './website/content-type'
import utilityType from './website/utility-type'
import usingPlanningType from './website/using-planning-type'
import features from './website/features'
import utilities from './website/utilities'
import usingPlanning from './website/using-planning'
import featureType from './website/feature-type'
import propertySetupHotels from './website/property-setup-hotels'
import propertySetupRental from './website/property-setup-rentals'
import productSetup from './website/product-setup'
import rentalFrequency from './website/rental-frequency'
import lettingArrangements from './website/letting-arrangements'
import lettingsDeposit from './website/lettings-deposit'
import feeApply from './website/fee-apply'
import furnished from './website/furnished'

import propertyTypes from './website/property-types'
import roomType from './website/room-type'
import bedType from './website/bed-type'
import hotelType from './website/hotel-type'
import timeSlot from './website/time-slot'
import mealPlan from './website/meal-plan'
import cancellationPolicy from './website/cancellation-policy'
import nearbyIcon from './website/nearby-icon'
import propertyRules from './website/property-rules'
import propertyFaq from './website/property-faq'
import roomFaq from './website/room-faq'
import roomDetail from './website/room-detail'
import communityRegions from './website/community-regions'
import communities from './website/communities'

export * from './navigation/vertical'

export * from './permissions'

export * from './admin/user'

export * from './admin/role'

export * from './website/news'

export * from './website/nav'

export * from './website/sections'

export * from './website/bedrooms'

export * from './website/bathrooms'

export * from './website/council-tax-band'

export * from './website/floors'

export * from './website/listing-status'

export * from './website/price-modifier'

export * from './website/receptions'

export * from './website/site-status'

export * from './website/tenure'

export * from './website/units'

export * from './website/content-type'

export * from './website/feature-type'

export * from './website/features'

export * from './website/utilities'

export * from './website/using-planning'

export * from './website/utility-type'

export * from './website/using-planning-type'

export * from './website/property-setup-hotels'

export * from './website/property-setup-rentals'

export * from './website/product-setup'

export * from './website/property-types'

export * from './guest/property/hotels'

export * from './guest/property/rental'

export * from './website/rental-frequency'

export * from './website/letting-arrangements'

export * from './website/lettings-deposit'

export * from './website/fee-apply'

export * from './website/furnished'

export * from './website/room-type'

export * from './website/bed-type'

export * from './website/hotel-type'

export * from './website/time-slot'

export * from './website/meal-plan'

export * from './website/cancellation-policy'

export * from './website/nearby-icon'

export * from './website/property-rules'

export * from './website/property-faq'

export * from './website/room-faq'

export * from './website/room-detail'

export * from './website/community-regions'

export * from './website/communities'

export const store = configureStore({
  reducer: {
    user,
    role,
    news,
    nav,
    sections,
    hotels,
    rental,
    bedrooms,
    bathrooms,
    councilTaxBand,
    floors,
    listingStatus,
    priceModifier,
    receptions,
    siteStatus,
    tenure,
    units,
    contentType,
    featureType,
    utilityType,
    usingPlanningType,
    features,
    utilities,
    usingPlanning,
    propertyTypes,
    propertySetupHotels,
    propertySetupRental,
    productSetup,
    rentalFrequency,
    lettingArrangements,
    lettingsDeposit,
    feeApply,
    furnished,
    roomType,
    bedType,
    hotelType,
    timeSlot,
    mealPlan,
    cancellationPolicy,
    nearbyIcon,
    propertyRules,
    propertyFaq,
    roomFaq,
    roomDetail,
    communityRegions,
    communities
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
