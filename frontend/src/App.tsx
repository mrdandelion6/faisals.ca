import NavBar, { type NavBarButtonProps } from './components/NavBar'

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
    <>
      <NavBar leftButtons={leftButtons} rightButtons={rightButtons} />

      <main className="pt-16">
        <p className="body-text">
          hey , how's it going. <br />
        </p>
      </main>

    </>
  )
}

export default App
