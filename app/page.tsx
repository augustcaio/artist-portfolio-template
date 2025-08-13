import { Navbar } from "@/components/Navbar";
import { Profile } from "@/components/Profile";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Profile />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}
