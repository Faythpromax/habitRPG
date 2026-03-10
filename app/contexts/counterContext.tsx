import { createContext, useContext, useState } from "react";

// // Create the context
const CounterContext = createContext<any>(null);

// Create a provider component
export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(prev => prev + 1);
  }

  return (
    <CounterContext.Provider value={{ count, increase }}>
      {children}
    </CounterContext.Provider>
  );
}

// Create a helper hook (optional but common)
export function useCounter() {
  return useContext(CounterContext);
}
