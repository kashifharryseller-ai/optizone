// Google OAuth return handler. The server callback redirects to /#gtoken=<jwt>
// (success) or /#gerror=<message> (failure). On app load we read the hash,
// adopt the token (hydrating the session), surface any error via oz_auth_error
// in sessionStorage for the account page, then strip the hash from the URL.
export default defineNuxtPlugin(async () => {
  if (!import.meta.client) return
  const hash = window.location.hash || ''
  if (!hash.includes('gtoken=') && !hash.includes('gerror=')) return

  const params = new URLSearchParams(hash.slice(1))
  const gtoken = params.get('gtoken')
  const gerror = params.get('gerror')
  const { adoptToken } = useAuth()

  if (gtoken) {
    try { await adoptToken(gtoken) } catch { /* invalid token — ignored */ }
  } else if (gerror) {
    try { sessionStorage.setItem('oz_auth_error', gerror) } catch { /* noop */ }
  }
  // Clean the hash so a refresh doesn't re-process it.
  history.replaceState(null, '', window.location.pathname + window.location.search)
})
