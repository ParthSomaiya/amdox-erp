export default function Card({
  title,
  value,
}) {

  return (

    <div className="bg-white shadow rounded p-5">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>

    </div>

  );

}