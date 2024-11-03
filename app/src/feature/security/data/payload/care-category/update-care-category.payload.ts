export interface UpdateCareCategoryPayload {
  category_id: string;
  name?: string;
  description?: string;
  isPublished?: boolean;
  subCategoryIds?: string[];
}
