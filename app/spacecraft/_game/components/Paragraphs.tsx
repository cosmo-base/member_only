export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split('\n\n')
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="body-text">
            {p}
          </p>
        ))}
    </>
  );
}
