/**
 * Represents a response output from a called cloud function
 */
export interface TypedCallableResponse<T> {
    success: boolean;
    data?: T;
    message: string;

    [Key: string]: any;
}
