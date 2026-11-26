import { Navigate, Route, Routes } from 'react-router-dom'
import Start from './pages/Start'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
