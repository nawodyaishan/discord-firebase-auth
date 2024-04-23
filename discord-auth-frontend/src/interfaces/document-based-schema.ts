import {Dict} from "./dict";
import {deleteDoc, DocumentReference, DocumentSnapshot, Timestamp} from "firebase/firestore";

/**
 * Base of all the DocumentSnapshot based models
 */
export abstract class DocumentBasedSchema {
    public static readonly CREATED: string = 'created';
    public static readonly MODIFIED: string = 'modified';
    readonly doc: DocumentSnapshot;

    get id(): string {
        return this.doc.id;
    }

    public get created(): Timestamp | null {
        return this.doc.get(DocumentBasedSchema.CREATED) ?? null;
    }

    public get modified(): Timestamp | null {
        return this.doc.get(DocumentBasedSchema.MODIFIED) ?? null;
    }

    get ref(): DocumentReference {
        return this.doc.ref;
    }

    get exists(): boolean {
        return this.doc.exists();
    }

    get rawData(): Dict | null {
        return this.doc.data() ?? null;
    }

    public async delete(): Promise<void> {
        if (!this.exists) return;
        await deleteDoc(this.doc.ref);
    }

    public constructor(doc: DocumentSnapshot) {
        this.doc = doc;
    }
}
