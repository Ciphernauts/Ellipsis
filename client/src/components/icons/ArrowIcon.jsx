export default function ArrowIcon({ className, color = "var(--primary)" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="14"
      viewBox="0 0 9 14"
      fill="none"
      className={`${className} arrow-icon-default-styling`}
    >
      <path
        d="M1.5 1.16666L7.33333 6.99999L1.5 12.8333"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
