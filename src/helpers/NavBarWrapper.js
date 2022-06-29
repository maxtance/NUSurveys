import React from "react";
import NavBar from "../components/navbar/Navbar";

function NavBarWrapper(Component) {
  return () => (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <Component />
      </main>
    </>
  );
}

export default NavBarWrapper;
