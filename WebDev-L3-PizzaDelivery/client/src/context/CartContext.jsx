import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DELIVERY_FEE, getPizzaPrice } from '../utils/pricing'

const STORAGE_KEY = 'slicehouse-cart'
const MAX_QUANTITY = 10

const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(STORAGE_KEY)
    return storedCart ? JSON.parse(storedCart) : []
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(getStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (pizza, quantity = 1, size = 'M') => {
    const itemId = `${pizza._id}-${size}`
    const price = getPizzaPrice(pizza.price, size)

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.itemId === itemId)

      if (existingItem) {
        return currentItems.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) }
            : item,
        )
      }

      return [
        ...currentItems,
        {
          itemId,
          pizzaId: pizza._id,
          ingredientIds: pizza.ingredientIds || [],
          name: pizza.name,
          image: pizza.image,
          price,
          dough: pizza.dough || 'Classic crust',
          size,
          quantity: Math.min(MAX_QUANTITY, quantity),
        },
      ]
    })
  }

  const addCustomPizza = (pizza) => {
    setItems((currentItems) => [
      ...currentItems,
      {
        itemId: `custom-${Date.now()}`,
        name: 'Custom Pizza',
        image: null,
        price: pizza.price,
        dough: pizza.base,
        size: 'Custom',
        quantity: 1,
        isCustom: true,
        ingredients: pizza.ingredients.map((ingredient) => ingredient.name).join(', '),
        ingredientIds: pizza.ingredients.map((ingredient) => ingredient._id),
      },
    ])
  }

  const updateQuantity = (itemId, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)) }
            : item,
        ),
    )
  }

  const removeFromCart = (itemId) => {
    setItems((currentItems) => currentItems.filter((item) => item.itemId !== itemId))
  }

  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
      deliveryFee: items.length ? DELIVERY_FEE : 0,
      addToCart,
      addCustomPizza,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [items, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
