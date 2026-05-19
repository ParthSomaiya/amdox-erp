export default function PermissionMatrix() {
  return (
    <div>
      <h2 className="text-xl font-bold">Permissions</h2>

      <table className="w-full mt-4">
        <thead>
          <tr>
            <th>Module</th>
            <th>Create</th>
            <th>Read</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Invoice</td>
            <td><input type="checkbox" /></td>
            <td><input type="checkbox" /></td>
            <td><input type="checkbox" /></td>
            <td><input type="checkbox" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}