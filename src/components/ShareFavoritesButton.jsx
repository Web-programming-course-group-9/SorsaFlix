import { useState } from "react"

function ShareFavoritesButton({ userId }) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  const shareUrl = `${window.location.origin}/shared/favorites/${userId}`


    async function handleShare() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setCopyFailed(false)

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setCopyFailed(true)
    }
  }

    return (
    <div className="share-favorites">
      <button onClick={handleShare}>
        {copied ? "Link copied!" : "Share"}
      </button>

      {copyFailed && (
        <p>
          Copy this link: <input type="text" value={shareUrl} readOnly />
        </p>
      )}
    </div>
  )
}

export default ShareFavoritesButton

