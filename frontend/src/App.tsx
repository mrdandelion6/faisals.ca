import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar, { type NavBarButtonProps } from './components/NavBar'
import PDFViewer from './components/pages/PDFViewer';
import GithubIcon from './components/icons/GitHubIcon';
import LinkedinIcon from './components/icons/LinkedinIcon';
import HomeIcon from './components/icons/HomeIcon';

function Home() {
  return (
    <main className="pt-16">
      <p className="body-text">
        hey , how's it going. <br />
      </p>
    </main>
  );
}

function NotFound() {
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404 :(</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">page not found</h2>
        <p className="text-gray-500 mb-6">
          sorry bb ... page doesn't exist
        </p>
        <a
          href="/"
          className="inline-block px-5 py-2 bg-gray-500 text-white rounded-lg
          hover:bg-black transition-colors duration-200"
        >
          go home
        </a>
      </div>
    </main>
  );
}

function App() {
  const leftButtons: NavBarButtonProps[] = [
    { children: "faisal", href: "/", icon: <HomeIcon />, isTitle: true },
  ]

  const rightButtons: NavBarButtonProps[] = [
    { children: "blog", href: "/blog" },
    { children: "resume", href: "/resume" },
    { children: "projects", href: "/projects" },
    { children: "math", href: "/math" },
  ]

  const rightRightButtons: NavBarButtonProps[] = [
    { children: "github", href: "https://github.com/mrdandelion6", external: true, hideText: true, icon: <GithubIcon /> },
    { children: "linkedin", href: "https://www.linkedin.com/in/faisal-shaik/", external: true, hideText: true, icon: <LinkedinIcon /> },
  ]

  return (
    <Router>
      <NavBar leftButtons={leftButtons} rightButtons={rightButtons} rightRightButtons={rightRightButtons} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ta-resume-cs" element={<PDFViewer pdf_endpoint="ta-resume-cs" />} />
        <Route path="/ta-resume-math" element={<PDFViewer pdf_endpoint="ta-resume-math" />} />
        <Route path="/ta-resume-phys" element={<PDFViewer pdf_endpoint="ta-resume-phys" />} />
        <Route path="/rop-resume-phys" element={<PDFViewer pdf_endpoint="rop-resume-phys" />} />
        <Route path="/gpu-resume" element={<PDFViewer pdf_endpoint="gpu-resume" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
