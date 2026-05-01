export default function EventCreateForm() {
  return (
    <div className="mb-6 rounded border p-4 max-w-xl">
      <h2 className="mb-2 text-lg font-bold">イベント作成</h2>
      <input placeholder="タイトル" className="mb-2 w-full border p-2" />
      <textarea placeholder="内容" className="mb-2 w-full border p-2" />
      <button className="rounded bg-blue-500 px-4 py-2 text-white">作成</button>
    </div>
  );
}
