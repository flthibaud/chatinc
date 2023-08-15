import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class GoogleSignInsController {
  public async redirect({ ally }: HttpContextContract) {
    return ally.use('google').redirect((redirectUrlBuilder) => {
      redirectUrlBuilder.param('redirect_url', 'http://localhost:3000')
    })
  }

  public async handleCallback({ ally, auth, response, request }: HttpContextContract) {
    const googleUser = ally.use('google')

    /**
     * User has explicitly denied the login request
     */
    if (googleUser.accessDenied()) {
      return 'Access was denied'
    }

    /**
     * Unable to verify the CSRF state
     */
    if (googleUser.stateMisMatch()) {
      return 'Request expired. try again'
    }

    /**
     * There was an unknown error during the redirect
     */
    if (googleUser.hasError()) {
      return googleUser.getError()
    }

    /**
     * Finally, access the user
     */
    const user = await googleUser.user()

    // console.log(user)

    const findUser = {
      email: user.email as string,
    }

    const userDetails = {
      email: user.email as string,
      avatar: user.avatarUrl as string,
      username: user.nickName as string,
      first_name: user.original.given_name as string,
      last_name: user.original.family_name as string,
      provider_id: user.id as string,
      provider: 'google',
    }

    const newUser = await User.firstOrCreate(findUser, userDetails)

    const oat = await auth.login(newUser, {
      expiresIn: '7 days',
    })

    /**
     * Create a cookie where the Opaque Access Token
     * will be stored with maxAge = 7 days.
     */
    response.plainCookie('auth_token', oat.token, {
      maxAge: 60 * 60 * 24 * 7,
      secure: false,
      httpOnly: true,
    })

    /**
     * Redirect the user to the URL provided in the 'redirect_url' parameter
     */
    const redirectUrl = request.input('redirect_url', 'http://localhost:3000')
    return response.redirect(redirectUrl)
  }
}
