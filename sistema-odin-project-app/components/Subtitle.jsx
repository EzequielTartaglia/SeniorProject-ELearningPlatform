export default function Subtitle({ text, customClasses = "", textPositionClass = 'text-center', textColorClass = 'text-title-primary', marginPositionClasses = 'mt-8 mb-5', }) {
  return (
    <h2 className={`text-2xl font-bold ${textColorClass} ${textPositionClass} ${marginPositionClasses} ${customClasses}`}>{text}</h2>
  );
}
