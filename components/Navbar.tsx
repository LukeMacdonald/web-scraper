import Link from "next/link";
import Image from "next/image";
import React from "react";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/black-heart.svg", alt: "heart" },
  { src: "/assets/icons/user.svg", alt: "user" },
];

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/money.png"
            height={27}
            width={27}
            alt="logo"
            className="mr-2"
          />
          <p className="nav-logo">
            Amazon<span className="text-orange-500">Saver</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <Image
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              height={27}
              width={27}
            />
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

