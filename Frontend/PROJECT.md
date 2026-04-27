# GoCommunityMap — Project Intelligence File

> **Purpose for AI Agents:** Read this file at the start of every session to understand the full project context before making any changes. Do not guess; everything is documented here.

---

## 1. WHAT THIS PROJECT IS

A **property discovery and booking platform** (Next.js 14 / React 18) that covers:

- Hotel search, detail, and booking flow
- Rental property listings
- New homes, house price research
- Community map (neighborhoods worldwide)
- Agent valuation & instant valuation tools
- Admin CMS for all content and configuration

**Stack:** Next.js 14 · React 18 · Redux Toolkit · MUI 5 · react-hook-form · axios · Google Maps API · crypto-js · jwt-decode

---

## 2. FOLDER MAP (what lives where)

```
src/
├── @core/           # Framework: hooks, layouts, context, utils, theme, styles
├── components/      # Global minimal shared (SeoHead.js only)
├── configs/         # API URLs, HTTP clients, auth config, constant data, service methods
│   └── services/
│       ├── api-url.js            # Every endpoint URL constant
│       ├── constant-data.js      # listingTypes, radiusOptions, bedsOptions, priceOptions
│       └── api-methods/
│           ├── admin.js          # User, Role, Nav, Permissions
│           ├── guest.js          # Property search, sections, valuations
│           ├── website.js        # All CMS (news, sections, property setup, rooms, global params)
│           ├── password-management.js
│           └── fileProcess.js    # Upload/download/delete files
├── context/         # AuthContext.js — login/logout/token refresh
├── hooks/           # useAuth.js
├── layouts/         # UserLayout, horizontal/vertical nav components, LoginModal
├── navigation/
│   └── vertical/index.js   # Currently only 2 items (Home + Second Page)
├── pages/           # Next.js file-based routes (see Section 4)
├── store/           # Redux store + all slices (see Section 7)
└── views/           # Feature components by page (see Section 6)

styles/globals.css
mail-template/       # HTML email templates (registration, reset, invoice, etc.)
public/images/       # Static images (agent/, avatars/, banners/, logos/, properties/, etc.)
```

---

## 3. TECH DEPENDENCIES (key ones)

| Package                                         | Purpose                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| `@mui/material` 5.15.19                         | Component library — use this for all UI             |
| `@reduxjs/toolkit` 1.9.7                        | State management                                    |
| `react-hook-form` 7.51.5                        | All forms                                           |
| `axios` 1.7.2                                   | HTTP requests                                       |
| `@react-google-maps/api` 2.19.3                 | Maps (Map component at `src/views/components/map/`) |
| `react-google-maps`                             | `withScriptjs/withGoogleMap` wrappers               |
| `crypto-js` 4.2.0                               | Encrypt/decrypt user data in localStorage           |
| `jwt-decode` 4.0.0                              | Parse JWT tokens                                    |
| `react-hot-toast` 2.4.1                         | Toast notifications                                 |
| `@casl/react` + `@casl/ability`                 | Fine-grained permissions                            |
| `@mui/lab`                                      | `LoadingButton`                                     |
| `@iconify/react` + `src/@core/components/icon`  | Icons — always use `tabler:*` prefix                |
| `@stripe/stripe-js` + `@stripe/react-stripe-js` | Stripe payment — hotel booking payment page         |

---

## 4. PAGES & ROUTES

### Public/Guest Pages

