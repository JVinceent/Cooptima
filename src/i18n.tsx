// English and Tagalog text for the trucker screens. Switch it in Profile; the choice is remembered on the device.
// The Tagalog is a first draft: have a native speaker check it before it goes in front of truckers.
import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'tl'

const en = {
  // tabs and headers
  tabHome: 'Home',
  tabMap: 'Find loads',
  tabProfile: 'Profile',
  myTrips: 'My trips',
  profile: 'Profile',
  todaysTrip: "Today's trip",
  back: 'Back',
  callCoop: 'Call the coop',
  // home
  thisWeek: 'This week',
  trips: (n: number) => `${n} trips`,
  each: (amount: string) => `${amount} each`,
  newBookingFrom: (coop: string) => `New booking from ${coop}`,
  bookingDetail: (crop: string, n: number, buyer: string) => `${crop}, ${n} pickups, then to ${buyer}`,
  yourPay: (farms: number, share: string) => `your pay, ${farms} farms × ${share}`,
  decline: 'Decline',
  accept: 'Accept',
  comingUp: 'Coming up',
  tipNext: (name: string, load: string) => `Next stop: ${name}, ${load}`,
  tipLeft: (left: number, buyer: string) => `${left} pickups left, then ${buyer}`,
  onTheRoad: 'On the road',
  booked: 'Booked',
  notBooked: 'Not booked',
  pickups: (n: number) => `${n} pickups`,
  pickupsDone: (n: number, done: number) => `${n} pickups, ${done} done`,
  farmsAndLoad: (crop: string, farms: number, load: string) => `${crop}, ${farms} farms, ${load}`,
  seeMore: (n: number) => `See ${n} more`,
  seeLess: 'See less',
  // find loads: 1 where from and to, 2 how many kilos, 3 the routes that fit, 4 chosen
  whereTo: 'Where are you going?',
  startIs: (place: string) => `Start: ${place}. Tap to search for a place.`,
  endIs: (place: string) => `Drop-off: ${place}. Tap to search for a place.`,
  searchStart: 'Where do you start?',
  searchEnd: 'Where are you going?',
  searchExample: 'Try a market, town or street, like "market batangas" or "Divisoria".',
  chooseOnMap: 'Choose on the map',
  suggested: 'Suggested',
  searching: 'Searching…',
  noPlaces: 'No places found. Try another name, or choose on the map.',
  searchFailed: "Search isn't working right now. Choose on the map instead.",
  clearSearch: 'Clear',
  findingPlace: 'Finding the place…',
  pinStart: 'Start here',
  pinEnd: 'Drop-off here',
  mapSetStart: 'Map. Move it to put the pin where you start.',
  mapSetEnd: 'Map. Move it to put the pin where you drop off.',
  fastestRoute: 'Fastest route',
  aboutRoute: 'About',
  findingRoute: 'Finding the fastest route…',
  dragHint: 'Move the map to place the pin',
  close: 'Close',
  truckUpTo: (load: string) => `Truck, carries up to ${load}`,
  next: 'Next',
  yourTrip: 'Your trip',
  routeMapAria: (from: string, to: string) => `Map of the route from ${from} to ${to}`,
  ifYouLeave: (time: string) => `If you leave at ${time}`,
  seeProfile: 'See profile',
  howMuch: 'How many kilos can you take?',
  truckLimit: (limit: string) => `Truck limit ${limit}`,
  routesFit: (n: number) => `${n} ${n === 1 ? 'route fits' : 'routes fit'}`,
  noneFit: 'No loads go there yet',
  showRoutes: 'Show routes',
  lessKg: 'Less kilos',
  moreKg: 'More kilos',
  routesForYou: 'Routes for you',
  routesTo: (from: string, to: string, load: string) => `${from} to ${to}, up to ${load}`,
  farmsLabel: 'Farms',
  weightLabel: 'Weight',
  distanceLabel: 'Distance',
  payLabel: 'Your pay',
  pickupOn: (day: string) => `Pickup ${day}`,
  chooseRoute: 'Choose this route',
  noRoutes: 'No routes fit this yet. Try more kilos or another destination.',
  changeSearch: 'Change my search',
  routeChosen: 'Route confirmed',
  chosenTold: (n: number) => `The coop and the ${n} farms are told.`,
  viewTrips: 'Back to my trips',
  // route details
  routeDetails: 'Route details',
  pickupsHeading: 'Pickups',
  legNote: (dist: string, time: string) => `${dist} away, ${time}`,
  timeLabel: 'Time',
  confirmRoute: 'Confirm route',
  startTrip: 'Start trip',
  // trip guide
  tripMapAria: 'Map of your trip: the farms to pick up from and the drop-off',
  stopOf: (i: number, n: number) => `Stop ${i} of ${n}`,
  toPickUp: (load: string) => `${load} to pick up`,
  awayTime: (dist: string, time: string) => `${dist}, about ${time}`,
  startDriving: 'Start driving',
  drivingTo: (place: string) => `Driving to ${place}`,
  toGo: (dist: string) => `${dist} to go`,
  slideArrived: 'Slide when you arrive',
  arrivedQ: (place: string) => `Arrived at ${place}?`,
  notYet: 'Not yet',
  yesArrived: 'Yes, I arrived',
  reached: (place: string) => `You reached ${place}`,
  weighed: 'Kilos weighed at the farm gate',
  lessKgShort: 'Less',
  moreKgShort: 'More',
  openIn: 'Open in',
  callFarm: (name: string) => `Call ${name}`,
  headTo: (place: string) => `Head to ${place}`,
  arriveAt: (place: string) => `Arrive at ${place}`,
  turn: (kind: string, dir: string, road: string) => {
    const onto = road ? ` onto ${road}` : ''
    if (kind === 'continue') return road ? `Continue on ${road}` : 'Go straight'
    if (kind === 'merge') return `Merge${onto}`
    if (kind === 'fork') return `Keep ${dir}${onto}`
    if (kind === 'ramp') return `Take the ramp on the ${dir}${onto}`
    if (kind === 'roundabout') return `Take the roundabout${onto}`
    return dir === 'straight' ? `Go straight${onto}` : dir === 'U-turn' ? `Make a U-turn${onto}` : `Turn ${dir}${onto}`
  },
  dirWord: (modifier: string) =>
    ({ left: 'left', right: 'right', 'slight left': 'slightly left', 'slight right': 'slightly right', 'sharp left': 'sharp left', 'sharp right': 'sharp right', uturn: 'U-turn' } as Record<string, string>)[modifier] ?? 'straight',
  totalOnTruck: (load: string) => `${load} on the truck`,
  pickedUpLabel: 'Picked up',
  findAnother: 'Find another load',
  // profile
  myTruck: 'My truck',
  plate: 'Plate',
  capacity: 'Capacity',
  tripPay: 'Trip pay',
  payout: 'Payout',
  setByCoop: 'Set by the coop',
  language: 'Language',
  // today's trip
  routeAria: 'Route map: stop 1 picked up, stop 2 is next, then stops 3 to 5',
  pickedUpCount: (n: number, total: number) => `${n} of ${total} picked up`,
  nextStop: (n: number) => `Next: stop ${n}`,
  atFarmGate: (load: string) => `${load} at the farm gate`,
  directions: 'Directions',
  pickedUp: 'Picked up',
  pickedUpKg: (load: string) => `${load}, picked up`,
  dropOffAt: (buyer: string) => `Drop-off at ${buyer}`,
  allStops: 'All stops',
  // drop-off
  allPickupsDone: (n: number) => `All ${n} pickups done`,
  onTruck: (load: string) => `About ${load} on the truck`,
  dropOff: 'Drop-off',
  markDelivered: 'Mark delivered',
  toldRightAway: (buyer: string) => `The coop and ${buyer} are told right away.`,
  delivered: 'Delivered',
  haveBeenTold: (buyer: string) => `The coop and ${buyer} have been told.`,
  yourPayTrip: 'Your pay for this trip',
  pay: 'Pay',
  pickupsLabel: 'Pickups',
  load: 'Load',
  backToTrips: 'Back to my trips',
}

