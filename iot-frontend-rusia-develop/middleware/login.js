export default function ({ redirect, $auth, $vuetify }) {
  console.log($vuetify)
  const auth = $auth.$state
  if (auth.loggedIn) {
    redirect('/')
  }
}
