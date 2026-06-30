# MR Business Discovery — Native iOS Build Spec

**For:** Cowork / iOS developer handoff
**Branch context:** Spin-off of "The Layer" project, same Supabase backend, same partnership/BD model
**Why native:** True ARKit world tracking, plane detection, and Siri/App Intents integration are iOS-only — they cannot be built in a browser. A web mockup (camera feed + compass heading) was built first to validate the UX and is included below as a visual/interaction reference, but the real product needs a native Swift build.

---

## 1. Concept

Point your phone at the street. Real businesses around you — restaurants, cafes, bars, retail, services — appear as floating AR cards anchored to their real-world position. Tapping a card opens a detail sheet showing Google rating, hours, distance, and any active deal or promo. Deals are the business development lever: partnered businesses get a deal slot, which is also the pitch used to sign them up.

Three audiences in one app:
- **End user** — discovers nearby businesses and deals through AR
- **Business owner** — claims their listing, manages their own deals (future phase)
- **Internal BD team** — tracks partnership pipeline (prospect → contacted → signed → live)

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| AR / Camera | **ARKit** (`ARWorldTrackingConfiguration`) | Real-world anchors, not just compass math |
| UI | **SwiftUI** + `ARViewContainer` (UIViewRepresentable wrapping `ARSCNView` or RealityKit `ARView`) | |
| AR rendering | **RealityKit** (preferred over SceneKit for new builds) | Lets business cards render as billboarded SwiftUI views anchored in 3D space |
| Backend | **Supabase** (already live, see §4) | Postgres + PostGIS, REST via `supabase-swift` SDK |
| Business data | **Google Places API (iOS SDK or REST)** | Nearby Search + Place Details for rating, hours, photos |
| Location | **Core Location** (`CLLocationManager`) | Needed for both GPS coords and true heading (`CLLocationManager.headingAvailable`) |
| Voice / Siri | **App Intents** framework (iOS 16+) + `SiriKit` donation | See §6 |
| Networking | `URLSession` or `supabase-swift` client | |

Minimum target: **iOS 16** (required for App Intents + modern ARKit features). LiDAR-specific features (people occlusion, precise plane meshing) should gracefully degrade on non-LiDAR devices (iPhone 12 Pro and earlier non-Pro models).

---

## 3. Core AR Behavior

Replace the web mockup's "compass bearing math projected onto a 2D plane" with real ARKit world tracking:

