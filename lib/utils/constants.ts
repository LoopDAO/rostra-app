export function canUseDOM(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  )
}

export const isBrowser = canUseDOM()

export const ZERO_GUILD_ID = '0x0000000000000000000000000000000000000000000000000000000000000000'