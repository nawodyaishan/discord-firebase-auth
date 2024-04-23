import { DocumentBasedSchema } from '../interfaces/document-based-schema';
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue
} from 'firebase/firestore';

export class UserSchema extends DocumentBasedSchema {
  static readonly UID: string = 'uid';
  static readonly FIRST_NAME: string = 'firstName';
  static readonly EMAIL: string = 'email';

  public get uid(): string {
    return this.doc.get(UserSchema.UID) ?? this.doc.id;
  }

  public get firstName(): string {
    return this.doc.get(UserSchema.FIRST_NAME) ?? 'Unnamed';
  }

  public get email(): string | null {
    return this.doc.get(UserSchema.EMAIL) ?? null;
  }
}

export const userConverter: FirestoreDataConverter<UserSchema> = {
  toFirestore(post: WithFieldValue<UserSchema>): DocumentData {
    return post;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, _options: SnapshotOptions): UserSchema {
    return new UserSchema(snapshot);
  }
};
