// src/echo-listeners.js
import { toast } from 'react-toastify'
import echo from './echo'

let userChannel = null

export function attachUserListeners(user) {
    if (!user || !user.id) return

    // Prevent duplicate subscriptions
    if (userChannel) return

    const channelName = `post-published`
    console.log(channelName);


    userChannel = echo.private(channelName)

    userChannel.listen('.PostPublished', (e) => {
        if (!e.post) return
        if (e.post.author?.id === user.id) {
            return
        }
        console.log('Post published:', e)
        toast.info(`New post published: ${e.post.title}`, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
    })
}

export function detachUserListeners() {
    if (!userChannel) return
    console.log('Detaching user listeners:', userChannel.name);

    echo.leave(`private-${userChannel.name}`)
    userChannel = null
}
