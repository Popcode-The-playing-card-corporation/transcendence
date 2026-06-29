import { useEffect, useState } from "react";
import NotifProvider from "./components/contexts/NotifContext";
import AuthProvider from "./components/contexts/AuthContext";
import AppContent from "./AppContent";
import { preloadCards } from "./utils/imports/textures";

function App() {
  const [fontChoice, setFontChoice] = useState("font-Cause");

  useEffect(() => {
	preloadCards();
  }, [])

  return (
	<AuthProvider>
    <NotifProvider>
      <main
        className={
          "bg-(--bg-color) text-(--font-color) ContentFooterContainer flex flex-col justify-between min-h-dvh " +
          fontChoice
        }
      >
		<AppContent setFontChoice={setFontChoice}></AppContent>
		
      </main>
    </NotifProvider>
	</AuthProvider>
  );
}

export default App;
