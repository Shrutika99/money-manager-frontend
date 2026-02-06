export default function Dashboard({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + (b.amount || 0), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + (b.amount || 0), 0);

  const balance = income - expense;


  const categoryTotals = transactions
    .filter((t) => t.category && t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + (t.amount || 0);
      return acc;
    }, {});

  return (
    <div className="space-y-6 mb-6">
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700 uppercase tracking-wide">Income</span>
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-green-800">₹{income.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-700 uppercase tracking-wide">Expense</span>
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-red-800">₹{expense.toLocaleString('en-IN')}</div>
        </div>

        <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'} border rounded-xl p-6 shadow-md`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'} uppercase tracking-wide`}>Balance</span>
            <svg className={`w-6 h-6 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
            ₹{balance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amt]) => (
                <div key={cat} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="text-sm text-gray-600 mb-1 capitalize">{cat}</div>
                  <div className="text-xl font-bold text-gray-800">₹{amt.toLocaleString('en-IN')}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
