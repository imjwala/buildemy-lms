// Define the type for a successful result.
type Success<T> = {
  data: T;        // Contains the data if the operation was successful.
  error: null;    // Error is null in case of success.
};

// Define the type for a failed result.
type Failure<E> = {
  data: null;     // Data is null in case of failure.
  error: E;       // Contains the error if the operation failed.
};

// Discriminated union representing a result that can be either successful or failed.
// TypeScript can differentiate between `Success` and `Failure` based on the `error` property.
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Wraps a promise in a try-catch block to handle errors predictably.
 * Instead of throwing an exception, it always returns a `Result` object.
 * @param promise The promise to execute.
 * @returns A `Result` object containing `data` on success or `error` on failure.
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    // Attempt to resolve the promise.
    const data = await promise;
    // If successful, return a `Success` object.
    return { data, error: null }; 
  } catch (error) {
    // If the promise is rejected, capture the error and return a `Failure` object.
    return { data: null, error: error as E }; 
  }
}
