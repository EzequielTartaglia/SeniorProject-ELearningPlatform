export default function Title({ text, customClasses = "", textPositionClass = 'text-center', textColorClass = 'text-title-primary' }) {
  return (
    <h2 className={`text-4xl font-bold ${textColorClass} ${textPositionClass} mt-8 ${customClasses}`}>{text}</h2>
  );
}