| Route                     | File                                       | SSR? | Purpose                                                                        |
| ------------------------- | ------------------------------------------ | ---- | ------------------------------------------------------------------------------ |
| `/home`                   | `src/pages/home/index.js`                  | CSR  | Main landing: hotel/rental cards, hero search, filter sidebar, map toggle      |
| `/hotels`                 | `src/pages/hotels/index.js`                | SSR  | Hotel marketing page: sections, news, discover                                 |
| `/hotels/properties/[id]` | `src/pages/hotels/properties/[id].js`      | SSR  | Hotel detail: tabs (Overview / Options & Price / Facilities / Rules / Reviews) |
| `/hotels/booking/details` | `src/pages/hotels/booking/details.js`      | CSR  | Booking form (guest info, arrival time) — **NO submit API yet**                |
| `/rentals`                | `src/pages/rentals/index.js`               | SSR  | Rental marketing page                                                          |
| `/newhome`                | `src/pages/newhome/index.js`               | SSR  | New homes page                                                                 |
| `/houseprice`             | `src/pages/houseprice/index.js`            | SSR  | House price research                                                           |
| `/com-hotels`             | `src/pages/com-hotels/index.js`            | SSR  | Commercial hotels                                                              |
| `/com-rentals`            | `src/pages/com-rentals/index.js`           | SSR  | Commercial rentals                                                             |
| `/community-map`          | `src/pages/community-map/index.js`         | CSR  | Community map — **structure only, no real data**                               |
| `/furniture-marketplace`  | `src/pages/furniture-marketplace/index.js` | CSR  | **COMING SOON placeholder**                                                    |
| `/agentvaluation`         | `src/pages/agentvaluation/index.js`        | CSR  | Agent valuation request form                                                   |
| `/instantvaluation`       | `src/pages/instantvaluation/index.js`      | CSR  | Instant valuation form                                                         |
| `/saved`                  | `src/pages/saved/index.js`                 | CSR  | User's saved properties                                                        |
| `/account`                | `src/pages/account/index.js`               | CSR  | Profile, password change, saved items                                          |
| `/savedsearch`            | `src/pages/savedsearch/index.js`           | CSR  | Saved searches with alerts                                                     |
| `/terms`                  | `src/pages/terms/index.js`                 | CSR  | **Under Development**                                                          |
| `/privacy`                | `src/pages/privacy/index.js`               | CSR  | Privacy Policy (Lorem ipsum)                                                   |
| `/cookies-setings`        | `src/pages/cookies-setings/index.js`       | CSR  | **Under Development**                                                          |

### Auth Pages

| Route              | File                                 | Purpose                                      |
| ------------------ | ------------------------------------ | -------------------------------------------- |
| `/login`           | `src/pages/login/index.js`           | Login form — calls `AuthContext.handleLogin` |
| `/register`        | `src/pages/register/index.js`        | Registration (Landlord=2 / Agent=3)          |
| `/forgot-password` | `src/pages/forgot-password/index.js` | Request reset email                          |
| `/reset-password`  | `src/pages/reset-password/index.js`  | New password with token                      |

### Admin Pages

| Route                     | File                                        | Purpose                   |
| ------------------------- | ------------------------------------------- | ------------------------- |
| `/admin/user`             | `src/pages/admin/user/index.js`             | User CRUD                 |
| `/admin/role`             | `src/pages/admin/role/index.js`             | Role & permissions matrix |
| `/admin/applicationsetup` | `src/pages/admin/applicationsetup/index.js` | Company + app settings    |

### Website (CMS) Pages — all under `/website/*`

```
news, nav, discover-section, sections, features, utilities, using-planning,
property-setup-hotels, property-setup-rentals, room-detail (rooms admin),
agentsubscription,
+ 40+ global parameter forms:
  bedrooms, bathrooms, floors, receptions, units, council-tax-band,
  listing-status, price-modifier, site-status, tenure, bed-type,
  content-type, feature-type, furnished, hotel-faq, hotel-type,
  house-rule, meal-plan, nearby-icon, property-faq, property-rules,
  property-setup-hotels-com, property-setup-rentals-com, property-types,
  room-faq, room-type, time-slot, trade-type, service-type,
  using-planning-type, utility-type, rental-frequency, fee-apply,
  cancellation-policy, agent-approval, agent-valuation-list,
  instant-valuation-list
```

---

## 5. API LAYER

### Base config — `src/configs/services/api-url.js`

```
/api/          → main prefix
/auth/         → auth prefix
/fileprocess/  → file upload prefix
```

### Key API Groups

#### Auth

```
POST /auth/GenerateToken          → login (returns token, refresh_token, usercode, user_type)
POST /auth/TokenRevoke            → logout
POST /auth/AuthenticateValidToken → validate + refresh token
```

