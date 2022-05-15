function Navbar() {
  return (
    <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">
          Navbar
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          {/* <ul class="px-5"></ul>
          <ul class="px-5"></ul>
          <ul class="px-5"></ul> */}
          <ul class="navbar-nav flex-row mx-auto d-flex justify-content-around w-50">
            <li class="nav-item active">
              <a class="nav-link active" href="#">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                My Surveys
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Wishlist
              </a>
            </li>
          </ul>
          <ul class="navbar-nav flex-row">
            <li class="nav-item active">
              <a class="nav-link active" href="#">
                <img src="https://placekitten.com/30/30"></img>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <img src="https://placekitten.com/30/30"></img>
              </a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Henry Wong
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a class="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Log out
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
