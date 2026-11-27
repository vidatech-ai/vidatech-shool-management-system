import RegisterForm from "./register-form";

export default function Page() {
  return (
    <main style={{ maxWidth: 560, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Start your 30-day free trial</h1>
      <p>No payment needed. Set up your school in minutes.</p>
      <RegisterForm />
    </main>
  );
}