#### Guest / Property Search

```
GET  /Navbar/GetNavbar                  → site navigation (type 1=header, 2=footer, 3=both)
GET  /Sections/GetSections              → landing page sections (DISPLAY_TYPE param)
GET  /DiscoverSection/GetDiscoverSection → featured/discover cards
GET  /Guest/GetProperties               → property list (LISTING_TYPE_ID=1 hotels, 2=rental…)
GET  /Guest/GetPropertiesFullDetails    → full detail for one property
GET  /Rooms/GetRooms                    → room list for a property (needs PROPERTY_ID + usercode:0)
GET  /Guest/GetPlacesByPostCode         → location autocomplete
GET  /Guest/GetAgentInfo                → agent profile
GET  /Guest/GetAgentList                → agent directory
GET  /Guest/GetPropertiesByUser         → user's saved/listed properties
GET  /News/GetNews                      → news articles
GET  SavedLinks/GetSavedLinks           → user's saved searches/properties
POST SavedLinks/PostSavedLinks          → save property/search
DELETE SavedLinks/DeleteSavedLinks      → remove saved item
```

#### Rooms (Hotel Rooms CRUD)

```
GET    /Rooms/GetRooms        → PROPERTY_ID param; IMPORTANT: add usercode:0 in params
POST   /Rooms/CreateRoom      → create room
POST   /Rooms/UpdateRoom      → update room
DELETE /Rooms/DeleteRoom      → delete room
```

**⚠️ GOTCHA:** `serverGetRaw` does NOT add `usercode:0`. Use `serverGet` (adds `usercode:0, active:true` via `guestDefaults`) when fetching rooms, or fallback to it if `serverGetRaw` returns empty.

#### Property Setup (Admin)

```
GET  /SetProperties/GetProperty    → list properties (filter by LISTING_TYPE_ID)
POST /SetProperties/CreateProperty → create hotel/rental etc.
POST /SetProperties/UpdateProperty → update
```

#### Users & Roles

```
GET/POST /SetUsers/GetUsers|CreateUsers|UpdateUsers|DeleteUsers
POST     /SetUsers/ChangePassword
GET      /Role/GetRole|GetRoleMaster
POST     /Role/CreateRole|UpdateRole
DELETE   /Role/DeleteRole
```

#### Valuations

```
POST /AgentValuation/CreateAgentValuation   → agent valuation request
GET  /AgentValuation/GetAgentValuation      → list
POST /InstantValuation/CreateInstantValuation → instant valuation
GET  /InstantValuation/GetInstantValuation    → list
```

#### Password Management

```
POST /ForgotPassword
GET  /GetResetRequest    → validate token
POST /ResetPassword
```

#### Files

```
GET    /fileprocess/GetFile
POST   /fileprocess/UploadFile
DELETE /fileprocess/DeleteFile
```

#### Global Parameters

```
GET    /GlobalParameters/GetGlobalParameters
POST   /GlobalParameters/CreateGlobalParameters
POST   /GlobalParameters/UpdateGlobalParameters
DELETE /GlobalParameters/DeleteGlobalParameters
```

### HTTP Client helpers (`src/configs/clientConfig.js` or services)

- `serverGet(url, params)` — adds `guestDefaults` (`usercode:0, active:true`) automatically
- `serverGetRaw(url, params)` — raw GET, no defaults added
- Always prefer `serverGet` for guest-facing calls that need `usercode`

---

## 6. VIEWS / COMPONENTS STRUCTURE

### Hotel Detail Views — `src/views/pages/hotels/detail/`

