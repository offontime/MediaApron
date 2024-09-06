export const secondsToTimeFormat = (num: number) => {
  const seconds = Math.round(num)
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const sec = remainingSeconds % 60;

  let formattedTime = "";
  if (hours > 0) {
      formattedTime += `${hours.toString().padStart(2, '0')}:`;
  }
  formattedTime += `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;

  return formattedTime;
}
