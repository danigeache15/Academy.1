import { Fraunces } from "next/font/google";
import ProposalB from "../../proposal-b/ProposalB";
import "../../proposal-b/proposal-b.css";

// Proposal B: white pages with night-sky city strips. The live site at "/" is unchanged.
const serif = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz", "SOFT", "WONK"], variable: "--font-fraunces" });

export const metadata = {
  title: "Communicate Academy — Let what's already inside you speak",
  description:
    "Online English and communication academy for B1+ university students and young professionals who want to speak with confidence — for better jobs, travel and international connections.",
};

export default function ProposalBPage() {
  return (
    <div className={serif.variable}>
      <ProposalB />
    </div>
  );
}
