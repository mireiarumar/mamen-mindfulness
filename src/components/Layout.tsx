import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import MiniPlayer from './MiniPlayer'
import { usePlayer } from '../contexts/PlayerContext'

export default function Layout() {
  const { current } = usePlayer()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${current ? 'pb-40' : 'pb-8'}`}>
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
      <MiniPlayer />
    </div>
  )
}
