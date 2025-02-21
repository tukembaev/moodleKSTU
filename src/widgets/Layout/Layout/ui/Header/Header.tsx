import { Button } from "shared/ui/shadcn/button";

const Header = () => {
  return (
    <header className="text-white p-4 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl text-primary font-bold">Логотип</div>
        <nav className="hidden md:flex space-x-4">
          <a href="#" className="text-primary hover:text-gray-400">
            Главная
          </a>
          <a href="#" className="text-primary hover:text-gray-400">
            О нас
          </a>
          <a href="#" className="hover:text-gray-400 text-primary">
            Услуги
          </a>
          <a href="#" className="hover:text-gray-400 text-primary">
            Контакты
          </a>
        </nav>
        <Button variant="outline" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
