// Toast notification utility
let toastContainer = null
// Track recently shown messages to avoid duplicates (message+type)
const recentMessages = new Map()

export const showToast = (message, type = 'success', duration = 3000) => {
  // Prevent identical rapid duplicate toasts
  try {
    const key = `${type}:${message}`
    const now = Date.now()
    const last = recentMessages.get(key)
    if (last && now - last < 2000) {
      return
    }
    recentMessages.set(key, now)
    // clear the guard after the toast would be gone
    setTimeout(() => recentMessages.delete(key), duration + 500)
  } catch (e) {
    // ignore guard errors
  }

  // Create toast container if it doesn't exist
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.style.cssText = `
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
    min-width: 250px;
    max-width: 400px;
  `

  toast.textContent = message

  // Make toast clickable to dismiss
  toast.style.cursor = 'pointer'
  const removeToast = () => {
    toast.style.animation = 'slideOut 0.3s ease-out'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }
  toast.addEventListener('click', removeToast)

  // Add animation
  const style = document.createElement('style')
  if (!document.getElementById('toast-animations')) {
    style.id = 'toast-animations'
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  toastContainer.appendChild(toast)

  // Remove toast after duration
  setTimeout(() => {
    removeToast()
  }, duration)
}
