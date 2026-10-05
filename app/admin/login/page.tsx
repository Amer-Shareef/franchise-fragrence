import { LoginForm } from "@/components/admin/login-form";

export default function AdminLogin() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#F6F1E8] px-5 py-10">
      <div
        aria-hidden="true"
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#EAE1D2]/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#174D3D]/5 blur-3xl"
      />

      <div className="relative z-10 w-full">
        <LoginForm />
      </div>
    </main>
  );
}
