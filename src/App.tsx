import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Services } from './components/sections/Services'
import { Process } from './components/sections/Process'
import { Portfolio } from './components/sections/Portfolio'
import { TechStack } from './components/sections/TechStack'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <TechStack />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App
