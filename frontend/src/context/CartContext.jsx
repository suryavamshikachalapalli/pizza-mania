import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIdx = state.items.findIndex(
        i => i.pizzaId === action.payload.pizzaId && i.size === action.payload.size
      );
      if (existingIdx >= 0) {
        const items = [...state.items];
        items[existingIdx] = { ...items[existingIdx], quantity: items[existingIdx].quantity + 1 };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, i) => i !== action.payload) };
    case 'UPDATE_QTY': {
      const items = [...state.items];
      if (action.payload.qty <= 0) {
        items.splice(action.payload.index, 1);
      } else {
        items[action.payload.index] = { ...items[action.payload.index], quantity: action.payload.qty };
      }
      return { ...state, items };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(localStorage.getItem('pizzaCart') || '[]'),
    isOpen: false
  });

  useEffect(() => {
    localStorage.setItem('pizzaCart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ ...state, dispatch, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
