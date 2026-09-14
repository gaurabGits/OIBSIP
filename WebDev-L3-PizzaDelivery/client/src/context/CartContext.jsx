import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DELIVERY_FEE,
  getPizzaPrice,
} from "../utils/pricing";

import { useAuth } from "./AuthContext";
import api from "../services/api";

const MAX_QUANTITY = 10;
const LEGACY_STORAGE_KEY = "slicehouse-cart";

export const CartContext = createContext(null);

// Keep quantity between 1 and 10
const getSafeQuantity = (quantity) => {
  const number = Number(quantity);

  if (!Number.isFinite(number)) {
    return 1;
  }

  return Math.min(
    MAX_QUANTITY,
    Math.max(1, number)
  );
};

export function CartProvider({ children }) {
  const { user, loading } = useAuth();

  // MongoDB user ID
  const userId = user?._id || user?.id;

  const [items, setItems] = useState([]);

  // Keeps track of which user's cart is currently loaded
  const cartLoadedForUser = useRef(null);

  // Load the cart owned by the authenticated user.
  useEffect(() => {
    if (loading) return;
    if (!userId) {
      setItems([]);
      cartLoadedForUser.current = null;
      return;
    }

    let cancelled = false;
    cartLoadedForUser.current = null;
    api.get("/cart").then(({ data }) => {
      if (cancelled) return;
      const serverItems = Array.isArray(data.items) ? data.items : [];
      setItems(serverItems);
      cartLoadedForUser.current = userId;
    }).catch((error) => console.error("Failed to load cart:", error));
    return () => { cancelled = true; };
  }, [userId, loading]);

  // Persist every cart mutation in MongoDB for this user.
  useEffect(() => {
    if (loading || !userId || cartLoadedForUser.current !== userId) return;
    api.put("/cart", { items }).catch((error) => console.error("Failed to save cart:", error));
  }, [items, userId, loading]);

  // Add normal pizza
  const addToCart = useCallback(
    (pizza, quantity = 1, size = "M") => {
      if (!userId) {
        return false;
      }

      const itemId = `${pizza._id}-${size}`;

      const price = getPizzaPrice(
        pizza.price,
        size
      );

      const safeQuantity =
        getSafeQuantity(quantity);

      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.itemId === itemId
        );

        // Pizza already exists
        if (existingItem) {
          return currentItems.map((item) =>
            item.itemId === itemId
              ? {
                  ...item,
                  quantity: getSafeQuantity(
                    item.quantity +
                      safeQuantity
                  ),
                }
              : item
          );
        }

        // New pizza
        return [
          ...currentItems,
          {
            itemId,
            pizzaId: pizza._id,
            name: pizza.name,
            image: pizza.image,
            price,
            dough:
              pizza.dough ||
              "Classic crust",
            size,
            quantity: safeQuantity,
          },
        ];
      });

      return true;
    },
    [userId]
  );

  // Add custom pizza
  const addCustomPizza = useCallback(
    (pizza) => {
      if (!userId) {
        return false;
      }

      const customId =
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      setItems((currentItems) => [
        ...currentItems,
        {
          itemId: `custom-${customId}`,
          name: "Custom Pizza",
          image: null,
          price: pizza.price,
          dough: pizza.base,
          size: "Custom",
          quantity: 1,
          isCustom: true,

          ingredients: pizza.ingredients
            .map(
              (ingredient) =>
                ingredient.name
            )
            .join(", "),

          ingredientIds:
            pizza.ingredients.map(
              (ingredient) =>
                ingredient._id
            ),
        },
      ]);

      return true;
    },
    [userId]
  );

  // Change quantity
  const updateQuantity = useCallback(
    (itemId, quantity) => {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.itemId === itemId
            ? {
                ...item,
                quantity:
                  getSafeQuantity(quantity),
              }
            : item
        )
      );
    },
    []
  );

  // Remove one item
  const removeFromCart = useCallback(
    (itemId) => {
      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.itemId !== itemId
        )
      );
    },
    []
  );

  // Empty cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Total number of pizzas
  const itemCount = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [items]);

  // Pizza subtotal
  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [items]);

  // Delivery fee
  const deliveryFee = items.length
    ? DELIVERY_FEE
    : 0;

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      deliveryFee,

      addToCart,
      addCustomPizza,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      deliveryFee,
      addToCart,
      addCustomPizza,
      updateQuantity,
      removeFromCart,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for cart
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
}