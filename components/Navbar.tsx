import Link from "next/link";

const Navbar = () => {
  return (
    <header className="px-5 absolute z-10 left-0 top-0 w-full bg-transparent">
      <nav className="nav flex justify-between">
        <h1 className="opacity-0">AmazonTracker</h1>
        <Link href="/" target="_blank">
          <p>Home</p>
        </Link>
      </nav>
    </header>
  );
};
export default Navbar;
