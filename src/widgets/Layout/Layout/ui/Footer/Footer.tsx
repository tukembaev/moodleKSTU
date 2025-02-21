import { Button } from "shared/ui/shadcn/button";

const Footer = () => {
  return (
    <footer className="text-white p-4 border-t">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl text-primary font-bold">Логотип</div>

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
    </footer>
  );
};

export default Footer;
