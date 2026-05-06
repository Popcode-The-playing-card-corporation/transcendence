import { FaGithub } from "react-icons/fa";
import { SiOnlyfans } from "react-icons/si";

export function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-(--nav-color) p-8 mt-6">
      <aside>
        <p>
          PopCode industries
          <br />
          Copyright (c) 2026 PopCode team. All Rights Reserved.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Social</h6>
        <div className="grid grid-flow-col gap-4">
          <a className="text-xl hover:scale-110" href="https://github.com/Cyraullie/transcendence" target="_blank">
            <FaGithub />
          </a>
          <a  className="text-xl hover:scale-110" href="https://cornhub.website/" target="_blank">
            <SiOnlyfans />
          </a>
        </div>
      </nav>
    </footer>
  );
}
