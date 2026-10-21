export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrap max-w-3xl py-12 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:mt-1 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}
