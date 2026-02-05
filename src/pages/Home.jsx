import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import Dashboard from "../components/Dashboard";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Home() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const loadData = async () => {
    const res = await getTransactions();
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">
      <Dashboard transactions={data} />
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full px-6 py-3"
      >
        +
      </button>

      {open && (
        <AddTransactionModal
          onClose={() => setOpen(false)}
          refresh={loadData}
        />
      )}
    </div>
  );
}
