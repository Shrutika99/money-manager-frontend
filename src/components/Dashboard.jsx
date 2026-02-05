export default function Dashboard({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-green-100 p-4">Income: ₹{income}</div>
      <div className="bg-red-100 p-4">Expense: ₹{expense}</div>
      <div className="bg-gray-100 p-4">Balance: ₹{income - expense}</div>
    </div>
  );
}
