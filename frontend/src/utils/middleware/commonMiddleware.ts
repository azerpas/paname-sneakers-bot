import cookieSession from './cookieSession'
import cookieSessionRefresh from './cookieRefresh'

export default function commonMiddleware(handler: any) {
  return cookieSession(cookieSessionRefresh(handler))
}