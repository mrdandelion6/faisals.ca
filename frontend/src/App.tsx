import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar, { type NavBarButtonProps } from './components/NavBar'
import PDFViewer from './components/pages/PDFViewer';

function Home() {
  return (
    <main className="pt-16">
      <p className="body-text">
        hey , how's it going. <br />
      </p>
    </main>
  );
}

function App() {
  const leftButtons: NavBarButtonProps[] = [
    { children: "Home", href: "/" },
    { children: "About", href: "/about" },
    { children: "Projects", href: "/projects" }
  ]

  const rightButtons: NavBarButtonProps[] = [
    { children: "Contact", href: "/contact" },
  ]

  return (
    <Router>
      <NavBar leftButtons={leftButtons} rightButtons={rightButtons} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ta-resume-cs" element={<PDFViewer pdf_endpoint="ta-resume-cs" />} />
        <Route path="/ta-resume-math" element={<PDFViewer pdf_endpoint="ta-resume-math" />} />
        <Route path="/ta-resume-phys" element={<PDFViewer pdf_endpoint="ta-resume-phys" />} />
        <Route path="/gpu-resume" element={<PDFViewer pdf_endpoint="gpu-resume" />} />
      </Routes>
    </Router>
  )
}

export default App