1. **Session setup**: `ARWorldTrackingConfiguration` with `worldAlignment = .gravityAndHeading` so the AR world is aligned to true north — this lets you place anchors using real bearing/distance from GPS coordinates, same math as the web version (`calculateBearing`, `calculateDistance` — see web reference file), but anchored persistently in 3D space rather than recalculated every frame from device orientation.
2. **Anchor placement**: For each nearby business, convert (bearing, distance) from the user's GPS position into a 3D offset (x, z) relative to the camera's world origin, create an `ARAnchor` at that position, and attach a RealityKit entity (a billboarded SwiftUI card via `ARView.installGestures` + custom `Entity` wrapping a rendered SwiftUI view, or `UIHostingController`-backed `SCNNode` if using SceneKit).
3. **Billboarding**: Cards should always face the camera (`SCNBillboardConstraint` or RealityKit's `BillboardComponent`).
4. **Depth cue**: Scale and vertical position should reflect distance — closer businesses appear larger/lower, farther ones smaller/higher (matches the web mockup's existing `depthPosition` logic — port that scaling curve over).
5. **Occlusion (LiDAR devices only)**: Use `ARWorldTrackingConfiguration.sceneReconstruction = .meshWithClassification` and people/scene occlusion so cards correctly disappear behind real obstacles (e.g., a building between the user and a business that's actually around the corner). Skip on non-LiDAR devices.
6. **Tap handling**: Standard `ARView` hit-testing on tap gesture → identify which business anchor was tapped → present the business detail sheet (SwiftUI `.sheet()`).
7. **Field of view culling**: Same logic as the web version — only render/update anchors within the live camera FOV plus a margin, recalculated as the device moves (don't dump all 30 nearby businesses into the AR scene at once — that's how you get visual clutter; cap visible cards at ~6-8, prioritizing partners and closer distance).

---

## 4. Backend (Already Live — Reuse As-Is)

**Supabase project:** `qrcpeskqkoyacnmjuxni`
**URL:** `https://qrcpeskqkoyacnmjuxni.supabase.co`

### Tables (prefix `mr_`)

| Table | Purpose |
|---|---|
| `mr_businesses` | Business records — Google-sourced fields (`google_place_id`, `google_rating`, `google_rating_count`, `google_price_level`, `opening_hours`) + manual/partner fields (`is_partner`, `partner_tier`, `custom_description`, `brand_color`, `logo_url`) |
| `mr_deals` | Deals/promos tied to a `business_id` — title, discount_value, terms, validity window, active days/hours |
| `mr_deal_redemptions` | Tracks when a user redeems a deal (for partner reporting) |
| `mr_user_favorites` | Saved/favorited businesses per user |
| `mr_partnership_pipeline` | Internal BD tracker — prospect/contacted/negotiating/signed/live/churned stages |

### Key Postgres function

```sql
find_nearby_businesses(user_lat, user_lng, radius_meters, category_filter, limit_count)
```
Returns nearby businesses ordered by partner status then distance, with `has_active_deal` and `deal_count` computed inline via PostGIS `ST_DWithin`/`ST_Distance`. Call this from the iOS app via Supabase RPC (`supabase.rpc("find_nearby_businesses", params: [...])`) instead of reimplementing geo queries client-side.

### RLS

All read-access tables (`mr_businesses`, `mr_deals`) are public-read. Write access (favorites, redemptions) requires `auth.uid()` — wire up Supabase Auth (anonymous or email/Apple Sign-In) before user-specific features.

**Action item for dev:** the `mr_partnership_pipeline` table has no public SELECT policy — it's meant to be accessed via service-role key from an internal admin tool only, not the consumer app. Don't expose it client-side.

---

## 5. Google Places Integration (New — Not Yet Built)

Currently the database is seeded with manually-entered sample businesses. For production:

1. Use **Google Places API (New)** `Nearby Search` to pull businesses around the user's location periodically (cache results — don't call on every frame).
2. For each result, **upsert into `mr_businesses`** keyed on `google_place_id`, populating `google_rating`, `google_rating_count`, `google_price_level`, `opening_hours`, `address`, `phone`, `website`.
3. **Never overwrite partner fields** (`is_partner`, `partner_tier`, `custom_description`, `brand_color`, deals) during a Google sync — those are manually managed and the sync should only touch the `google_*` columns.
4. Recommended: run the sync as a scheduled job (Supabase Edge Function or a Cloudflare Worker on a cron trigger) rather than from the iOS client, to avoid burning Places API quota per-device and to keep data consistent across users.
5. Respect Google's attribution requirements (showing "Powered by Google" / rating data attribution per their ToS).

### 5a. UI/UX Constraints From Using Google Data

Using Google Places data is **not difficult from a UI/UX perspective**, but there are four non-negotiable constraints that affect layout:

**Attribution is mandatory and affects component design**

Google's ToS requires the Google logo displayed adjacent to any star rating or review count, and "Powered by Google" somewhere visible on any screen showing Google-sourced content. This isn't a footer footnote — it must be near the data itself. Reserve space for it in:
- The AR marker card (small "G" logo next to the rating)
- The list row (inline with the mini-rating chip)
- The business detail sheet (below the rating pill)

If using the Google Places iOS SDK, `GMSPlacePhotoMetadata.attributions` returns a pre-formatted `NSAttributedString` you render directly. If using REST (recommended — see below), you build the attribution UI manually but it's just a small logo image + text.

**Use `openNow` from the API — do not recompute it**

The web mockup's `isOpenNow()` is explicitly simplified and will be wrong for DST transitions, special holiday hours, and businesses with split shifts. The Google Places API (New) returns `regularOpeningHours.openNow` as a boolean in the response payload — request it in your field mask and display it directly. Store `is_open_now` as a column in `mr_businesses` that gets refreshed on each sync cycle, not computed client-side.

**Photos require a server-side proxy**

Photo references from the Places API cannot be embedded as direct image URLs in the app — calling the photo endpoint requires an API key that cannot be exposed in the app binary. Route all photo requests through a Supabase Edge Function or Cloudflare Worker that holds the key server-side and streams the image back. This is backend work, not UI work, but it affects how you build the image components: async load from your proxy URL (`/api/places/photo?ref=...`), not from Google directly. Cache aggressively — photo references are stable.

**Graceful empty states for incomplete data**

A meaningful portion of businesses in Google Places have missing fields — no hours, no phone, no website, no photos. Every UI component that renders Google data needs a graceful empty state:
- No rating → hide the rating pill entirely, don't show "★ —"
- No hours → hide the hours table, don't show empty rows
- No phone → hide the call button
- No photo → use the category icon banner (already in the mockup design)

**SDK vs REST recommendation**

Use REST via your Supabase sync job (§5, points 1–4), not the Google Places iOS SDK bundled in the app. Reasons:
- The SDK adds ~15MB to the binary and requires an API key in the app bundle (security risk)
- Since you're already syncing to Supabase, the iOS app fetches data through your own backend — the SDK adds nothing
- REST field masks (`X-Goog-FieldMask: places.displayName,places.rating,places.regularOpeningHours.openNow,...`) let you fetch exactly what you need in one call, no over-fetching
- The only exception: if you need real-time Place Details for a business not yet in your DB (e.g., a user taps an AR card for a business that hasn't synced yet) — in that case a lightweight REST call through your proxy is cleaner than bundling the SDK

---

## 6. Siri / App Intents

iOS 16+ App Intents framework, not classic SiriKit domains (those are limited to predefined categories like ride-booking, messaging, etc. — this doesn't fit any of them, so App Intents is the right tool).

### 6a. `BusinessEntity` — Make Businesses First-Class Siri Objects

Everything below depends on this. Define `BusinessEntity` conforming to `AppEntity` so Siri understands individual businesses as named objects, not just search strings. Without this, Siri can only run generic intents; with it, a user can say "Sorella Trattoria" and Siri resolves it to a specific record.

```swift
struct BusinessEntity: AppEntity {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Business")
    static var defaultQuery = BusinessEntityQuery()

    let id: String          // google_place_id
    var name: String
    var category: String
    var googleRating: Double?
    var isOpen: Bool
    var hasActiveDeal: Bool
    var distanceMeters: Double?

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(name)", subtitle: "\(category)")
    }
}
```

### 6b. `EntityQuery` + `EntityPropertyQuery`

`EntityQuery` lets Siri resolve a spoken business name to a `BusinessEntity` by calling your Supabase backend. `EntityPropertyQuery` lets Siri filter by attributes from natural language — "Italian restaurants open now with a rating above 4 stars" — without you writing any NLP.

```swift
struct BusinessEntityQuery: EntityQuery, EntityPropertyQuery {
    // EntityQuery: resolve by ID or name search
    func entities(for ids: [String]) async throws -> [BusinessEntity] { ... }
    func suggestedEntities() async throws -> [BusinessEntity] { /* top nearby */ }

    // EntityPropertyQuery: filter by declared properties
    static var properties = QueryProperties {
        Property(\BusinessEntity.$category) {
            EqualToComparator { NSPredicate(format: "category == %@", $0) }
        }
        Property(\BusinessEntity.$googleRating) {
            GreaterThanOrEqualToComparator { NSPredicate(format: "google_rating >= %f", $0) }
        }
        Property(\BusinessEntity.$isOpen) {
            EqualToComparator { NSPredicate(format: "is_open == %@", NSNumber(value: $0)) }
        }
        Property(\BusinessEntity.$hasActiveDeal) {
            EqualToComparator { NSPredicate(format: "has_active_deal == %@", NSNumber(value: $0)) }
        }
    }
    static var sortingOptions = SortingOptions {
        SortingOption(\BusinessEntity.$googleRating)
        SortingOption(\BusinessEntity.$distanceMeters)
    }
    func entities(matching comparators: [any EntityQueryComparator]...) async throws -> [BusinessEntity] {
        // Build Supabase query from comparators and call find_nearby_businesses RPC
    }
}
```

### 6c. Intent Suite

Define each intent as a separate `AppIntent` conforming struct. All return both a spoken string and a `SnippetsView` SwiftUI card so Siri shows a visual result alongside speech.

| Intent | Example phrase | Parameters | Spoken result |
|---|---|---|---|
| `FindNearbyDealsIntent` | "Find deals nearby" | optional `category` | "There's a 20% off deal at Sorella Trattoria, 0.2 miles away" |
| `SearchBusinessesIntent` | "Find coffee shops near me" | `category`, optional `query` | "I found 4 cafes nearby. The closest is Blue Bottle, 0.1 miles away" |
| `GetBusinessDetailsIntent` | "Tell me about [business]" | `business: BusinessEntity` | Name, category, rating, open status, distance |
| `GetBusinessRatingIntent` | "What's the rating for [business]?" | `business: BusinessEntity` | "Sorella Trattoria is rated 4.6 stars based on 312 reviews" |
| `CheckBusinessStatusIntent` | "Is [business] open right now?" | `business: BusinessEntity` | "Yes, Sorella Trattoria is open until 10 PM" / "No, it opens at 5 PM today" |
| `GetActiveDealsIntent` | "Does [business] have any deals?" | `business: BusinessEntity` | "Yes — 20% off any entrée, valid until Sunday" |
| `SaveBusinessIntent` | "Save [business] in MR" | `business: BusinessEntity` | "Saved Sorella Trattoria" + writes to `mr_user_favorites` |

Each intent that takes a `BusinessEntity` parameter gets Siri's full entity resolution pipeline — the user can speak any partial name and Siri disambiguates using `suggestedEntities()`.

### 6d. `AppShortcutsProvider` (iOS 16.4+)

Without this, Siri shortcuts require the user to manually configure them in Settings — almost nobody does. `AppShortcutsProvider` makes your defined phrases available in Siri automatically the moment the app is installed, with zero user setup.

```swift
struct MRShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(intent: FindNearbyDealsIntent(), phrases: [
            "Find deals nearby in \(.applicationName)",
            "What deals are near me in \(.applicationName)",
            "Show me offers nearby in \(.applicationName)",
        ])
        AppShortcut(intent: SearchBusinessesIntent(), phrases: [
            "Search for \(\.$category) in \(.applicationName)",
            "Find \(\.$category) near me in \(.applicationName)",
        ])
        AppShortcut(intent: GetBusinessRatingIntent(), phrases: [
            "What's the rating for \(\.$business) in \(.applicationName)",
            "How good is \(\.$business) in \(.applicationName)",
        ])
        AppShortcut(intent: CheckBusinessStatusIntent(), phrases: [
            "Is \(\.$business) open in \(.applicationName)",
            "Is \(\.$business) open right now in \(.applicationName)",
        ])
        AppShortcut(intent: GetActiveDealsIntent(), phrases: [
            "Does \(\.$business) have any deals in \(.applicationName)",
            "What deals does \(\.$business) have in \(.applicationName)",
        ])
    }
}
```

### 6e. Spoken Result Formatting + Siri Snippet Cards

Return `IntentResult.value(result, view:)` with a SwiftUI `SnippetsView` so Siri shows a visual card alongside the spoken response. For deal results the card should use the gold deal badge; for rating results show the star rating and review count prominently. For `CheckBusinessStatusIntent` show open/closed chip with closing time. Keep snippet views under 100pt tall — Siri clips taller views.

### 6f. Proactive Donation

Donate intents after real user actions so Siri Suggestions surface proactively:

```swift
// After user taps a business in AR view:
let intent = GetBusinessDetailsIntent()
intent.business = tappedBusinessEntity
let interaction = INInteraction(intent: intent.makeINIntent(), response: nil)
interaction.donate()

// After user claims a deal:
AddToSiriButton(intent: GetActiveDealsIntent()) // lets user add it to Siri from the deal card
```

Also donate `GetBusinessRatingIntent` after a user checks ratings — Siri will surface "Check rating for Sorella Trattoria" proactively the next time they're nearby.

### 6g. BD Pitch Points From Siri Integration

- "Ask Siri 'Is Blue Bottle open right now?' and it pulls live hours from your listing"
- "Ask Siri 'Does Sorella have any deals?' and it reads out your active promo"
- "Your business appears in Siri Suggestions when customers are nearby"

These are concrete, demo-able selling points for the partnership pitch.

---

## 7. Screens to Build (carried over from web spec)

1. **AR View** — the live camera + ARKit anchor view described in §3, with category filter pills docked in a fixed header band (not floating over the scene — this was a known issue in the web mockup, already fixed there, carry the fix over: filters live in their own opaque header zone, AR markers are confined to a vertical band clear of the header).
2. **Nearby (List + Map)** — fallback/complementary view for when AR isn't practical (indoors, low light, or user preference). Partners surfaced first, then the rest, sorted by distance.
3. **Business Detail Sheet** — triggered from tapping any AR card or list row. Shows: name, category, Google rating/review count, open/closed status, price level ($-$$$$), distance, hours table, active deals section (highlighted, gold accent), Save/Claim Deal button, directions/call actions.
4. **Partnerships (internal/BD-only)** — pipeline dashboard. Should be gated behind an internal auth role, not exposed to consumer users. Shows signed partners vs. prospects, conversion rate, deal status per partner.

---

## 8. Design Reference

Visual language to carry over from the web mockups (see attached `.jsx` reference files):
- **Palette**: near-black background (`#0A0A0F`), purple accent (`#8B5CF6`) for app chrome, **gold** (`#FBBF24`) reserved specifically for deal/promo signaling — this color-coding is intentional and should stay consistent (gold = "there's a deal here").
- **Partner tiers**: basic (gray) / featured (blue) / premium (gold) — reflected as a ribbon/badge on both the AR card and detail sheet.
- **Typography**: Inter or SF Pro, weight 600-700 for names/headers, muted gray (`#A1A1AA`) for secondary metadata.
- Category icons (emoji in the mockup, should become a proper icon set in production): restaurant 🍝, cafe ☕, bar 🍸, retail 🛍️, service 💼, entertainment 🎬.

---

## 9. What NOT to Carry Over From the Web Mockup

- The `getUserMedia()` camera feed and `DeviceOrientationEvent` compass math — this was a browser-only stand-in. Native ARKit replaces both with real world tracking.
- The illustrated CSS "street scene" fallback — not needed natively; if camera/AR permission is denied, show a simple permission-request screen instead, or fall back directly to the Nearby list view.
- Client-side bearing/distance math (`calculateBearing`, `calculateDistance`, `relativeBearing` in the JS reference) — port the *logic* (it's correct haversine/bearing math) but the *placement mechanism* changes from "project onto a 2D screen position" to "place a real ARAnchor in 3D world space."

---

## 10. Attached Reference Files

- `mr-business-discovery.jsx` — web mockup (React). Useful for: screen layout reference, business card content/copy, color tokens, the database query shapes already wired to Supabase. **Not** useful for: the AR mechanism itself (superseded by native ARKit per this spec).
- Supabase schema: live in project `qrcpeskqkoyacnmjuxni`, tables prefixed `mr_`, function `find_nearby_businesses()`. No migration needed — connect directly.

---

## 11. Open Decisions for the Dev / Cowork to Flag Back

- Auth strategy for end users (anonymous device ID vs. Sign in with Apple vs. email) — affects favorites/redemption tracking.
- Whether business owners get a self-serve claim/deal-management flow in v1 or that stays BD-manual for longer (current schema supports `owner_claimed` + `owner_user_id` but no UI exists for it).
- Google Places API quota/cost plan once sync volume is real (Nearby Search + Place Details calls add up — worth costing out before wide rollout).

---

## 12. AR Enhancement — Beyond the Baseline

### ARKit GeoAnchors (`ARGeoAnchor` / `ARGeoTrackingConfiguration`)

The most impactful AR upgrade over the baseline spec. `ARGeoTrackingConfiguration` uses Apple's pre-scanned city imagery to localize the device to within 1–3 meters by matching camera frames against Apple Maps data — far more accurate than `gravityAndHeading` compass math, which drifts badly in dense urban canyons. Place `ARGeoAnchor` objects at each business's real GPS coordinates and the card attaches to the actual building facade rather than floating in approximate space.

**Check city coverage before committing** — available in major metros (NYC, SF, LA, Chicago, London, Tokyo, Montreal, Melbourne, and expanding). Gracefully fall back to `ARWorldTrackingConfiguration` + compass math outside covered areas.

```swift
let config = ARGeoTrackingConfiguration()
let anchor = ARGeoAnchor(coordinate: businessCoordinate)
arView.session.add(anchor: anchor)
```

### ARKit Image Tracking (`ARImageTrackingConfiguration`)

Give partners a window sticker or door decal (a printed reference image with a known physical size). `ARImageTrackingConfiguration` detects that image in the camera feed and returns a precise transform — the deal card can be anchored flush to the glass, not just near it by GPS. Also works indoors where GPS is unavailable.

Doubles as a partner onboarding artifact: the sticker is both the AR anchor and a physical call-to-action for passersby.

### ARKit World Map Persistence (`ARWorldMap`)

Serialize the current AR session to disk with `session.getCurrentWorldMap()` and reload it on next launch. When a user returns to the same street, anchors reappear exactly where they were rather than being recomputed. Especially valuable for premium partner placements where card position has been manually fine-tuned.

### Spatial Audio (`AVFoundation` + `AVAudioEnvironmentNode`)

Position a subtle ambient sound at each ARKit anchor's world coordinates. As the user pans toward a partner business the cue gets slightly louder; panning away fades it. Subconscious wayfinding that doesn't require looking at the screen. Use `AVAudioEnvironmentNode` with the anchor's `simdWorldTransform` position updated each frame. Keep it opt-in (off by default, toggleable in settings).

---

## 13. Discovery & Distribution

### App Clips

The strongest BD-facing capability not in the original spec. A partner gets an App Clip code — works as an NFC sticker or QR code on their door. A customer taps or scans it and gets an instant native deal card with a "Claim Deal" button, zero install required. The full-app upsell prompt appears after claiming.

App Clips are capped at 15MB, so scope the clip to a single-business deal card view only — no AR, no map, no list. The clip calls the same Supabase RPC keyed on `google_place_id` passed via the clip URL.

BD pitch: "we give you a door sticker, your customers tap it, the deal appears." Drives app installs from foot traffic rather than paid acquisition.

```
Clip URL format: https://mr.yourdomain.com/clip?place_id=ChIJ...
```

### Core NFC (`NFCTagReaderSession`)

Complements App Clips for users who already have the full app installed. An NFC tag embedded in the partner's window sticker deep-links directly to that business's detail sheet via a Universal Link. No QR scan, no search — tap the door, see the deal.

Use `NFCTagReaderSession` with NDEF records encoding the same Universal Link used by App Clips. One sticker serves both paths.

### Core Spotlight (`CSSearchableItem`)

Index every saved business and any business with an active deal into Spotlight. Users find deals in iPhone search without opening the app. Contribute `CSSearchableItemAttributeSet` with name, category, rating, distance, and deal headline. Update the index when deals change via background refresh.

### App Store In-App Events

Not a framework — a platform distribution surface. Each time a partner runs a new deal, submit it as an In-App Event on App Store Connect. The event card (image + headline + CTA) is visible to all App Store users browsing the app listing, even without installing. Free marketing reach for partners, and a concrete BD selling point: "your deal gets featured in the App Store."

Turnaround is ~24 hours for review. Worth building a lightweight internal tool (or Shortcuts action) to draft event submissions from the `mr_deals` table.

---

## 14. Deals & Redemption

### PassKit — Apple Wallet (`PKPass`)

The biggest omission from the original spec. Instead of a "Claim Deal" button that sets a flag in the database, issue a real `PKGenericPass` (or `PKStoreCard`) to the user's Wallet. The business owner scans the barcode at the counter using any QR reader — no app needed on their end. Redemption writes back to `mr_deal_redemptions` via a webhook from your pass server.

Pass fields map naturally to the existing schema:
- Primary field: deal title + discount value
- Secondary fields: business name, expiry date
- Barcode: encode `redemption_id` as QR/Code128
- Pass update URL: lets you expire or extend the deal server-side and the pass updates silently in Wallet

Requires a Pass Type ID certificate from Apple Developer. The pass server (signs passes with your cert) can be a simple Supabase Edge Function or Cloudflare Worker.

### Live Activities + Dynamic Island (`ActivityKit`)

When a user claims a deal, start a Live Activity. It shows on the lock screen and in the Dynamic Island as a countdown to deal expiry: "20% off @ Sorella · expires 11:59 PM." The activity updates via ActivityKit push (`APNS` with `apns-push-type: liveactivity`) when the deal is modified or expires.

Requires defining an `ActivityAttributes` struct with the deal fields and a SwiftUI `ActivityConfiguration` layout for compact, minimal, and expanded presentations. iOS 16.1+.

### StoreKit 2

For when the B2B model moves beyond manual BD to self-serve. Business owners subscribe to a `featured` or `premium` tier via `Product.purchase()`. The schema already has `partner_tier` — StoreKit 2 handles entitlement verification server-side via `AppTransaction` and JWS receipts. No custom payment infrastructure needed.

Scope for v1: just the subscription product definitions and entitlement check. The business-owner UI can come later.

---

## 15. Contextual Intelligence

### WeatherKit

`WeatherService.weather(for:)` returns hyperlocal current conditions at the user's GPS position. Use it to rerank the AR view without any user input:

- Rain / overcast → surface covered bars, cafes, and indoor venues higher
- High temperature → cold drinks, ice cream, smoothie places float to top
- Evening → bars and entertainment rank up

Apply as a secondary sort weight on top of distance and partner-tier ordering. Cache the weather response for 30 minutes — don't call per-frame.

### Vision Framework + Core ML

Two distinct use cases:

**Text recognition** (`VNRecognizeTextRequest`): read the actual storefront sign from the camera feed and fuzzy-match it against `mr_businesses.name`. When GPS places an anchor 40 feet off due to urban canyon multipath, Vision's text hit can correct the anchor position by confirming which building is actually in frame. Run on a background queue, 1–2 fps.

**On-device ranking** (Core ML + Create ML): train a simple classifier on user save/tap/ignore history to predict which businesses a given user is likely to engage with. Rerank the visible AR cards accordingly. The training data lives in `mr_user_favorites` and `mr_deal_redemptions` — export it, train with Create ML's tabular classifier, ship the `.mlmodel` in the app bundle and update it via Core ML Model Deployment.

### Translate Framework (`Translation`)

iOS 17+ `TranslationSession` translates text on-device with no API key or network call. Relevant for tourist-heavy areas — auto-translate `custom_description` and deal titles when the device language differs from the text locale. Add a translate button to the detail sheet; on tap, replace the text in place.

---

## 16. Proximity & Location

### Region Monitoring + Geofencing (`CLCircularRegion`)

The app doesn't need to be open. Register a `CLCircularRegion` around each active partner location (50–100m radius). iOS wakes the app in the background when the user enters and fires a `UNLocationNotificationTrigger`: "You're near Sorella Trattoria — 20% off deal active." 

Cap monitored regions at 15–20 (iOS limit is 20 per app). Prioritize by partner tier and deal activity. Refresh the monitored set when the user moves significantly via significant-location-change monitoring.

### iBeacon / Core Bluetooth

A $15–30 Bluetooth beacon at the partner's door gives sub-meter indoor detection where GPS is unreliable. `CLBeaconRegion` monitoring wakes the app when the UUID is detected — fires the deal card automatically when the user physically enters the venue, with no pointing or searching required. Good for the "you just walked in" moment that GPS can't reliably deliver.

Partners receive a pre-configured beacon as part of the premium tier signup kit. UUID is stored in `mr_businesses` alongside `google_place_id`.

### Nearby Interaction (`NISession`, UWB)

iPhone 11+ with the U1 chip supports Ultra-Wideband precision finding — centimeter-level directional ranging to another U1 device. Applicable when a partner employee carries an iPhone or an accessory running `NISession`: the user's app can show a precision "you're getting warmer" directional indicator to guide them to a pickup counter or specific item in a large venue. Niche for v1 but worth noting for hospitality and retail partners with larger footprints.

---

## 17. Cross-Device & Continuity

### CloudKit (`CKContainer`)

Sync `mr_user_favorites` and deal redemption history across the user's devices via CloudKit private database. The user saves a business on their iPhone and it appears on their iPad. No additional auth required — tied to the user's Apple ID automatically.

Use `NSPersistentCloudKitContainer` (SwiftData-compatible) so local-first reads remain fast and sync happens in background. Conflict resolution: last-write-wins on favorites is acceptable.

### WidgetKit

Two widget targets worth building:

**Lock screen widget** (iOS 16+, `accessoryRectangular`): shows the single nearest active deal with distance and business name. Taps deep-link to the AR view focused on that business. Updates via `WidgetCenter.shared.reloadTimelines()` triggered by the region monitoring entry event.

**Home screen widget** (`systemSmall`): nearest deal with the category icon and gold deal badge. Same deep-link behavior.

Both widgets share a `TimelineProvider` that queries `find_nearby_businesses` using the last-known location stored in a shared `AppGroup` container (so the widget extension can read it without launching the main app).

### CarPlay (`CPTemplate`)

A `CPListTemplate` showing nearby partners sorted by distance, tappable to get spoken turn-by-turn via `MKDirections`. No AR in CarPlay — just the list and directions handoff. Relevant for delivery drivers, real estate agents, and anyone discovering deals while driving. Register the `CPApplicationDelegate` and declare the CarPlay entitlement.

### SharePlay / Group Activities (`GroupActivities`)

"Explore nearby together" — two users in a FaceTime call can share a `GroupActivity` that syncs the AR view state: same location center, same category filter, same highlighted business. Each person sees the other's "focus" (which card they're looking at) as a subtle indicator. Viral growth mechanism; relevant for friend groups and couples discovering where to eat.

---

## 18. UX & Onboarding Polish

### TipKit (`TipKit`, iOS 17+)

The AR UI has a genuine onboarding problem — new users don't know to move the phone, don't understand what gold cards mean, don't know filters exist. `TipKit` handles contextual popover tips with built-in frequency management (shows once, dismisses on tap, state synced via iCloud so it doesn't repeat on a new device).

Define tips as `Tip` conforming structs:
- `ARMoveTip`: "Move your phone slowly to reveal businesses around you" — fires after 3 seconds on the AR screen with no tap
- `GoldCardTip`: "Gold cards have an active deal — tap to claim" — fires on first gold card appearance
- `FilterTip`: "Filter by category to narrow results" — fires after the user's second AR session

### MapKit Look Around (`MKLookAroundSceneRequest`)

Embed Apple's street-level panoramic imagery directly in the business detail sheet as a tappable preview. The user can see the actual storefront before walking there. Replaces the placeholder grid map entirely.

```swift
let request = MKLookAroundSceneRequest(coordinate: businessCoordinate)
let scene = try await request.scene
// Present with MKLookAroundViewController
```

Available wherever Apple has collected imagery (broad coverage in cities). Falls back gracefully (hide the preview) where unavailable.

---

## 19. Capability Priority Matrix

| Capability | Impact | Effort | Phase |
|---|---|---|---|
| ARKit GeoAnchors | High — fixes anchor accuracy | Medium | v1 (where city coverage exists) |
| PassKit / Wallet | High — transforms redemption UX + BD pitch | Medium | v1 |
| App Clips | High — zero-friction discovery, BD artifact | Medium | v1 |
| Region Monitoring | High — passive discovery without app open | Low | v1 |
| Live Activities | High — deal stays top-of-mind post-claim | Low | v1 |
| WidgetKit | High — lock screen real estate | Low | v1 |
| `BusinessEntity` + `EntityQuery` | High — unlocks all Siri search & review intents | Medium | v1 |
| `AppShortcutsProvider` + intent suite | High — zero-setup Siri phrases, demo-able BD feature | Low (once entity done) | v1 |
| Core NFC | Medium — complements App Clips | Low | v1 |
| MapKit Look Around | Medium — replaces placeholder map | Low | v1 |
| TipKit | Medium — solves AR onboarding | Low | v1 |
| iBeacon | Medium — indoor precision for premium partners | Medium | v2 |
| WeatherKit | Medium — contextual reranking | Low | v2 |
| ARKit Image Tracking | Medium — precise facade anchoring | Medium | v2 |
| Core Spotlight | Medium — Spotlight search indexing | Low | v2 |
| App Store In-App Events | Medium — free partner marketing surface | Low | v2 (ongoing) |
| ARKit World Map Persistence | Medium — persistent anchors on return visit | Medium | v2 |
| Vision text recognition | Medium — anchor correction in GPS-poor areas | High | v2 |
| CloudKit sync | Medium — cross-device favorites | Low | v2 |
| Core ML ranking | Medium — personalized deal ordering | High | v3 |
| StoreKit 2 | Medium — self-serve B2B tier | Medium | v3 |
| Spatial Audio | Low-medium — subconscious wayfinding | Low | v2 |
| Translate | Low-medium — tourist use case | Low | v2 |
| Nearby Interaction (UWB) | Low — niche, large venues only | High | v3 |
| CarPlay | Low — secondary use case | Medium | v3 |
| SharePlay | Low — social discovery | High | v3 |

---

## 20. Open Decisions (Updated)

- Auth strategy for end users (anonymous device ID vs. Sign in with Apple vs. email) — affects favorites/redemption tracking, CloudKit sync, and Pass ownership.
- Whether business owners get a self-serve claim/deal-management flow in v1 or that stays BD-manual for longer (current schema supports `owner_claimed` + `owner_user_id` but no UI exists for it). StoreKit 2 tier selection is blocked on this decision.
- Google Places API quota/cost plan once sync volume is real (Nearby Search + Place Details calls add up — worth costing out before wide rollout).
- ARKit GeoAnchors city coverage check for target launch market — if launching outside a covered metro, `ARWorldTrackingConfiguration` + compass math remains the baseline.
- Pass Type ID certificate setup — needs an Apple Developer account with the Passes entitlement. One-time setup but must happen before PassKit work starts.
- iBeacon hardware vendor + provisioning process for partner onboarding kit (if included in premium tier).
