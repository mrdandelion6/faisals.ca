// Internal component - not exported
export function NavBarButton({ children, href, onClick, className = "" }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium ${className}`}
    >
      {children}
    </a>
  );
}

