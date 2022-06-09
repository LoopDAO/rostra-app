export function canUseDOM(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  )
}

export const links = {
  twitter: "https://twitter.com/loop_dao"
}

export const isBrowser = canUseDOM()
