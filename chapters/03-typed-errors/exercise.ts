import { Data, Effect } from "effect"

export class TransportError extends Data.TaggedError("TransportError")<{
  readonly message: string
}> {}
export class NotFound extends Data.TaggedError("NotFound")<{ readonly id: string }> {}
export type ProfileError = TransportError | NotFound
export interface Profile { readonly id: string; readonly name: string }
export type FetchProfile = (id: string) => Effect.Effect<Profile, ProfileError>

// TODO: retry only TransportError at most twice, then recover NotFound to Guest.
export const getProfile = (
  id: string,
  fetchProfile: FetchProfile
): Effect.Effect<Profile, TransportError> =>
  Effect.die(`TODO: getProfile(${id}) with ${String(fetchProfile)}`)
