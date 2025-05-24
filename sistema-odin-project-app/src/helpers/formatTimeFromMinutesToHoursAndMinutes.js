export default function formatTimeFromMinutesToHoursAndMinutes(timeInMinutes) {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return { hours, minutes };
}
