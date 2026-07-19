export const ROULETTE_WHEEL_CELEBRATION_STYLES = `
  .joker-roulette-wheel-composition {
    --roulette-wheel-size: 560px;
    --roulette-wheel-win-glow-offset-y: calc(var(--roulette-wheel-size) * 120 / 560);
    --roulette-wheel-win-glow-width: calc(100% * 700 / 1116);
    --roulette-wheel-win-glow-height: calc(100% * 400 / 1162);
    --roulette-wheel-win-glow-blur: calc(var(--roulette-wheel-size) * 36 / 560);
    --roulette-wheel-win-duration: 880ms;
    --roulette-wheel-win-ease: cubic-bezier(0.22, 1, 0.36, 1);

    position: relative;
    display: inline-flex;
    width: var(--roulette-wheel-size);
    height: calc(var(--roulette-wheel-size) * 1162 / 1111);
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    overflow: visible;
  }

  .joker-roulette-wheel-composition__wheel {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: visible;
    transform: scale(1);
    transform-origin: center center;
    will-change: transform;
  }

  .joker-roulette-wheel-composition[data-win-active] .joker-roulette-wheel-composition__wheel {
    animation: joker-roulette-wheel-win-pulse var(--roulette-wheel-win-duration) var(--roulette-wheel-win-ease) both;
  }

  .joker-roulette-wheel-win__backdrop {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .joker-roulette-wheel-win__glow {
    position: absolute;
    left: 50%;
    top: var(--roulette-wheel-win-glow-offset-y);
    z-index: 0;
    width: var(--roulette-wheel-win-glow-width);
    height: var(--roulette-wheel-win-glow-height);
    transform: translateX(-50%);
    pointer-events: none;
    opacity: 0;
    background: radial-gradient(
      ellipse at 50% 53%,
      rgb(255 222 168 / 1) 0%,
      rgb(250 208 148 / 0.9) 42%,
      rgb(255 222 168 / 0.16) 68%,
      transparent 100%
    );
    filter: blur(var(--roulette-wheel-win-glow-blur));
    will-change: opacity, transform;
  }

  .joker-roulette-wheel-composition[data-win-active] .joker-roulette-wheel-win__glow {
    animation: joker-roulette-wheel-win-glow var(--roulette-wheel-win-duration) var(--roulette-wheel-win-ease) both;
  }

  .joker-roulette-wheel-win__glow--lose {
    background: radial-gradient(
      ellipse at 50% 53%,
      rgb(255 120 120 / 1) 0%,
      rgb(220 72 72 / 0.9) 42%,
      rgb(180 40 40 / 0.16) 68%,
      transparent 100%
    );
  }

  .joker-roulette-wheel-composition[data-lose-active] .joker-roulette-wheel-composition__wheel {
    animation: joker-roulette-wheel-lose-shake var(--roulette-wheel-win-duration) var(--roulette-wheel-win-ease) both;
  }

  .joker-roulette-wheel-composition[data-lose-active] .joker-roulette-wheel-win__glow {
    animation: joker-roulette-wheel-lose-glow var(--roulette-wheel-win-duration) var(--roulette-wheel-win-ease) both;
  }

  .joker-roulette-wheel-composition[data-lose-active] .joker-roulette-wheel-win__fx {
    display: none;
  }

  .joker-roulette-wheel-win__fx {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .joker-roulette-wheel-win__particles {
    position: absolute;
    inset: auto;
    width: 0;
    height: 0;
  }

  .joker-roulette-wheel-win__particle {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(var(--roulette-wheel-size) * 9 / 560);
    height: calc(var(--roulette-wheel-size) * 9 / 560);
    border-radius: 50%;
    background: radial-gradient(
      circle at 32% 28%,
      rgb(255 255 255 / 0.92) 0%,
      rgb(255 222 168 / 1) 34%,
      rgb(250 208 148 / 1) 100%
    );
    box-shadow:
      0 0 calc(var(--roulette-wheel-size) * 7 / 560) rgb(255 222 168 / 0.72),
      0 0 calc(var(--roulette-wheel-size) * 2 / 560) rgb(255 255 255 / 0.8);
    opacity: 0;
    transform: translate(-50%, -50%);
    animation: joker-roulette-wheel-win-particle-burst 920ms var(--roulette-wheel-win-ease) both;
  }

  .joker-roulette-wheel-win__particle:nth-child(1) { --particle-x: calc((var(--spacing-40) + var(--spacing-16)) * -1); --particle-y: calc(var(--spacing-40) * -1); }
  .joker-roulette-wheel-win__particle:nth-child(2) { --particle-x: calc(var(--spacing-40) * -1); --particle-y: calc((var(--spacing-40) + var(--spacing-16)) * -1); animation-delay: 16ms; }
  .joker-roulette-wheel-win__particle:nth-child(3) { --particle-x: calc(var(--spacing-24) * -1); --particle-y: calc(var(--spacing-64) * -1); animation-delay: 6ms; }
  .joker-roulette-wheel-win__particle:nth-child(4) { --particle-x: calc(var(--spacing-8) * -1); --particle-y: calc((var(--spacing-64) + var(--spacing-8)) * -1); animation-delay: 24ms; }
  .joker-roulette-wheel-win__particle:nth-child(5) { --particle-x: 0px; --particle-y: calc((var(--spacing-64) + var(--spacing-16)) * -1); animation-delay: 10ms; }
  .joker-roulette-wheel-win__particle:nth-child(6) { --particle-x: var(--spacing-8); --particle-y: calc((var(--spacing-64) + var(--spacing-8)) * -1); animation-delay: 28ms; }
  .joker-roulette-wheel-win__particle:nth-child(7) { --particle-x: var(--spacing-24); --particle-y: calc(var(--spacing-64) * -1); animation-delay: 4ms; }
  .joker-roulette-wheel-win__particle:nth-child(8) { --particle-x: var(--spacing-40); --particle-y: calc((var(--spacing-40) + var(--spacing-16)) * -1); animation-delay: 20ms; }
  .joker-roulette-wheel-win__particle:nth-child(9) { --particle-x: calc(var(--spacing-40) + var(--spacing-16)); --particle-y: calc(var(--spacing-40) * -1); animation-delay: 12ms; }
  .joker-roulette-wheel-win__particle:nth-child(10) { --particle-x: calc((var(--spacing-64) + var(--spacing-8)) * -1); --particle-y: calc(var(--spacing-24) * -1); animation-delay: 22ms; }
  .joker-roulette-wheel-win__particle:nth-child(11) { --particle-x: calc(var(--spacing-64) + var(--spacing-8)); --particle-y: calc(var(--spacing-24) * -1); animation-delay: 8ms; }
  .joker-roulette-wheel-win__particle:nth-child(12) { --particle-x: calc((var(--spacing-32) + var(--spacing-16)) * -1); --particle-y: calc((var(--spacing-32) + var(--spacing-16)) * -1); animation-delay: 18ms; }
  .joker-roulette-wheel-win__particle:nth-child(13) { --particle-x: calc(var(--spacing-32) + var(--spacing-16)); --particle-y: calc((var(--spacing-32) + var(--spacing-16)) * -1); animation-delay: 14ms; }
  .joker-roulette-wheel-win__particle:nth-child(14) { --particle-x: calc(var(--spacing-32) * -1); --particle-y: calc((var(--spacing-64) + var(--spacing-16)) * -1); animation-delay: 2ms; }

  @keyframes joker-roulette-wheel-win-pulse {
    0% { transform: scale(1); }
    40% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  @keyframes joker-roulette-wheel-win-glow {
    0% { opacity: 0; transform: translateX(-50%) scale(0.94); }
    40% { opacity: 1; transform: translateX(-50%) scale(0.98); }
    100% { opacity: 0; transform: translateX(-50%) scale(0.95); }
  }

  @keyframes joker-roulette-wheel-lose-glow {
    0% { opacity: 0; transform: translateX(-50%) scale(0.94); }
    40% { opacity: 1; transform: translateX(-50%) scale(0.98); }
    100% { opacity: 0; transform: translateX(-50%) scale(0.95); }
  }

  @keyframes joker-roulette-wheel-lose-shake {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(calc(var(--roulette-wheel-size) * -0.01)); }
    20% { transform: translateX(calc(var(--roulette-wheel-size) * 0.009)); }
    30% { transform: translateX(calc(var(--roulette-wheel-size) * -0.007)); }
    40% { transform: translateX(calc(var(--roulette-wheel-size) * 0.006)); }
    50% { transform: translateX(calc(var(--roulette-wheel-size) * -0.004)); }
    60% { transform: translateX(calc(var(--roulette-wheel-size) * 0.003)); }
    70% { transform: translateX(calc(var(--roulette-wheel-size) * -0.002)); }
    80% { transform: translateX(calc(var(--roulette-wheel-size) * 0.001)); }
  }

  @keyframes joker-roulette-wheel-win-particle-burst {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.12); }
    10% { opacity: 0.55; }
    18% { opacity: 1; transform: translate(-50%, -50%) scale(0.55); }
    72% { opacity: 0.88; }
    100% { opacity: 0; transform: translate(calc(-50% + var(--particle-x)), calc(-50% + var(--particle-y))) scale(0.42); }
  }

  @media (prefers-reduced-motion: reduce) {
    .joker-roulette-wheel-composition[data-win-active] .joker-roulette-wheel-composition__wheel,
    .joker-roulette-wheel-composition[data-lose-active] .joker-roulette-wheel-composition__wheel {
      animation: none;
      transform: none;
    }

    .joker-roulette-wheel-composition[data-win-active] .joker-roulette-wheel-win__glow,
    .joker-roulette-wheel-composition[data-lose-active] .joker-roulette-wheel-win__glow {
      animation: none;
      opacity: 0.72;
    }

    .joker-roulette-wheel-win__particle {
      animation: none !important;
    }
  }
`;
