import "@/app/globals.css";

import ButtonSliderSection from "./_components/ButtonSliderSection";
import SearchBarSection from "./_components/SearchBarSection";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <ButtonSliderSection />
      <SearchBarSection />
    </main>
  );
}
