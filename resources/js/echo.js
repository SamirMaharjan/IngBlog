import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
  wsPort: import.meta.env.VITE_PUSHER_PORT,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
   forceTLS: false,
  encrypted: false,

  enabledTransports: ['ws', 'wss'],
  auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('rb_token')}`, // if API token
            // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // if session
        },
    },
    authEndpoint: '/broadcasting/auth',
    withCredentials: true // important for SPA auth
})

export default echo
