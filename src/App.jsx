import react from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Moviedetailpage from './pages/Moviedetailpage'
import FavoritesPage from './pages/FavoritesPage'


function App() {
 

  return (
    <Router>
      <Routes> 
      <Route path="/" element={<Home />} />
      <Route path="/moviedetail/:title?" element={<Moviedetailpage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      </Routes> 
    </Router>
  )
}

export default App
