export default function Expenses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/finance/expense").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Expenses</h2>

      {data.map(e => (
        <div key={e._id}>
          {e.title} - ₹{e.amount}
        </div>
      ))}
    </div>
  );
}