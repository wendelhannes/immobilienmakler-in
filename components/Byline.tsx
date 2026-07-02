import { EDITOR_NAME, formatUpdated } from "@/lib/site";

export default function Byline() {
  return (
    <p className="byline">
      Von der <strong>{EDITOR_NAME}</strong>
      <span className="byline-sep">·</span>
      Zuletzt aktualisiert: {formatUpdated()}
    </p>
  );
}
