import { Helmet } from 'react-helmet-async'
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
      <Helmet>
        <title>RICK.AI | Custom AI App Development</title>
        <meta
          name="description"
          content="RICK.AI builds custom AI-powered applications that transform your business. From intelligent automation to computer vision, we turn your ideas into production-ready AI solutions."
        />
      </Helmet>

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