| File                        | Purpose                  | Data Source                                                                |
| --------------------------- | ------------------------ | -------------------------------------------------------------------------- |
| `index.js`                  | Orchestrator, tab layout | SSR props                                                                  |
| `PropertyHighlights.js`     | Top feature badges       | `PROPERTY_FEATURES` JSON                                                   |
| `PropertyAbout.js`          | Description + key info   | `SUMMARY`, `FULLDESCRIPTION`                                               |
| `PropertyFacilitiesCard.js` | Full amenities grid      | `PROPERTY_FEATURES`, `PROPERTY_UTILITIES`                                  |
| `PropertyHost.js`           | Agent/owner info         | `AGENT_NAME`, `AGENT_BIO`                                                  |
| `PropertyImportantInfo.js`  | Check-in/out, policies   | `CHECK_IN_TIME`, `CHECK_OUT_TIME`, `IMPORTANT_INFO`                        |
| `PropertyMapCard.js`        | Embedded map             | `LATITUDE`, `LONGITUDE`, `MAP_URL`                                         |
| `PropertyFAQ.js`            | FAQs                     | `PROPERTY_FAQS` JSON                                                       |
| `PropertyReviews.js`        | Reviews + ratings        | **⚠️ DUMMY DATA** — `defaultReviews` hardcoded                             |
| `PropertyBookingWidget.js`  | Booking sidebar          | URL query params                                                           |
| `PropertyHouseRules.js`     | House rules list         | API: `RULE`/`NOTE` fields (uppercase); fallback `item.RULE \|\| item.rule` |

### Hotel Detail Tabs — `src/views/pages/properties/details/tabs/`

| Tab             | Component                                   | Data                 |
| --------------- | ------------------------------------------- | -------------------- |
| Overview        | `Overview.js`                               | Property summary     |
| Options & Price | `OptionAndPrice.js` → `RoomsDetailTable.js` | Real API rooms data  |
| Facilities      | `Facilities.js`                             | Features + utilities |
| Rules           | `Rules.js`                                  | House rules          |
| Reviews         | `Reviews.js`                                | **Dummy data**       |

### RoomsDetailTable — `src/views/pages/properties/RoomsDetailTable.js`

**Fully updated**, shows API fields:

- `ROOM_ID`, `SUMMARY`, `PRICE`, `MAX_GUESTS`, `ROOMS_QUENTITY` (note spelling — backend uses QUENTITY not QUANTITY)
- `MEAL_PLAN`, `CANCELLATION_POLICY` (looked up via `getGlobalParametersLOV`)
- `ROOM_FEATURES` (parsed JSON), `ROOM_PICTURE_LINKS` (parsed JSON)
- Uses `serverGet` fallback for usercode issue

### Room Admin Form — `src/views/pages/website/property-setup-hotels/RoomDetailSection.js`

Fields: `SUMMARY`, `FULLDESCRIPTION`, `PRICE`, `MAX_GUESTS`, `ROOMS_QUENTITY`, `MEAL_PLAN`, `CANCELLATION_POLICY`, `BED_TYPE`, `BATHROOMS`, `SIZE`, `UNITS`

### Landing Components — `src/views/pages/home/landing/`

| File                         | Purpose                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| `LandingHeroSearch.js`       | Hero search bar (dates, guests, location)                                   |
| `LandingFilterSidebar.js`    | Left filter panel                                                           |
| `LandingPropertySections.js` | Property card grid + `StayCard` + `StarRating` + `MapModal`                 |
| `LandingMapView.js`          | Full-map view toggle                                                        |
| `LandingCommunityMap.js`     | Community map (partially built)                                             |
| `data.js`                    | ⚠️ DUMMY DATA — filter configs, dummy rental sections, countries, locations |

### Shared Components — `src/views/components/` (exported via `index.js`)

```javascript
import { Modal, StarRating, MapModal, SaveToggle, PropertyDetailHeader, ... } from 'src/views/components'
```

| Component              | File                    | Purpose                                                                                                |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `StarRating`           | `ratings/`              | 5-star display, accepts `value` + `showValue` props                                                    |
| `MapModal`             | `map-modal/index.js`    | Map in a dialog; props: `open, onClose, title, subtitle, lat, lng, mapUrl`                             |
| `Map`                  | `map/index.js`          | Google Map embed; props: `data{LATITUDE,LONGITUDE,MAP_URL}, height, width, zoom` — **zoom prop added** |
| `SaveToggle`           | `SaveToggle/`           | Heart icon save/unsave                                                                                 |
| `PropertyDetailHeader` | `PropertyDetailHeader/` | Hotel page header                                                                                      |
| `Modal`                | `modal/modal.js`        | Base modal                                                                                             |

