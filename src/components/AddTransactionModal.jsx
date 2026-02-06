import { useEffect, useState } from "react";
import { addTransaction, editTransaction } from "../services/api";

const CATEGORIES = [
  "fuel",
  "movie",
  "food",
  "loan",
  "medical",
  "salary",
  "other",
];

export default function AddTransactionModal({ onClose, refresh, transaction }) {
  const isEdit = !!transaction;
  const [tab, setTab] = useState(transaction?.type || "income");
  const getDefaultDate = () => {
    const now = new Date();
    return {
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
    };
  };

  const [form, setForm] = useState({
    amount: "",
    category: "",
    division: "Personal",
    date: getDefaultDate().date,
    time: getDefaultDate().time,
    description: "",
    type: "income",
    isTransfer: false,
    fromAccount: "",
    toAccount: "",
  });

  useEffect(() => {
    if (transaction) {
      const rawDate =
        transaction.datetime ||
        transaction.createdAt ||
        new Date().toISOString();
      const parsed = new Date(rawDate);
      const safeDate = isNaN(parsed.getTime()) ? new Date() : parsed;
      
      const dateStr = safeDate.toISOString().slice(0, 10);
      const timeStr = safeDate.toTimeString().slice(0, 5);

      setForm({
        amount: transaction.amount,
        category: transaction.category,
        division: transaction.division || "Personal",
        date: dateStr,
        time: timeStr,
        description: transaction.description || "",
        type: transaction.type,
        isTransfer: transaction.type === "transfer",
        fromAccount: transaction.fromAccount || "",
        toAccount: transaction.toAccount || "",
      });
      setTab(transaction.type || "income");
    }
  }, [transaction]);

  const submit = async () => {
 
    const datetime = new Date(`${form.date}T${form.time}`).toISOString();
    
    const payload = {
      amount: Number(form.amount),
      category: form.category,
      division: form.division,
      datetime: datetime,
      description: form.description,
      type: form.isTransfer ? "transfer" : tab,
      fromAccount: form.fromAccount,
      toAccount: form.toAccount,
    };

    if (isEdit) {
      const id = transaction._id || transaction.id;
      await editTransaction(id, payload);
    } else {
      await addTransaction(payload);
    }

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
    
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
        
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                tab === "income"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setTab("income");
                setForm((f) => ({ ...f, isTransfer: false }));
              }}
            >
              Income
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                tab === "expense"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setTab("expense");
                setForm((f) => ({ ...f, isTransfer: false }));
              }}
            >
              Expense
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                tab === "transfer"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setTab("transfer");
                setForm((f) => ({ ...f, isTransfer: true }));
              }}
            >
              Transfer
            </button>
          </div>
        </div>

       
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>

         
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>

         
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={form.division}
                onChange={(e) => setForm({ ...form, division: e.target.value })}
              >
                <option>Personal</option>
                <option>Office</option>
              </select>
            </div>

          
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

          
            {tab === "transfer" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Account
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="From account"
                    value={form.fromAccount}
                    onChange={(e) =>
                      setForm({ ...form, fromAccount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Account
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="To account"
                    value={form.toAccount}
                    onChange={(e) =>
                      setForm({ ...form, toAccount: e.target.value })
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

      
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg ${
              tab === "income"
                ? "bg-green-500 hover:bg-green-600"
                : tab === "expense"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
