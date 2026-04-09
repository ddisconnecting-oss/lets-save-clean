"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ExpenseContext = createContext<any>(null);

export function ExpenseProvider({ children }: any) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    const savedBudget = localStorage.getItem("budget");

    if (saved) setExpenses(JSON.parse(saved));
    if (savedBudget) setBudget(Number(savedBudget));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("budget", String(budget));
  }, [budget]);

  const addExpense = (expense: any) => {
    setExpenses([...expenses, expense]);
  };

  const deleteExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, deleteExpense, budget, setBudget }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);