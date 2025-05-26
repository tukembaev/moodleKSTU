export const addToCart = (article: {
  id: string;
  title: string;
  price: number;
  category: string;
}) => {
  const existingCart = JSON.parse(sessionStorage.getItem("cart") || "[]");

  const updatedCart = [...existingCart];
  const existingItemIndex = updatedCart.findIndex(
    (item) => item.id === article.id
  );

  if (existingItemIndex !== -1) {
    console.warn("Item already in the cart"); // Логика может быть изменена
  } else {
    updatedCart.push(article);
  }

  sessionStorage.setItem("cart", JSON.stringify(updatedCart));

  window.dispatchEvent(new Event("storage"));
};
