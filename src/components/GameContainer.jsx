import logo from "../assets/JUWhite.png";

export default function GameContainer({ children }) {
  return (
    <main className="container border-[#343b47] border rounded-md w-[90dvw] h-[90dvh] flex flex-col items-center mx-auto  bg-[#111212]">	
      <header className="w-full flex justify-between items-center px-10">
        <h1 className="text-xl font-bold text-white mt-0">Diagrama de venn</h1>
        <img src={logo.src} alt="logo" className="w-10 mt-10" />
      </header>
      {children}
    </main>
  );
}