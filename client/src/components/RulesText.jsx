import React from "react";

function splitLines(text) {
  if (!text) return [];
  let t = text;
  t = t.replace(/\r\n/g, "\n");
  t = t.replace(/\s*[•●]\s*/g, "\n- ");
  t = t.replace(/\s+-\s+/g, "\n- ");
  t = t.replace(/\b([A-Z][A-Za-z &()]{2,28}):/g, "\n$1:");
  t = t.replace(/\s{2,}/g, " ");
  t = t.replace(/\s*\n\s*/g, "\n");
  return t
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^- /, ""));
}

export default function RulesText({ text }) {
  const content = (text || "").trim();
  if (!content) {
    return <p>No specific rules provided.</p>;
  }

  const normalized = content.replace(/\r\n/g, "\n").trim();
  const sections = normalized.split(/(?=\b\d+\)\s+)/g).filter((s) => s.trim());
  const hasNumberedSections = sections.length > 1;

  let intro = null;
  if (hasNumberedSections && !/^\s*\d+\)\s+/.test(sections[0])) {
    intro = sections.shift();
  }

  if (!hasNumberedSections) {
    const lines = splitLines(normalized);
    return (
      <ul className="list-disc pl-5 space-y-1">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      {intro ? <p>{intro}</p> : null}
      {sections.map((section, i) => {
        const match = section.match(/^\s*(\d+\))\s*(.*)$/);
        const label = match ? match[1] : `${i + 1})`;
        const body = match ? match[2] : section;
        const lines = splitLines(body);
        const heading = lines.length && !lines[0].includes(":") ? lines[0] : null;
        const items = heading ? lines.slice(1) : lines;

        return (
          <div key={`${label}-${i}`} className="space-y-2">
            <div className="font-semibold text-slate-200">
              {label} {heading || "Details"}
            </div>
            {items.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {items.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
