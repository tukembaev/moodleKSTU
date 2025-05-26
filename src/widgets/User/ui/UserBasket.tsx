import { CreditCard, ShoppingBasket, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "shared/shadcn/ui/dropdown-menu";

interface CartItem {
  id: string;
  title: string;
  price: number;
  category: string;
}

const UserBasket = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isManualChange = useRef(false);

  useEffect(() => {
    const loadCartFromStorage = () => {
      const storedCart = JSON.parse(sessionStorage.getItem("cart") || "[]");

      if (!isManualChange.current && storedCart.length > cart.length) {
        setIsDropdownOpen(true);
        setTimeout(() => setIsDropdownOpen(false), 2000);
      }

      isManualChange.current = false;
      setCart(storedCart);
    };

    window.addEventListener("storage", loadCartFromStorage);
    loadCartFromStorage();

    return () => {
      window.removeEventListener("storage", loadCartFromStorage);
    };
  }, []);

  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    isManualChange.current = true;
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="px-2 z-40">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="flex gap-2 items-center text-sm">
          <Button variant="outline" size="icon" className="relative">
            <ShoppingBasket />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 px-1 min-w-4 translate-x-1/2 -translate-y-1/2 origin-center flex items-center justify-center rounded-full text-xs bg-destructive text-destructive-foreground">
                {totalItems}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-41">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "w-80 flex flex-col",
              "p-3 rounded-xl",
              "bg-white dark:bg-zinc-900",
              "sticky top-4",
              "max-h-[32rem]"
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBasket className="w-4 h-4 text-zinc-500" />
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Корзина ({totalItems})
              </h2>
            </div>

            <motion.div
              className={cn(
                "flex-1 overflow-y-auto",
                "min-h-0",
                "-mx-4 px-4",
                "space-y-3"
              )}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      layout: { duration: 0.2 },
                    }}
                    className={cn(
                      "flex items-center gap-3",
                      "p-2 rounded-lg",
                      "bg-zinc-50 dark:bg-zinc-800/50",
                      "mb-3"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {item.title}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                          <X className="w-3 h-3 text-zinc-400" />
                        </motion.button>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        ${item.price} • {item.category}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {cart.length === 0 && (
              <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                Ваша корзина пуста
              </div>
            )}
            {cart.length !== 0 && (
              <div
                className={cn(
                  "pt-3 ",
                  "border-t border-zinc-200 dark:border-zinc-800",
                  "bg-white dark:bg-zinc-900"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 inline-block min-w-[80px] text-right font-mono tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button size="sm" className="w-full gap-2">
                  <CreditCard className="w-4 h-4" />
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserBasket;
