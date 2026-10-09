/* ==========================================================================
   KARIBU TROVE: SITE SETTINGS
   Everything you are likely to change lives in this one file.
   Edit values here, save, and every page updates. No other file needs touching
   for day-to-day changes (offer amounts, contact details, apartments).
   ========================================================================== */
window.KT = {

  /* ---------- CONTACT (replace before launch) ---------- */
  WA_NUMBER: '254700000000',          // WhatsApp Business number, digits only, with country code
  EMAIL: 'hello@kaributrove.com',     // shown as the fallback for guests without WhatsApp
  INSTAGRAM: 'kaributrove',           // handle without @
  TIKTOK: 'kaributrove',              // handle without @
  WA_CHANNEL_URL: '',                 // paste your WhatsApp Channel link when it exists (optional)
  SITE_URL: 'https://kaributrove.com',

  /* ---------- FORM BACKEND (optional) ----------
     Leave blank to start: join and host forms then hand the guest's details to
     WhatsApp as a pre-filled message, which works with no backend at all.
     To also log every sign-up to a Google Sheet, paste the web-app URL of the
     Google Apps Script described in SETUP-FORMS.md. */
  FORM_ENDPOINT: '',

  /* ---------- THE OFFER (edit here; the whole site follows) ---------- */
  CREDIT_USD: 20,                     // welcome credit
  CREDIT_MIN_NIGHTS: 3,               // minimum direct stay the credit applies to
  CREDIT_EXPIRY_MONTHS: 12,
  POINTS: { welcome: 5, regular: 6, elite: 7 },   // points earned per $1 on direct stays
  POINTS_PER_DOLLAR_VALUE: 100,       // 100 points = $1
  FOUNDING_CAP: 200,                  // Founding Member spots
  MEMBERS_JOINED: 0,                  // update as you grow
  SHOW_COUNT_FROM: 25,                // the "joined so far" line appears only once this many have joined
  SOCIAL_PROOF_LINE: 'Hand-picked stays · Real support, every channel · Points on every booking',

  /* ---------- DIRECT BOOKING ----------
     Leave blank to fall back to email. Set to your direct booking page URL once live. */
  DIRECT_BOOKING_URL: '',

  /* ---------- HOST OFFER ---------- */
  HOST_BONUS_KES: 1000,               // founding-host signup bonus
  HOST_BONUS_SLOTS: 50,
  FEEDER_REWARD_KES: 500,             // per QR-sourced member who completes a first direct booking

  /* ---------- APARTMENTS ----------
     code      : per-host QR code (used in QR links: join.html?src=KT-K01)
     slug      : matches the folder name inside /images/
     trips     : which trip types the apartment suits (executive | family | couples | longstay)
     fromUSD   : nightly Airbnb rate (used to calculate 10% savings on WhatsApp/direct booking)
                 leave null to show "Rates on request"
     airbnbUrl : link to the apartment's Airbnb listing; leave '' to hide Airbnb option in popup
     NOTE: the trip tags below are starting guesses. Confirm each with the host. */
  TRIPS: {
    executive: 'Executive',
    family:    'Family & groups',
    couples:   'Couples',
    longstay:  'Extended stay'
  },
  /* ---------- COLLECTIONS ----------
     A Collection is a set of apartments in the same building or managed as one product.
     units: array of property codes that belong to this collection. */
  collections: [
    {
      code: 'COL-AH01',
      name: 'Alina Harbour',
      building: 'Alina Harbour Residences',
      loc: 'Westlands, Nairobi',
      tagline: 'Four apartments. One building. One standard.',
      description: 'A set of serviced apartments across four floors of Alina Harbour Residences — each unit independently vetted and backed by the Trove Promise.',
      fromUSD: 94,                          // single per-night rate for the collection
      meta: '2 Beds · 2 Baths',            // all units share the same spec
      trips: ['executive','couples','family'],
      units: ['KT-K01A', 'KT-K01B', 'KT-K01C', 'KT-K01D']
    }
  ],

  properties: [
    /* --- Alina Harbour Collection (4 units — same spec, same price, same building) --- */
    /* Floor 17: real photos + highlight video */
    { code:'KT-K01D', slug:'alina-harbour-f17', name:'Alina Harbour · Floor 17', loc:'Westlands, Nairobi', meta:'2 Beds · 2 Baths', trips:['executive','couples','family'], fromUSD:94, airbnbUrl:'', photoCount:9, collection:true, collectionCode:'COL-AH01',
      videoUrl:'assets/video/alina-harbour-highlight.mp4',
      fallback:['135deg,#3a4f45,#152420','135deg,#2E4038,#0f1a17','135deg,#4a6355,#152420','135deg,#1a2e24,#0f1a17','135deg,#3a4f45,#152420','135deg,#2E4038,#0f1a17','135deg,#4a6355,#152420','135deg,#2E4038,#0f1a17','135deg,#3a4f45,#152420'] },
    { code:'KT-K01A', slug:'alina-harbour', name:'Alina Harbour · Floor 3', loc:'Westlands, Nairobi', meta:'2 Beds · 2 Baths', trips:['executive','couples','family'], fromUSD:94, airbnbUrl:'', photoCount:3, collection:true, collectionCode:'COL-AH01',
      imgUrls:['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop'],
      fallback:['135deg,#3a4f45,#152420','135deg,#2E4038,#0f1a17','135deg,#4a6355,#152420'] },
    { code:'KT-K01B', slug:'alina-harbour', name:'Alina Harbour · Floor 4', loc:'Westlands, Nairobi', meta:'2 Beds · 2 Baths', trips:['executive','couples','family'], fromUSD:94, airbnbUrl:'', photoCount:3, collection:true, collectionCode:'COL-AH01',
      imgUrls:['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop'],
      fallback:['135deg,#2E4038,#0f1a17','135deg,#3a4f45,#152420','135deg,#1a2e24,#0f1a17'] },
    { code:'KT-K01C', slug:'alina-harbour', name:'Alina Harbour · Floor 5', loc:'Westlands, Nairobi', meta:'2 Beds · 2 Baths', trips:['executive','couples','family'], fromUSD:94, airbnbUrl:'', photoCount:3, collection:true, collectionCode:'COL-AH01',
      imgUrls:['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'],
      fallback:['135deg,#4a6355,#152420','135deg,#3a4f45,#152420','135deg,#2E4038,#0f1a17'] },

    /* --- Individual vetted stays --- */
    { code:'KT-W01', slug:'ridgeway-heights',  name:'Ridgeway Heights',  loc:'Westlands, Nairobi',  meta:'1 Bed · 1 Bath',   trips:['executive','couples'],  fromUSD:null, airbnbUrl:'', photoCount:3,
      fallback:['135deg,#4A3760,#152420','135deg,#5B3E77,#1a1224','135deg,#3d2c52,#152420'] },
    { code:'KT-U01', slug:'hillcrest-suites',  name:'Hillcrest Suites',  loc:'Upper Hill, Nairobi', meta:'2 Beds · 2 Baths', trips:['executive','family'],   fromUSD:null, airbnbUrl:'', photoCount:3,
      fallback:['135deg,#8A6A2A,#152420','135deg,#C89B3C,#3a2c10','135deg,#6e5420,#152420'] },
    { code:'KT-R01', slug:'riverside-cove',    name:'Riverside Cove',    loc:'Riverside, Nairobi',  meta:'1 Bed · 1 Bath',   trips:['longstay','couples'],   fromUSD:null, airbnbUrl:'', photoCount:3,
      fallback:['135deg,#355a52,#152420','135deg,#1F332D,#0a1210','135deg,#4a746a,#152420'] },
    { code:'KT-K02', slug:'wilton-terrace',    name:'Wilton Terrace',    loc:'Kilimani, Nairobi',   meta:'3 Beds · 2 Baths', trips:['family'],               fromUSD:null, airbnbUrl:'', photoCount:3,
      fallback:['135deg,#5c4a35,#152420','135deg,#7a6748,#2a2015','135deg,#3d3225,#152420'] },
    { code:'KT-W02', slug:'dakin-skyline',     name:'Dakin Skyline',     loc:'Westlands, Nairobi',  meta:'2 Beds · 1 Bath',  trips:['executive','family'],   fromUSD:null, airbnbUrl:'', photoCount:3,
      fallback:['135deg,#3f4f60,#152420','135deg,#5b7185,#1a2229','135deg,#2c3a45,#152420'] },
    { code:'KT-U02', slug:'oakdale-loft',      name:'Oakdale Loft',      loc:'Upper Hill, Nairobi', meta:'1 Bed · 1 Bath',   trips:['executive','couples'],  fromUSD:null, airbnbUrl:'', photoCount:3,
      fallback:['135deg,#5a3d3d,#152420','135deg,#7a5252,#2a1515','135deg,#3d2828,#152420'] },
    { code:'KT-R02', slug:'greenview-flat',    name:'Greenview Flat',    loc:'Riverside, Nairobi',  meta:'2 Beds · 2 Baths', trips:['longstay','family'],    fromUSD:null, airbnbUrl:'', photoCount:3,
      fallback:['135deg,#4a5a35,#152420','135deg,#647a48,#1c2415','135deg,#2f3a20,#152420'] }
  ],

  /* ---------- ANALYTICS ---------- */
  GA_MEASUREMENT_ID: '',   // Google Analytics 4 — e.g. 'G-XXXXXXXXXX'
  GTM_CONTAINER_ID: '',    // Google Tag Manager  — e.g. 'GTM-XXXXXXX'

  /* ---------- SOCIAL PROOF QUOTES ---------- */
  SOCIAL_PROOF: [
    { text: 'Found Karibu Trove on TikTok. The apartment was exactly as shown — even better.', attr: 'Guest · Alina Harbour, Oct 2024' },
    { text: 'Booked in 10 minutes over WhatsApp. Everything was ready on arrival.', attr: 'Guest · Westlands, Dec 2024' },
    { text: 'Loved that someone actually responded when I had a question at 11pm.', attr: 'Guest · Kilimani, Jan 2025' },
  ],

  /* ---------- STAY GUIDE (Nairobi neighbourhoods) ---------- */
  STAY_GUIDE: [
    { name: 'Westlands',       tag: 'Most connected',    summary: 'Major malls, restaurants, and offices all within walking distance. The go-to for first-timers and business travellers.', vibe: 'Business · Dining · Transport' },
    { name: 'Kilimani',        tag: 'Residential feel',  summary: 'Quiet streets during the day, lively in the evenings. Popular with expats, long-stay guests, and anyone who wants a local feel.', vibe: 'Long stays · Local · Nightlife' },
    { name: 'Upper Hill',      tag: 'Business district', summary: 'Close to embassies, hospitals, and the CBD. Practical, well-connected, and calm.', vibe: 'Embassies · Hospitals · CBD' },
    { name: 'Riverside Drive', tag: 'Calm pocket',       summary: 'A quieter stretch between Westlands and Kilimani. Tree-lined, with some of the city\'s best restaurants nearby.', vibe: 'Quiet · Restaurants · Green' },
  ],
};
