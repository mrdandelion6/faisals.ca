import { useState } from 'react';
import { NavBarButton } from './NavBar';

// Main component - exported

export default function NavBar({ leftButtons = [], rightButtons = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {leftButtons.map((button, index) => (
              <NavBarButton key={index} {...button} />
            ))}
          </div>

          {/* Right buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {rightButtons.map((button, index) => (
              <NavBarButton key={index} {...button} />
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              // Close icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu - Collapsible */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {/* Left buttons in mobile */}
              {leftButtons.map((button, index) => (
                <NavBarButton
                  key={`left-${index}`}
                  {...button}
                  className="block px-4 py-2 hover:bg-gray-100 rounded-md" />
              ))}

              {/* Divider if both arrays have items */}
              {leftButtons.length > 0 && rightButtons.length > 0 && (
                <div className="border-t border-gray-200 my-2"></div>
              )}

              {/* Right buttons in mobile */}
              {rightButtons.map((button, index) => (
                <NavBarButton
                  key={`right-${index}`}
                  {...button}
                  className="block px-4 py-2 hover:bg-gray-100 rounded-md" />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

