const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen bg-slate-100">
      <main className="flex items-center justify-center">{children}</main>
    </div>
  );
};

export default AuthLayout;
