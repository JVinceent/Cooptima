// English and Tagalog text for the trucker screens. Switch it in Profile; the choice is remembered on the device.
// The Tagalog is a first draft: have a native speaker check it before it goes in front of truckers.
import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'tl'

const en = {
  // tabs and headers
  tabHome: 'Home',
  tabMap: 'Map',
  tabProfile: 'Profile',
  myTrips: 'My trips',
  profile: 'Profile',
  map: 'Map',
  mapSub: 'Your stops and requests nearby',
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
  // map
  mapAria: (stops: number) => `Map: your ${stops} stops today, your truck, the buyer and the farmers asking for a truck`,
  stopsRequests: (stops: number, n: number) => `${stops} stops today, ${n} ${n === 1 ? 'request' : 'requests'}`,
  askingForTruck: 'Farmers asking for a truck',
  onMyWay: (buyer: string) => `On my way to ${buyer}`,
  allNearby: 'All nearby',
  added: (crop: string, load: string, total: string, cap: string) => `Added ${crop}, ${load}. Truck load: ${total} of ${cap}.`,
  offRoute: (farmer: string, km: number) => `${farmer}, ${km} km off your route`,
  payForFarm: (buyer: string) => `your pay for this farm, to ${buyer}`,
  loadAfter: (after: string, cap: string) => `Truck load after adding: ${after} of ${cap}`,
  tooHeavy: (after: string, cap: string) => `Too heavy: ${after} of ${cap}`,
  addToTrip: "Add to today's trip",
  noRequests: 'No requests near your route right now.',
  noMoreRequests: 'No more requests near your route.',
  moreNearby: 'More nearby',
  you: 'You',
  requestLabel: (pin: string, crop: string, load: string) => `Request ${pin}: ${crop}, ${load}`,
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
  tabMap: 'Mapa',
  tabProfile: 'Profile',
  myTrips: 'Mga biyahe ko',
  profile: 'Profile',
  map: 'Mapa',
  mapSub: 'Mga hintuan mo at hiling sa malapit',
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
  mapAria: (stops) => `Mapa: ang ${stops} hintuan mo ngayon, ang truck mo, ang buyer at ang mga magsasakang nangangailangan ng truck`,
  stopsRequests: (stops, n) => `${stops} hintuan ngayon, ${n} hiling`,
  askingForTruck: 'Mga magsasakang nangangailangan ng truck',
  onMyWay: (buyer) => `Sa daan papunta kay ${buyer}`,
  allNearby: 'Lahat ng malapit',
  added: (crop, load, total, cap) => `Naidagdag ang ${crop}, ${load}. Karga ng truck: ${total} sa ${cap}.`,
  offRoute: (farmer, km) => `${farmer}, ${km} km mula sa ruta mo`,
  payForFarm: (buyer) => `kikitain mo sa bukid na ito, papunta kay ${buyer}`,
  loadAfter: (after, cap) => `Karga ng truck pagkatapos idagdag: ${after} sa ${cap}`,
  tooHeavy: (after, cap) => `Masyadong mabigat: ${after} sa ${cap}`,
  addToTrip: 'Idagdag sa biyahe ngayon',
  noRequests: 'Walang hiling malapit sa ruta mo ngayon.',
  noMoreRequests: 'Wala nang ibang hiling malapit sa ruta mo.',
  moreNearby: 'Iba pang malapit',
  you: 'Ikaw',
  requestLabel: (pin, crop, load) => `Hiling ${pin}: ${crop}, ${load}`,
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
const tlCrops: Record<string, string> = { Tomatoes: 'Kamatis', Squash: 'Kalabasa' } // others keep their name (Pechay, Ampalaya, Sitaw, Talong)

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
