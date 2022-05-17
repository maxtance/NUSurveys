import React from "react";
import NavBar from "../components/navbar/Navbar";

function NavBarWrapper(Component) {
    return () => (
        <>
          <header>
            <NavBar />
          </header>
          <main style={{paddingTop: '5%', backgroundColor: '#f9f9f9'}}>
            <Component />
          </main>
        </>
    )
}

export default NavBarWrapper;