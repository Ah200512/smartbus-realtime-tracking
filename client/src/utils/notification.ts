export const playNotification = () => {
const audio = new Audio("/notification.mp3")
audio.volume = 0.7
audio.play().catch(() => {})
}
