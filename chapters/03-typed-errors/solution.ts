import { Effect } from "effect"
import type { FetchProfile, Profile, ProfileError, TransportError } from "./exercise.js"

export const getProfile = (
  id: string,
  fetchProfile: FetchProfile
): Effect.Effect<Profile, TransportError> =>
  fetchProfile(id).pipe(
    Effect.retry({
      times: 2,
      while: (error: ProfileError) => error._tag === "TransportError"
    }),
    Effect.catchTag("NotFound", ({ id }) => Effect.succeed({ id, name: "Guest" }))
  )
