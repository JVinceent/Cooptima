import { Navigate, Route, Routes } from 'react-router-dom'
import { BuyerLayout } from './layouts/BuyerLayout'
import { FarmerLayout } from './layouts/FarmerLayout'
import { ManagerLayout } from './layouts/ManagerLayout'
import { TruckerLayout } from './layouts/TruckerLayout'
import Start from './pages/Start'

import Today from './pages/manager/Today'
import Members from './pages/manager/Members'
import FarmMap from './pages/manager/FarmMap'
import Forecast from './pages/manager/Forecast'
import PoolTrucks from './pages/manager/PoolTrucks'
import FindBuyers from './pages/manager/FindBuyers'
import Settle from './pages/manager/Settle'
import HarvestDone from './pages/manager/HarvestDone'

import FindFarmers from './pages/buyer/FindFarmers'
import Orders from './pages/buyer/Orders'
import Order from './pages/buyer/Order'

import Home from './pages/farmer/Home'
import Receipts from './pages/farmer/Receipts'
import Passbook from './pages/farmer/Passbook'
import Farm from './pages/farmer/Farm'
import Market from './pages/farmer/Market'
import Chat from './pages/farmer/Chat'
import Sms from './pages/farmer/Sms'

import Trips from './pages/trucker/Trips'
import TodayTrip from './pages/trucker/TodayTrip'
import Dropoff from './pages/trucker/Dropoff'
import MapScreen from './pages/trucker/MapScreen'
import Profile from './pages/trucker/Profile'
import TripGuide from './pages/trucker/TripGuide'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Start />} />

      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<Today />} />
        <Route path="members" element={<Members />} />
        <Route path="farm-map" element={<FarmMap />} />
        <Route path="forecast" element={<Forecast />} />
        <Route path="pool-trucks" element={<PoolTrucks />} />
        <Route path="find-buyers" element={<FindBuyers />} />
        <Route path="settle" element={<Settle />} />
        <Route path="settled" element={<HarvestDone />} />
      </Route>

      <Route path="/buyer" element={<BuyerLayout />}>
        <Route index element={<FindFarmers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/tomatoes" element={<Order />} />
      </Route>

      <Route path="/farmer" element={<FarmerLayout />}>
        <Route index element={<Home />} />
        <Route path="receipts" element={<Receipts />} />
        <Route path="passbook" element={<Passbook />} />
        <Route path="farm" element={<Farm />} />
        <Route path="market" element={<Market />} />
      </Route>
      <Route path="/farmer/sms" element={<Sms />} />
      <Route path="/farmer/chat" element={<Chat />} />

      <Route path="/trucker" element={<TruckerLayout />}>
        <Route index element={<Trips />} />
        <Route path="today" element={<TodayTrip />} />
        <Route path="dropoff" element={<Dropoff />} />
        <Route path="map" element={<MapScreen />} />
        <Route path="profile" element={<Profile />} />
        <Route path="go" element={<TripGuide />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
