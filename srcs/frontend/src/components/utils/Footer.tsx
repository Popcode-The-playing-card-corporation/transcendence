import { FaGithub } from "react-icons/fa";
import { SiOnlyfans } from "react-icons/si";
import { useAuth } from "../hooks/useAuth";

export function Footer() {
  const auth = useAuth();

  return (
    <footer className={"footer sm:footer-horizontal flex max-sm:flex-wrap bg-primary p-5 mt-6 justify-between relative bottom-0" + (auth.in_game ? " lg:hidden" : "")}>
      <div className="w-full">
        <p>
          PopCode industries
          <br />
          Copyright © {new Date().getFullYear()} PopCode team. All Right Reserved.
        </p>
      </div>
      <nav className="w-full text-center items-center">
        <h6 className="footer-title w-full">Social</h6>
        <div className="w-full justify-center flex gap-4">
          <a className="text-xl hover:scale-110" href="https://github.com/Cyraullie/transcendence" target="_blank">
            <FaGithub />
          </a>
          <a className="text-xl hover:scale-110" href="https://cornhub.website/" target="_blank">
            <SiOnlyfans />
          </a>
        </div>
      </nav>
      <nav className="w-full text-center md:justify-endx">
        <h6 className="footer-title w-full">Legal</h6>
        <div className="flex w-full justify-center gap-4">
          <a href="/PrivacyPolicy" className="link-hover">Privacy Policy</a>
          <a href="/TermsOfService" className="link-hover" >Terms of service</a>
        </div>
      </nav>
    </footer>
  );
}
