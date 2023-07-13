import Moon from "../assets/icon-moon.svg";
import Sun from "../assets/icon-sun.svg";
import { ReactNode } from "react";
import { useThemeContext } from "./Theme";

// Allow content to sit inside of header = children
interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { isDarkTheme, toggleTheme } = useThemeContext();
  return (
    <header className={isDarkTheme ? "" : "light"}>
      <div className="flex">
        <h1>TODO</h1>
        <button onClick={toggleTheme}>
          <img src={isDarkTheme ? Sun : Moon} alt="img-toggle" />
        </button>
      </div>
      <div className="child-header">{children}</div>
    </header>
  );
}
