import styles from "./WishlistPage.module.css";
import Navbar from "../navbar/Navbar";
import Body from "../Body/Body";

function WishlistPage() {
  return (
    <>
      <Navbar />
      <Body page="Wishlist" />
    </>
  );
}

export default WishlistPage;
