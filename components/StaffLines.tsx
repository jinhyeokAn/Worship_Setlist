export default function StaffLines() {
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-5 w-full text-[var(--rule)]"
    >
      {[2, 7, 12, 17, 22].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="400"
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}
