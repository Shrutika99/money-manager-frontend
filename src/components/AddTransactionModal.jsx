import { useState } from "react";
import { addTransaction } from "../services/api";

export default function AddTransactionModal({ onClose, refresh }) {
  const [type, setType] = useState("income");
  const [form, setForm] = useState({ amount: "", category: "" });

  const submit = async () => {
    await addTransaction({ ...form, type });
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        <div className="flex gap-4 mb-4">
          <button onClick={() => setType("income")}>Income</button>
          <button onClick={() => setType("expense")}>Expense</button>
        </div>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Amount"
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Category"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <button onClick={submit} className="bg-blue-500 text-white px-4 py-2">
          Add
        </button>
      </div>
    </div>
  );
}
