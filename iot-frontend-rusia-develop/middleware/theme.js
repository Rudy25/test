export default function ({ $vuetify, $colorMode }) {
  if ($colorMode.value === 'sepia' || $colorMode.value === 'light') {
    $vuetify.theme.dark = false
  } else {
    $vuetify.theme.dark = true
  }
}
