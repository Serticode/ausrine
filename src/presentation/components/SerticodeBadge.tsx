export function SerticodeBadge() {
  return (
    <a
      href="https://portfolio.serticode.com"
      target="_blank"
      rel="noopener noreferrer"
      className="serticode-badge group fixed bottom-6 right-6 z-100 flex items-center gap-3 select-none"
      style={{ padding: '4px 8px', borderRadius: '12px', transform: 'rotate(-3.5deg)' }}
    >
      {/* Pin — matches serti0x pg__card__pin: gold circle, dark fill */}
      <div
        className="flex-shrink-0"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          border: '1px solid #c8a96e',
          backgroundColor: '#171717',
        }}
      />

      <span className="serticode-badge__text font-heading text-[0.7rem] font-bold">By Serticode</span>
      <span className="serticode-badge__arrow text-[1rem] leading-none">↗</span>
    </a>
  );
}
