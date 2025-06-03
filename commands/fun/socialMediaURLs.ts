const socialMediaEmbedURLs = new Map<string, string>([
  ["https://x.com", "https://fxtwitter.com"],
  ["https://twitter.com", "https://fxtwitter.com"],
  ["https://instagram.com/reel", "https://kkinstagram.com/reel"],
  ["https://www.instagram.com/reel", "https://kkinstagram.com/reel"]
])

export function fixSocialMediaURLs(text: string): string | null {
  let hasBadUrl = false

  for (const badUrl of socialMediaEmbedURLs.keys()) {
    if (text.includes(badUrl)) {
      hasBadUrl = true
      break
    }
  }

  if (!hasBadUrl) {
    return null
  }

  for (const [badUrl, replacement] of socialMediaEmbedURLs.entries()) {
    const regex = new RegExp(`\\b${badUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
    text = text.replace(regex, replacement)
  }

  return text
}