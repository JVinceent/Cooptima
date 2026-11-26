import { Navigate, Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import { ManagerLayout } from './layouts/ManagerLayout'
import Today from './pages/manager/Today'
import Members from './pages/manager/Members'
import FarmMap from './pages/manager/FarmMap'
import Forecast from './pages/manager/Forecast'
import PoolTrucks from './pages/manager/PoolTrucks'
import FindBuyers from './pages/manager/FindBuyers'
import Settle from './pages/manager/Settle'
import HarvestDone from './pages/manager/HarvestDone'

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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