---

## 7. REDUX STORE

### Store file: `src/store/index.js`

#### Admin Slices

```
user    → src/store/admin/user/
role    → src/store/admin/role/
```

#### Guest/Property Slices

```
hotels          → getHotels         (LISTING_TYPE_ID=1)
rental          → getRental         (LISTING_TYPE_ID=2)
newhomes        → getNewHomes
houseprice      → getHousePrice
agentvaluation  → createForagentvaluation
instantvaluation → createForvaluation
savedproperties → getPropertiesByUser
rental-com      → getRentalCom
hotels-com      → getHotelsCom
```

#### Website/CMS Slices

```
news, nav, discover-section, sections, features, utilities, using-planning
propertySetupHotels, propertySetupRental
```

#### 40+ Global Parameter Slices

All follow identical pattern:

```javascript
initialState: { data: [], total: 1, params: {}, allData: [] }
// thunks: getXxx, updateXxx, deleteXxx (and createXxx where applicable)
```

---

## 8. AUTH SYSTEM

**File:** `src/context/AuthContext.js`

### Token Storage

- User data encrypted with `crypto-js` → stored in `localStorage`
- Functions: `encUserData(data)`, `decUserData(encrypted)`
- Object shape: `{ usercode, fullName, email, userType, roleName, token, refreshToken }`

### Flow

1. App load → `initAuth()` → reads localStorage → calls `TOKEN_VERIFY` → set user or logout
2. Login → POST `/auth/GenerateToken` → encrypt → store → redirect
3. Logout → POST `/auth/TokenRevoke` → clear localStorage + cookies → `/home`
4. Auto-refresh: `onTokenExpiration: 'refreshToken'` (configured)

### User Types

```
1 = Unknown
2 = Landlord
3 = Agent
```

### Guards

- `authGuard: true` on page config → requires login
- `guestGuard: true` on page config → redirect if logged in

### `useAuth()` hook

```javascript
const { user, login, logout } = useAuth()
// user: { usercode, fullName, email, userType, roleName, token }
```

---

## 9. LISTING TYPE IDs (critical constants)

```javascript
// src/configs/services/constant-data.js
listingTypes = {
  HOTELS:            { LISTING_TYPE_ID: 1, ROUTE: 'hotels',           LABEL: 'Hotels' }
  RENTAL:            { LISTING_TYPE_ID: 2, ROUTE: 'rental',           LABEL: 'Rental' }
  NEW_HOMES:         { LISTING_TYPE_ID: 3, ROUTE: 'newhome',          LABEL: 'New Home' }
  HOUSE_PRICE:       { LISTING_TYPE_ID: 4, ROUTE: 'houseprice',       LABEL: 'House Price' }
  AGENT_VALUATION:   { LISTING_TYPE_ID: 5, ROUTE: 'agentvaluation',   LABEL: 'Agent Valuation' }
  INSTANT_VALUATION: { LISTING_TYPE_ID: 6, ROUTE: 'instantvaluation', LABEL: 'Instant Valuation' }
}
```

**DISPLAY_TYPE** (used for sections/discover):

```
Hotels=2, Rentals=3, New Homes=4, House Price=5
```

---

## 10. GLOBAL PARAMETER TYPES (for dropdown lookups)

```javascript
// src/@core/utils/index.js (GLOBAL_PARAMETER_TYPES)
MEAL_PLAN = 'MEELPLAN' // note spelling
CANCELLATION_POLICY = 'CNCLPOLICY'
HOTEL_TYPE = 'HOTELTYPE'
NEARBY_ICON = 'NRBYICON'
HOUSE_RULES = 'HOUSERULE'
PROPERTY_FAQ = 'PROPFAQ'
HOTEL_FAQ = 'HOTLFAQ'
ROOM_FAQ = 'ROOMFAQ'
TIMESLOT = 'TIMESLOT'
ROOMTYPE = 'ROOMTYPE'
BEDTYPE = 'BEDTYPE'
SITESTS = 'SITESTS'
BATHROOMS = 'BATHROOMS'
BEDROOMS = 'BEDROOMS'
```

