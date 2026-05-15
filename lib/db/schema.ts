import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Basic file/folder information
  name: text('name').notNull(),
  path: text('path').notNull(), // document/project/resume
  size: integer('size').notNull(),
  type: text('type').notNull(), // folder

  // Storage information
  fileUrl: text('file_url').notNull(), // url to access file_url
  thumnailUrl: text('thumbnail_url'),

  // Ownership
  userId: text('user_id').notNull(),
  parentId: uuid('parent_id'), // Parent folder if (null for root items)

  // file/folder flags
  isFolder: boolean('is_folder').default(false).notNull(),
  isStarred: boolean('is_boolean').default(false).notNull(),
  isTrash: boolean('is_trash').default(false).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fileRelations = relations(files, ({one, many}) => {
  return {
    parent: one(files, {
      fields: [files.parentId],
      references: [files.id],
    }),

    // Relationship to child/folder
    children: many(files),
  };
});

// type definations
export type File = typeof files.$inferSelect;
export type Newfile = typeof files.$inferInsert;
