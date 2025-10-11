import { useState } from 'react'

// buttons can have either text , image , or both
interface NavBarButtonProps {
  children: React.ReactNode
  isTitle?: boolean
  hideText?: boolean
  href?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  className?: string
  external?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

interface NavBarProps {
  leftButtons?: NavBarButtonProps[]
  rightButtons?: NavBarButtonProps[]
  rightRightButtons?: NavBarButtonProps[]
}

// internal component
function NavBarButton({
  children,
  isTitle = false,
  hideText = false,
  href,
  onClick,
  className = "",
  external = false,
  icon,
  iconPosition = 'left'
}: NavBarButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`px-3 py-2 text-gray-700 hover:text-black hover:scale-115 transition-all duration-200 flex items-center gap-2 ${isTitle ? 'font-title text-xl' : 'font-medium'} ${className}`}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {/* icon on left */}
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}

      {/* text */}
      {!hideText && <span>{children}</span>}

      {/* icon on right */}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </a>
  )
}

export default function NavBar({ leftButtons = [], rightButtons = [], rightRightButtons = [] }: NavBarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="mx-auto px-[5vw] md:px-[15vw]">
        <div className="flex items-center justify-between h-16">

          {/* left buttons - desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {leftButtons.map((button, index) => (
              <NavBarButton key={index} {...button} />
            ))}
          </div>

          {/* right side - desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {/* right buttons */}
            <div className="flex items-center space-x-8">
              {rightButtons.map((button, index) => (
                <NavBarButton key={index} {...button} />
              ))}
            </div>

            {/* separator and rightRight buttons */}
            {rightRightButtons.length > 0 && (
              <>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-8">
                  {rightRightButtons.map((button, index) => (
                    <NavBarButton key={index} {...button} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
            type="button"
          >
            {isOpen ? (
              // close icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // hamburger icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* mobile menu - collapsible */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {/* Left buttons in mobile */}
              {leftButtons.map((button, index) => (
                <NavBarButton
                  key={`left-${index}`}
                  {...button}
                  className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                />
              ))}

              {/* divider */}
              {leftButtons.length > 0 && (rightButtons.length > 0 || rightRightButtons.length > 0) && (
                <div className="border-t border-gray-200 my-2"></div>
              )}

              {/* right buttons in mobile */}
              {rightButtons.map((button, index) => (
                <NavBarButton
                  key={`right-${index}`}
                  {...button}
                  className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                />
              ))}

              {/* divider */}
              {rightButtons.length > 0 && rightRightButtons.length > 0 && (
                <div className="border-t border-gray-200 my-2"></div>
              )}

              {/* rightRight buttons in mobile */}
              {rightRightButtons.map((button, index) => (
                <NavBarButton
                  key={`rightright-${index}`}
                  {...button}
                  className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// export types for use in other components
export type { NavBarProps, NavBarButtonProps }
