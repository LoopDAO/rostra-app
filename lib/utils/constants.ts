export function canUseDOM(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  )
}

export const links = {
  twitter: "https://twitter.com/loop_dao",
  discord: "https://discord.gg/c6BfH8JQn6",
  github: "https://github.com/LoopDAO/rostra-app",
  mirror: "https://mirror.xyz/0x22Acb9bb4A79b462B55049ba972608545C50e6fC/5vWc8a1eLCPXLqHILz9YCesNUmn89z0T5r19eOAsuMs",
  notion: "https://rostra.notion.site",
}

export const isBrowser = canUseDOM()
