import "@/app/globals.css";

import ButtonSliderSection from "./_components/ButtonSliderSection";
import SearchBarSection from "./_components/SearchBarSection";
import TableSection from "./_components/TableSection";

export default function App() {
  return (
    <main className="flex flex-col justify-center items-center">
      <ButtonSliderSection />
      <SearchBarSection />
      <TableSection />
    </main>
  );
}
