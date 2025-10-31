export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-secondary">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-heading text-center mb-4">Login</h2>
        <input type="email" placeholder="Email" className="p-2 border rounded"/>
        <input type="password" placeholder="Password" className="p-2 border rounded"/>
        <button className="bg-accent text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
