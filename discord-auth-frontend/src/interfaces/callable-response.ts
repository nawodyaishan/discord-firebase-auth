/**
 * Represents a response output from a called cloud function
 */
import {Dict} from './dict'
import {TypedCallableResponse} from './typed-callable-response'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CallableResponse extends TypedCallableResponse<Dict> {
}