type Strings = typeof en

const tl: Strings = {
  tabHome: 'Home',
  tabMap: 'Hanap karga',
  tabProfile: 'Profile',
  myTrips: 'Mga biyahe ko',
  profile: 'Profile',
  todaysTrip: 'Biyahe ngayon',
  back: 'Bumalik',
  callCoop: 'Tawagan ang coop',
  thisWeek: 'Ngayong linggo',
  trips: (n) => `${n} biyahe`,
  each: (amount) => `${amount} bawat isa`,
  newBookingFrom: (coop) => `Bagong booking mula sa ${coop}`,
  bookingDetail: (crop, n, buyer) => `${crop}, ${n} pickup, tapos papunta kay ${buyer}`,
  yourPay: (farms, share) => `kikitain mo, ${farms} bukid × ${share}`,
  decline: 'Tanggihan',
  accept: 'Tanggapin',
  comingUp: 'Mga susunod na biyahe',
  tipNext: (name, load) => `Susunod na hintuan: ${name}, ${load}`,
  tipLeft: (left, buyer) => `${left} pickup pa, tapos kay ${buyer}`,
  onTheRoad: 'Nasa biyahe',
  booked: 'Naka-book',
  notBooked: 'Hindi pa naka-book',
  pickups: (n) => `${n} pickup`,
  pickupsDone: (n, done) => `${n} pickup, ${done} tapos na`,
  farmsAndLoad: (crop, farms, load) => `${crop}, ${farms} bukid, ${load}`,
  seeMore: (n) => `Tingnan ang ${n} pa`,
  seeLess: 'Mas kaunti',
  whereTo: 'Saan ka papunta?',
  startIs: (place) => `Simula: ${place}. Pindutin para maghanap ng lugar.`,
  endIs: (place) => `Ihahatid sa: ${place}. Pindutin para maghanap ng lugar.`,
  searchStart: 'Saan ka magsisimula?',
  searchEnd: 'Saan ka papunta?',
  searchExample: 'Maghanap ng palengke, bayan o kalye, gaya ng "market batangas" o "Divisoria".',
  chooseOnMap: 'Pumili sa mapa',
  suggested: 'Mungkahi',
  searching: 'Naghahanap…',
  noPlaces: 'Walang nahanap. Subukan ang ibang pangalan, o pumili sa mapa.',
  searchFailed: 'Hindi gumagana ang paghahanap ngayon. Pumili na lang sa mapa.',
  clearSearch: 'Burahin',
  findingPlace: 'Hinahanap ang lugar…',
  pinStart: 'Dito magsisimula',
  pinEnd: 'Dito ihahatid',
  mapSetStart: 'Mapa. Igalaw para ilagay ang pin kung saan ka magsisimula.',
  mapSetEnd: 'Mapa. Igalaw para ilagay ang pin kung saan mo ihahatid.',
  fastestRoute: 'Pinakamabilis na ruta',
  aboutRoute: 'Mga',
  findingRoute: 'Hinahanap ang pinakamabilis na ruta…',
  dragHint: 'Igalaw ang mapa para ilagay ang pin',
  close: 'Isara',
  truckUpTo: (load) => `Truck, kaya hanggang ${load}`,
  next: 'Susunod',
  yourTrip: 'Ang biyahe mo',
  routeMapAria: (from, to) => `Mapa ng ruta mula ${from} papuntang ${to}`,
  ifYouLeave: (time) => `Kung aalis ka ng ${time}`,
  seeProfile: 'Tingnan ang profile',
  howMuch: 'Ilang kilo ang kaya mo?',
  truckLimit: (limit) => `Limit ng truck: ${limit}`,
  routesFit: (n) => `${n} ruta ang kasya`,
  noneFit: 'Wala pang karga papunta roon',
  showRoutes: 'Ipakita ang mga ruta',
  lessKg: 'Bawasan ang kilo',
  moreKg: 'Dagdagan ang kilo',
  routesForYou: 'Mga ruta para sa iyo',
  routesTo: (from, to, load) => `${from} papuntang ${to}, hanggang ${load}`,
  farmsLabel: 'Bukid',
  weightLabel: 'Bigat',
  distanceLabel: 'Layo',
  payLabel: 'Kita mo',
  pickupOn: (day) => `Pickup ${day}`,
  chooseRoute: 'Piliin ang rutang ito',
  noRoutes: 'Wala pang rutang kasya. Subukan ang mas maraming kilo o ibang destinasyon.',
  changeSearch: 'Baguhin ang hanap',
  routeChosen: 'Kumpirmado ang ruta',
  chosenTold: (n) => `Nasabihan na ang coop at ang ${n} bukid.`,
  viewTrips: 'Bumalik sa mga biyahe ko',
  routeDetails: 'Detalye ng ruta',
  pickupsHeading: 'Mga kukunin',
  legNote: (dist, time) => `${dist} ang layo, ${time}`,
  timeLabel: 'Oras',
  confirmRoute: 'Kumpirmahin ang ruta',
  startTrip: 'Simulan ang biyahe',
  tripMapAria: 'Mapa ng biyahe mo: ang mga bukid na kukunan at ang hatiran',
  stopOf: (i, n) => `Hintuan ${i} sa ${n}`,
  toPickUp: (load) => `${load} na kukunin`,
  awayTime: (dist, time) => `${dist}, mga ${time}`,
  startDriving: 'Magmaneho na',
  drivingTo: (place) => `Papunta sa ${place}`,
  toGo: (dist) => `${dist} pa`,
  slideArrived: 'I-slide pagdating mo',
  arrivedQ: (place) => `Nandiyan ka na sa ${place}?`,
  notYet: 'Hindi pa',
  yesArrived: 'Oo, nandito na',
  reached: (place) => `Narating mo na ang ${place}`,
  weighed: 'Kilong natimbang sa gate ng bukid',
  lessKgShort: 'Bawas',
  moreKgShort: 'Dagdag',
  openIn: 'Buksan sa',
  callFarm: (name) => `Tawagan si ${name}`,
  headTo: (place) => `Pumunta sa ${place}`,
  arriveAt: (place) => `Darating sa ${place}`,
  turn: (kind, dir, road) => {
    const onto = road ? ` papuntang ${road}` : ''
    if (kind === 'continue') return road ? `Dumiretso sa ${road}` : 'Dumiretso'
    if (kind === 'merge') return `Sumanib${onto}`
    if (kind === 'fork') return `Manatili sa ${dir}${onto}`
    if (kind === 'ramp') return `Pumasok sa rampa sa ${dir}${onto}`
    if (kind === 'roundabout') return `Dumaan sa rotonda${onto}`
    return dir === 'diretso' ? `Dumiretso${onto}` : dir === 'U-turn' ? `Mag-U-turn${onto}` : `Lumiko sa ${dir}${onto}`
  },
  dirWord: (modifier) =>
    ({ left: 'kaliwa', right: 'kanan', 'slight left': 'bahagyang kaliwa', 'slight right': 'bahagyang kanan', 'sharp left': 'kaliwa', 'sharp right': 'kanan', uturn: 'U-turn' } as Record<string, string>)[modifier] ?? 'diretso',
  totalOnTruck: (load) => `${load} sa truck`,
  pickedUpLabel: 'Nakuha',
  findAnother: 'Maghanap ng ibang karga',
  myTruck: 'Truck ko',
  plate: 'Plaka',
  capacity: 'Kapasidad',
  tripPay: 'Kita sa biyahe',
  payout: 'Payout',
  setByCoop: 'Itatakda ng coop',
  language: 'Wika',
  routeAria: 'Mapa ng ruta: nakuha na ang hintuan 1, susunod ang hintuan 2, tapos ang hintuan 3 hanggang 5',
  pickedUpCount: (n, total) => `${n} sa ${total} ang nakuha na`,
  nextStop: (n) => `Susunod: hintuan ${n}`,
  atFarmGate: (load) => `${load} sa gate ng bukid`,
  directions: 'Direksyon',
  pickedUp: 'Nakuha na',
  pickedUpKg: (load) => `${load}, nakuha na`,
  dropOffAt: (buyer) => `Ihatid kay ${buyer}`,
  allStops: 'Lahat ng hintuan',
  allPickupsDone: (n) => `Tapos na ang ${n} pickup`,
  onTruck: (load) => `Mga ${load} sa truck`,
  dropOff: 'Ihahatid',
  markDelivered: 'Markahang naihatid',
  toldRightAway: (buyer) => `Agad na sasabihan ang coop at si ${buyer}.`,
  delivered: 'Naihatid na',
  haveBeenTold: (buyer) => `Nasabihan na ang coop at si ${buyer}.`,
  yourPayTrip: 'Kinita mo sa biyahe na ito',
  pay: 'Kita',
  pickupsLabel: 'Pickup',
  load: 'Karga',
  backToTrips: 'Bumalik sa mga biyahe ko',
}