### Utility Functions

```javascript
import { getGlobalParametersLOV, getGlobalParametersLOV_Extended } from 'src/@core/utils'
// getGlobalParametersLOV(TYPE_CODE) → [{ value, label }]
// getGlobalParametersLOV_Extended(TYPE_CODE) → [{ value, label, extra }]
```

---

## 11. HOTEL PROPERTY API FIELDS (full shape)

### Property (from GET_PROPERTIES_FULL_DETAILS)

```
PROPERTY_ID, LISTING_TYPE_ID, SITE_STATUS_ID, SITE_STATUS_DESC
FULLPOSTCODE, PROPERTY_NUM_NAME, STREET_NAME, AREA_TOWN_CITY
LATITUDE, LONGITUDE, PLACE, MAP_URL
PICTURE_LINKS (JSON string array), CONTENT_FILE_LINK
PROPERTY_FEATURES (JSON), PROPERTY_UTILITIES (JSON), PROPERTY_UAP (JSON)
CUSTOM_FEATURES (JSON), NEARBY_PLACES (JSON), PROPERTY_FAQS (JSON), PROPERTY_RULES (JSON)
STAR_RATING, HOTEL_TYPE, CHECK_IN_TIME, CHECK_OUT_TIME
AGENT_NAME, AGENT_BIO, IMPORTANT_INFO
SUMMARY, FULLDESCRIPTION
ACTIVE, CREATED_ON
```

### Room (from GET_ROOM_DETAIL)

```
ROOM_ID, PROPERTY_ID
SUMMARY, FULLDESCRIPTION
PRICE, MAX_GUESTS
ROOMS_QUENTITY      ← ⚠️ spelled QUENTITY (backend typo — keep consistent)
MEAL_PLAN, CANCELLATION_POLICY  (store the code value, not label)
ROOM_FEATURES (JSON string), ROOM_PICTURE_LINKS (JSON string)
PROPERTY_TYPE_DESC, BATHROOMS_DESC, SIZE, UNITS_DESC
BED_TYPE
```

### House Rules (from PROPERTY_RULES JSON field)

```
PROPERTY_RULES_ID, RULE_ID, PROPERTY_ID
RULE    ← always uppercase from API
NOTE    ← always uppercase from API
```

---

## 12. DUMMY DATA LOCATIONS (needs real API)

| Location                                              | What's Hardcoded                                                                                                                                     | Priority |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `src/views/pages/home/landing/data.js`                | `landingCountries`, `landingLocations`, `hotelFilterConfig`, `rentalFilterConfig`, `rentalPropertySections` (4 London + Manchester dummy properties) | HIGH     |
| `src/views/pages/hotels/detail/PropertyReviews.js`    | `defaultReviews` array (4 fake reviews), `ratingBreakdown` percentages                                                                               | HIGH     |
| `src/views/pages/hotels/detail/PropertyHouseRules.js` | `defaultRules` (Check-in, Check-out, No Smoking, No Parties) — fallback only if API empty                                                            | MEDIUM   |
| `src/pages/hotels/properties/[id].js`                 | `const faqs = []`, `const houseRules = []` — need API fetch                                                                                          | MEDIUM   |
| `src/views/pages/home/landing/LandingHeroSearch.js`   | Default search values (From: US, To: Japan)                                                                                                          | LOW      |
| `src/configs/services/constant-data.js`               | `footerData` with `[?]` placeholders                                                                                                                 | LOW      |

---

## 13. FEATURES STATUS (what works, what's missing)

### ✅ Working (real API)

- Hotel property listing (home page grid, pagination, load more)
- Hotel detail page (description, amenities, map, host info)
- Room options & pricing table (RoomsDetailTable)
- Property features & utilities display
- Admin CRUD for all entities (40+ forms)
- Login / register / forgot & reset password
- Save / unsave properties
- Saved searches CRUD
- Agent & instant valuation forms
- File upload/download
- News management

