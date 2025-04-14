import "./globals.css";
// import Navbar from "@/app/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div>
          {/* <Navbar /> */}
          <main className="w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