// Dates and crop names come from the sample data in English; these swap them for Tagalog.
const tlDays: Record<string, string> = { Mon: 'Lun', Tue: 'Mar', Wed: 'Miy', Thu: 'Huw', Fri: 'Biy', Sat: 'Sab', Sun: 'Lin' }
const tlMonths: Record<string, string> = {
  Jan: 'Ene', Feb: 'Peb', Mar: 'Mar', Apr: 'Abr', May: 'May', Jun: 'Hun',
  Jul: 'Hul', Aug: 'Ago', Sep: 'Set', Oct: 'Okt', Nov: 'Nob', Dec: 'Dis',
}
const tlCrops: Record<string, string> = { Tomatoes: 'Kamatis', Squash: 'Kalabasa', 'Mixed vegetables': 'Halo-halong gulay' } // others keep their name (Pechay, Sitaw, Talong)

const KEY = 'cooptima-lang'

function readSaved(): Lang {
  try {
    return localStorage.getItem(KEY) === 'tl' ? 'tl' : 'en'
  } catch {
    return 'en' // storage can be blocked; fall back to English
  }
}

type Ctx = { lang: Lang; setLang: (lang: Lang) => void }
const LangContext = createContext<Ctx>({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readSaved)
  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* the choice just won't be remembered */
    }
  }
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

/** Text for the current language, plus helpers for dates and crop names that come from the data. */
export function useT() {
  const { lang, setLang } = useContext(LangContext)
  const t: Strings = lang === 'tl' ? tl : en
  const date = (text: string) =>
    lang === 'tl'
      ? text
          .replace(/\bToday\b/, 'Ngayon')
          .replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/g, (d) => tlDays[d])
          .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (m) => tlMonths[m])
      : text
  const crop = (name: string) => (lang === 'tl' ? (tlCrops[name] ?? name) : name)
  return { t, lang, setLang, date, crop }
}
