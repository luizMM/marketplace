import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import AuthPage from '@/pages/AuthPage'
import MarketplacePage from '@/pages/MarketplacePage'
import ItemDetailPage from '@/pages/ItemDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
