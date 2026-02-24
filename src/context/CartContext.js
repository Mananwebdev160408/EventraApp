import React, { createContext, useState, useContext, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [merchandiseItems, setMerchandiseItems] = useState([]);
  const [ticketItems, setTicketItems] = useState([]);

  const addToCart = (item, type) => {
    if (type === "Food") {
      setFoodItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [...prev, { ...item, quantity: 1, type: "Food" }];
      });
    } else if (type === "Merchandise") {
      setMerchandiseItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [...prev, { ...item, quantity: 1, type: "Merchandise" }];
      });
    }
  };

  const setTickets = (seats, eventId, stadiumId) => {
    const formattedTickets = seats.map((seat) => ({
      id: seat.id,
      name: `Seat ${seat.row}${seat.number}`,
      price: `₹${seat.price}`,
      quantity: 1,
      type: "Ticket",
      eventId: eventId,
      stadiumId: stadiumId,
      image:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=200&auto=format&fit=crop", // Placeholder for ticket
    }));
    setTicketItems(formattedTickets);
  };

  const removeFromCart = (id, type) => {
    if (type === "Food") {
      setFoodItems((prev) => prev.filter((i) => i.id !== id));
    } else if (type === "Merchandise") {
      setMerchandiseItems((prev) => prev.filter((i) => i.id !== id));
    } else if (type === "Ticket") {
      setTicketItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const updateQuantity = (id, type, delta) => {
    if (type === "Food") {
      setFoodItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
        ),
      );
    } else if (type === "Merchandise") {
      setMerchandiseItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
        ),
      );
    }
  };

  const clearCart = () => {
    setFoodItems([]);
    setMerchandiseItems([]);
    setTicketItems([]);
  };

  const cartItems = useMemo(
    () => [...foodItems, ...merchandiseItems, ...ticketItems],
    [foodItems, merchandiseItems, ticketItems],
  );

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const priceStr = item.price.replace("₹", "").replace("$", "");
      const price = parseFloat(priceStr);
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        foodItems,
        merchandiseItems,
        ticketItems,
        cartItems,
        cartTotal,
        itemCount,
        addToCart,
        setTickets,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