### ⚠️ Partially Working

| Feature                   | Gap                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Hotel booking flow        | Form exists at `/hotels/booking/details` but **no submit API call** — needs booking creation endpoint |
| Account page              | Password change works; profile edit and avatar upload missing                                         |
| Saved properties          | UI works but no pagination                                                                            |
| Search/filter             | UI renders but filter params not always sent to API                                                   |
| Agent info on detail page | GET_AGENT_INFO endpoint exists but wiring uncertain                                                   |
| Community map             | Toggle + card structure exists, no real data                                                          |

### ❌ Not Started / Coming Soon

| Feature                    | Notes                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reviews system             | No reviews API — only dummy data                                                                                                                                                      |
| Ratings submission         | No POST reviews endpoint visible                                                                                                                                                      |
| Payment integration        | ✅ Stripe integrated — `@stripe/stripe-js`, `@stripe/react-stripe-js`; card form on `/hotels/booking/payment`; calls `POST /Payment/CreatePayment` then `POST /Booking/CreateBooking` |
| Real-time messaging / chat | No socket layer                                                                                                                                                                       |
| Push / email notifications | Mail templates exist but no sending integration                                                                                                                                       |
| Furniture marketplace      | Placeholder page only                                                                                                                                                                 |
| Terms & Cookie settings    | Under Development placeholder                                                                                                                                                         |
| Calendar / availability    | `@fullcalendar` installed but unused                                                                                                                                                  |
| Mobile app API             | Not applicable                                                                                                                                                                        |

---

## 14. FORMS PATTERN (all admin forms follow this)

```javascript
// 1. defaultValues object with every field
const defaultValues = { FIELD_NAME: '', ... }

// 2. useForm
const { control, handleSubmit, setValue, reset, watch, setError, clearErrors, formState: { errors } } = useForm({ defaultValues })

// 3. handleEdit(row) — populate form from existing record
setValue('FIELD_NAME', row.FIELD_NAME ?? '')

// 4. onSubmit(data) — dispatch Redux thunk
dispatch(updateXxx({ data: { FIELD_NAME: data.FIELD_NAME || null } }))

// 5. UI — MUI <Controller> + <TextField> or <Autocomplete>
<Controller name='FIELD_NAME' control={control} render={({ field }) => <TextField {...field} />} />
```

---

## 15. HOTEL SETUP FORM STRUCTURE

**Files:**

- Page: `src/pages/website/property-setup-hotels/form/index.js`
- Form UI: `src/views/pages/website/property-setup-hotels/form.js`
- Hotel Details card: `src/views/pages/website/property-setup-hotels/HotelDetailsSection.js`
- Room master-detail: `src/views/pages/website/property-setup-hotels/RoomDetailSection.js`

**HotelDetailsSection cards (in order):**

1. Description (`SUMMARY`, `FULLDESCRIPTION`)
2. Hotel Identity (star rating, hotel type)
3. Check-in / Check-out times
4. Host / Manager (`AGENT_NAME`, `AGENT_BIO`, `IMPORTANT_INFO`)
5. House Rules (inline editable list → `PROPERTY_RULES`)
6. FAQs (inline editable list → `PROPERTY_FAQS`)
7. Nearby Places (icon picker + name + distance → `NEARBY_PLACES`)

**Top-level `ModalForm` cards:**

1. Listing Status (`SITE_STATUS_ID`, `ACTIVE` switch)
2. Address & Location (Google Maps autocomplete, `PLACE`, `FULLPOSTCODE`, `PROPERTY_NUM_NAME`, `STREET_NAME`, `AREA_TOWN_CITY`)
3. Photos (`FileUploaderMultiple` → `PICTURE_LINKS`)
4. Amenities & Features (checkbox tree → `PROPERTY_FEATURES` + `CUSTOM_FEATURES`)
5. HotelDetailsSection (above)
6. RoomDetailSection (master-detail rooms)

---

## 16. KNOWN BUGS & GOTCHAS

