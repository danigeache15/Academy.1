import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import Book from "../../book/Book";
import "../../book/book.css";

// Proposal B: the academy told as an enchanted book. The live site at "/" is unchanged.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant" });
const garamond = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-garamond" });

export const metadata = {
  title: "The Voice Within — Communicate Academy",
  description:
    "Everything you need is already inside you. An online English and communication academy for B1+ students who want to find their voice — told as a story.",
};

export default function ProposalB() {
  return (
    <div className={`${cormorant.variable} ${garamond.variable}`}>
      <Book />
    </div>
  );
}
