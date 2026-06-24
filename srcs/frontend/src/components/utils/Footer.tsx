import { FaGithub } from "react-icons/fa";
import { SiOnlyfans } from "react-icons/si";

export function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-primary p-5 mt-6 relative bottom-0">
      <aside>
        <p>
          PopCode industries
          <br />
          Copyright © {new Date().getFullYear()} PopCode team. All Right Reserved.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Social</h6>
        <div className="grid grid-flow-col gap-4">
          <a className="text-xl hover:scale-110" href="https://github.com/Cyraullie/transcendence" target="_blank">
            <FaGithub />
          </a>
          <a   className="text-xl hover:scale-110" href="https://cornhub.website/" target="_blank">
            <SiOnlyfans />
          </a>
        </div>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <div className="grid grid-flow-col gap-4">
          <a href="/PrivacyPolicy" className="link-hover">Privacy Policy</a>
          <a href="/TermsOfService" className="link-hover" >Terms of service</a>
        </div>
      </nav>
      </footer>
  );
}
