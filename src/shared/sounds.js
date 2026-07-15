export function playSound(src, volume = 0.8) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {});
}
