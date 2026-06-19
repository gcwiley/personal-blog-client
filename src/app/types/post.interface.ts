// ISO 8601 date/time string type for consistent date handling across the app
export type ISODateString = string;

// define the post interface
export interface Post {
  id: string;
  title: string;
  author: string;
  body: string;
  category: string;
  isFavorite: boolean;
  publishedDate: ISODateString | null;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

// payload to create a post (client -> server)
// excludes server-generated fields like id, created, updatedAt
export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

// --- HELPER INTERFACES FOR UI LIST ---

// single generic interface
export interface SelectOption<T = string> {
  value: T;
  viewValue: string;
}
