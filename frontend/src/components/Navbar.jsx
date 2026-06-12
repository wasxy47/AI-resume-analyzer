import heroMark from "../assets/hero.png";
import Icon from "./Icon";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-[200] border-b border-[var(--border)] bg-[rgba(8,9,7,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white/[0.04]">
            <img src={heroMark} alt="" className="h-7 w-7 object-contain" />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-extrabold leading-tight text-[var(--text-primary)]">ResumeAI</div>
            <div className="hidden text-[12px] font-semibold text-[var(--text-muted)] sm:block">Hiring signal engine</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="chip">
            <Icon name="shield" size={14} />
            ATS Ready
          </span>
          <span className="chip chip-accent">
            <Icon name="bolt" size={14} />
            Groq Powered
          </span>
        </div>

        <a href="#upload" className="btn btn-secondary h-10 min-h-10 px-4">
          <Icon name="upload" size={16} />
          Upload
        </a>
      </div>
    </nav>
  );
}
