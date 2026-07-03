import Link from "next/link";
import { AUTHOR_NAME, formatUpdated } from "@/lib/site";

export default function Byline() {
  return (
    <p className="byline">
      Von <strong><Link href="/ueber-uns">{AUTHOR_NAME}</Link></strong>, Gründer
      von immobilienmakler-in.com
      <span className="byline-sep">·</span>
      Zuletzt aktualisiert: {formatUpdated()}
    </p>
  );
}
