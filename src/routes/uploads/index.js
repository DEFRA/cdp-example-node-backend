import { addAnother } from '#/routes/uploads/add-another.js'
import { asyncCallbacks } from '#/routes/uploads/async-callbacks.js'
import { callback } from '#/routes/uploads/callback.js'
import { multipleFiles } from '#/routes/uploads/multiple-files.js'
import { multistepForm } from '#/routes/uploads/multistep-form.js'

const examples = [
  { prefix: '/uploads/multistep-form', routes: multistepForm },
  { prefix: '/uploads/multiple-files', routes: multipleFiles },
  { prefix: '/uploads/add-another', routes: addAnother },
  { prefix: '/uploads/async-callbacks', routes: asyncCallbacks },
  { prefix: '/uploads', routes: callback }
]

// Temporary: serve each route on its old path too (e.g. /animals for
// /uploads/multistep-form/animals), so the frontend and backend can be released
// independently. Remove once the frontend calls the new /uploads/... paths.
const legacyAliases = examples.flatMap(({ prefix, routes }) =>
  routes.map((route) => ({ ...route, path: route.path.slice(prefix.length) }))
)

export const uploads = [
  ...examples.flatMap(({ routes }) => routes),
  ...legacyAliases
]
