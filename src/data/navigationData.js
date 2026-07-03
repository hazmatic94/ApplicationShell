export const navigationIconAssets = {
  home: new URL("../../assets/nav-icons/home.svg", import.meta.url).href,
  favourites: new URL("../../assets/nav-icons/favourites.svg", import.meta.url).href,
  "recently-played": new URL("../../assets/nav-icons/recently-played.svg", import.meta.url).href,
  "new-releases": new URL("../../assets/nav-icons/new-releases.svg", import.meta.url).href,
  crash: new URL("../../assets/nav-icons/crash.svg", import.meta.url).href,
  "chicken-cross": new URL("../../assets/nav-icons/chicken-cross.svg", import.meta.url).href,
  mines: new URL("../../assets/nav-icons/mines.svg", import.meta.url).href,
  "hi-lo": new URL("../../assets/nav-icons/hi-lo.svg", import.meta.url).href,
  tower: new URL("../../assets/nav-icons/tower.svg", import.meta.url).href,
  casino: new URL("../../assets/nav-icons/casino.svg", import.meta.url).href,
  soccer: new URL("../../assets/nav-icons/soccer.svg", import.meta.url).href,
  "live-support": new URL("../../assets/nav-icons/live-support.svg", import.meta.url).href,
  rewards: new URL("../../assets/nav-icons/rewards.svg", import.meta.url).href,
};

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function withBase(path) {
  return `${basePath}${path}`;
}

export const navigationItemRegistry = {
  home: { label: "Home", icon: "home", href: withBase("/home"), section: "home" },
  favourites: { label: "Favourites", icon: "favourites", href: withBase("/favourites"), section: "home" },
  recentlyPlayed: { label: "Recently Played", icon: "recently-played", href: withBase("/recently-played"), section: "home" },
  newReleases: { label: "New Releases", icon: "new-releases", href: withBase("/new-releases"), section: "home" },
  originals: { label: "Originals", icon: "sparkles", section: "games" },
  crash: { label: "Crash", icon: "crash", value: "crash", section: "games" },
  chickenCross: { label: "Chicken Cross", icon: "chicken-cross", value: "chicken-cross", section: "games" },
  mines: { label: "Mines", icon: "mines", value: "mines", section: "games" },
  hilo: { label: "Hilo", icon: "hi-lo", value: "hilo", section: "games" },
  tower: { label: "Tower", icon: "tower", value: "tower", section: "games" },
  casino: { label: "Casino", icon: "casino", section: "games" },
  promotions: { label: "Promotions", icon: "gift", section: "games" },
  soccer: { label: "Soccer", icon: "soccer", href: withBase("/sports/soccer"), section: "games" },
  liveSupport: { label: "Live Support", icon: "live-support", href: withBase("/support"), section: "misc" },
  rewards: { label: "Rewards", icon: "rewards", href: withBase("/rewards"), section: "misc" },
  logout: { label: "Log Out", icon: "log-out", href: withBase("/logout"), section: "account", tone: "danger" },
  wallet: { label: "Wallet", icon: "wallet", href: withBase("/wallet"), section: "topRail" },
  notifications: { label: "Notifications", icon: "bell", section: "topRail" },
  messages: { label: "Messages", icon: "message-square", section: "topRail" },
};

export const gameMenuItems = [
  navigationItemRegistry.crash,
  navigationItemRegistry.chickenCross,
  navigationItemRegistry.mines,
  navigationItemRegistry.hilo,
  navigationItemRegistry.tower,
].map((item, index) => ({
  ...item,
  selected: index === 0,
}));

export const shellBalance = "150,000";

export const shellRailSections = {
  home: [
    navigationItemRegistry.home,
    navigationItemRegistry.favourites,
    navigationItemRegistry.recentlyPlayed,
    navigationItemRegistry.newReleases,
  ],
  games: [
    navigationItemRegistry.originals,
    navigationItemRegistry.casino,
    navigationItemRegistry.promotions,
    navigationItemRegistry.soccer,
  ],
  support: [
    navigationItemRegistry.liveSupport,
    navigationItemRegistry.rewards,
  ],
};
