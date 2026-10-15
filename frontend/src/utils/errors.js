export class UserFacingError extends Error {}

export function getErrorMessage(err, fallback) {
  if (err instanceof UserFacingError) return err.message;

  const status = err.response && err.response.status;
  if (status === 401) return 'Please log in to continue.';

  const serverMessage =
    err.response && err.response.data && err.response.data.message;
  if (status === 400 && serverMessage) return serverMessage;

  return fallback;
}
