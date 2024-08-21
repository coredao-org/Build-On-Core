import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Providers from './components/providers.tsx'
// import { HeroHighlight,Highlight } from './components/ui/hero-highlight.tsx'
// import { motion } from 'framer-motion'
// import { CardBody, CardContainer, CardItem } from './components/ui/3d-card.tsx'
// import Hero from './components/hero.tsx'
// import MemeDiv from './components/meme-template.js'
import Header from './components/header.tsx'
import {Toaster} from "sonner"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
    <Toaster/>
    <Header/>
      <App />
      
{/*      
    <Hero/>
    <MemeDiv/> */}
      </Providers>
    
  </React.StrictMode>,
)