| Issue                      | File                              | Fix Applied                                                                   |
| -------------------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| Rooms table not showing    | `[id].js` + `RoomsDetailTable.js` | Use `serverGet` (adds `usercode:0`); `serverGetRaw` omits it → empty response |
| `ROOMS_QUENTITY` typo      | All room code                     | Backend uses `QUENTITY` not `QUANTITY` — keep consistent                      |
| House rules field case     | `PropertyHouseRules.js`           | API returns `RULE`/`NOTE` uppercase; use `item.RULE \|\| item.rule` fallback  |
| Price multiplied by nights | `RoomsDetailTable.js`             | Show `room.PRICE` only (not `× totalNights`)                                  |
| Maps in modal SSR crash    | `map-modal/index.js`              | Use `dynamic(() => import(...), { ssr: false })`                              |
| Missing `</TableCell>`     | `RoomsDetailTable.js`             | Watch for this when editing table cells                                       |

---

## 17. NEXT DEVELOPMENT PRIORITIES

### Priority 1 — Replace Dummy Data

1. `PropertyReviews.js` — wire to real Reviews API (needs endpoint creation or check DB)
2. `data.js` (landing) — replace `rentalPropertySections` with real API call
3. `data.js` — replace `landingCountries`/`landingLocations` with API or DB-driven lookup
4. `[id].js` (hotel detail) — fetch and pass `PROPERTY_FAQS` and `PROPERTY_RULES` from API response

### Priority 2 — Complete Booking Flow

- `src/pages/hotels/booking/details.js` needs a `handleSubmit` → POST booking to API
- Need booking confirmation page
- Need booking history in user account

### Priority 3 — New Setup Forms

- **Reviews** setup form (if admin needs to seed/manage reviews)
- **Bookings** management form
- **Agent Approval** form (slice exists: `agent-approval`)

### Priority 4 — Features Enhancement

- Search filter → pass all filter params to API query
- Account page → add profile photo upload, edit name/email
- Saved properties pagination
- Community map — connect to real community data

### Priority 5 — Missing Integrations

- ✅ Payment gateway (Stripe) — integrated on `/hotels/booking/payment`
- Email sending (SMTP integration — mail templates ready)
- Push/in-app notifications
- Reviews POST endpoint

---

## 18. SECTION / DISCOVER TYPE MAPPING

When calling `/Sections/GetSections` or `/DiscoverSection/GetDiscoverSection`:

```
DISPLAY_TYPE=2 → Hotels
DISPLAY_TYPE=3 → Rentals
DISPLAY_TYPE=4 → New Homes
DISPLAY_TYPE=5 → House Price
```

---

## 19. NAMING CONVENTIONS

- **API fields:** ALL_CAPS_SNAKE_CASE (e.g. `PROPERTY_ID`, `SITE_STATUS_DESC`)
- **React state/JS vars:** camelCase
- **Store slices:** kebab-case for folder names, camelCase for slice name
- **File naming:** camelCase for components, kebab-case for folders
- **Icons:** always `tabler:icon-name` prefix (e.g. `tabler:building-hotel`)
- **Form fields:** match API field names exactly

---

## 20. HOW TO START A NEW FEATURE — CHECKLIST

1. **Check** this file for the relevant API endpoints and field names
2. **Find** the existing Redux slice or create one following the standard pattern
3. **Check** `src/configs/services/api-url.js` for the endpoint URL
4. **Check** `src/configs/services/api-methods/website.js` (or guest.js/admin.js) for the API function
5. **For forms:** follow the `defaultValues → handleEdit → onSubmit → Controller` pattern
6. **For guest pages:** use `serverGet` not `serverGetRaw` if the endpoint needs `usercode:0`
7. **For maps:** always wrap in `dynamic(..., { ssr: false })`
8. **For dropdowns:** use `getGlobalParametersLOV(TYPE_CODE)` with constants from `GLOBAL_PARAMETER_TYPES`
9. **Icons:** only use `tabler:*` icons via `<Icon icon='tabler:...' />` or `<IconifyIcon />`
10. **Toast:** `toast.success(...)` / `toast.error(...)` from `react-hot-toast`

---

_Last updated: April 2026 — generated from full codebase analysis_
