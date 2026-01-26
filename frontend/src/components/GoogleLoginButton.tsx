import { GoogleLogin } from '@react-oauth/google'

export default function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log('GOOGLE ID TOKEN:', credentialResponse.credential)
      }}
      onError={() => {
        console.log('Google Login Failed')
      }}
    />
  )
}
