import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import AuthPage from '@/pages/AuthPage'
import MarketplacePage from '@/pages/MarketplacePage'
import ItemDetailPage from '@/pages/ItemDetailPage'
import CheckoutPage from '@/pages/CheckoutPage'
import ProfilePage from '@/pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}
