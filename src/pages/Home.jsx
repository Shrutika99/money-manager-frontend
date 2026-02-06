import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import Dashboard from "../components/Dashboard";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Home() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({
    division: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const loadData = async (extra = {}) => {
    const params = { ...filters, ...extra };
 
    if (params.startDate) {
      params.startDate = new Date(params.startDate + 'T00:00:00').toISOString();
    }
    if (params.endDate) {
  
      params.endDate = new Date(params.endDate + 'T23:59:59').toISOString();
    }

    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key];
      }
    });
    const res = await getTransactions(params);
    setData(res.data);
  };

  useEffect(() => {
    loadData();
 
  }, []);

  const applyFilters = async () => {
    await loadData();
  };

  const clearFilters = () => {
    setFilters({ division: "", category: "", startDate: "", endDate: "" });
    loadData({ division: "", category: "", startDate: "", endDate: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Money Manager</h1>
          <p className="text-gray-600">Track your income and expenses</p>
        </div>

   
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              value={filters.division}
              onChange={(e) =>
                setFilters({ ...filters, division: e.target.value })
              }
            >
              <option value="">All Divisions</option>
              <option value="Personal">Personal</option>
              <option value="Office">Office</option>
            </select>

            <input
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              placeholder="Category"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            />

            <input
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />

            <input
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />

            <button
              onClick={applyFilters}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Apply
            </button>
            <button 
              onClick={clearFilters} 
              className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>

      <Dashboard transactions={data} />

     
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h2>
          {data.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No transactions found</p>
              <p className="text-sm mt-2">Add a transaction to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((t) => {
                const baseDate =
                  t.createdAt || t.datetime || new Date().toISOString();
                const tDate = new Date(baseDate);
                const hoursAgo = (Date.now() - tDate.getTime()) / (1000 * 60 * 60);
                const canEdit = !isNaN(hoursAgo) && hoursAgo <= 12;
                const isIncome = t.type === "income";
                const isExpense = t.type === "expense";
                const isTransfer = t.type === "transfer";

                return (
                  <div
                    key={t._id || t.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isIncome 
                              ? "bg-green-100 text-green-700" 
                              : isExpense 
                              ? "bg-red-100 text-red-700" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {isIncome ? "Income" : isExpense ? "Expense" : "Transfer"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {tDate.toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="font-semibold text-lg text-gray-800 mb-1">
                          {t.description || t.category || "No description"}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">₹{t.amount.toLocaleString('en-IN')}</span>
                          <span className="text-gray-400">•</span>
                          <span>{t.division}</span>
                          {t.category && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="capitalize">{t.category}</span>
                            </>
                          )}
                        </div>
                        {isTransfer && (t.fromAccount || t.toAccount) && (
                          <div className="text-xs text-gray-500 mt-2">
                            {t.fromAccount && `From: ${t.fromAccount}`}
                            {t.fromAccount && t.toAccount && " → "}
                            {t.toAccount && `To: ${t.toAccount}`}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditing(t);
                          setOpen(true);
                        }}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          canEdit
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        }`}
                      >
                        {canEdit ? "Edit" : "Locked"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

     
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-2xl font-light z-40"
          title="Add Transaction"
        >
          +
        </button>

      {open && (
        <AddTransactionModal
          onClose={() => setOpen(false)}
          refresh={() => loadData()}
          transaction={editing}
        />
      )}
      </div>
    </div>
  );
}
