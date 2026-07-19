const PARTICLE_COUNT = 14;
const PARTICLE_BURST_MS = 920;

export function burstRouletteWinParticles(container) {
  if (!container) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  container.replaceChildren();

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const particle = document.createElement("span");
    particle.className = "joker-roulette-wheel-win__particle";
    particle.setAttribute("aria-hidden", "true");
    container.appendChild(particle);
  }

  window.setTimeout(() => {
    container.replaceChildren();
  }, PARTICLE_BURST_MS + 40);
}
