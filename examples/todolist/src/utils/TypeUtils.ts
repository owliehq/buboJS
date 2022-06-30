/* Type ORM Trick to get rid of circular dependency resolution of ESM */
/* https://typeorm.io/#relations-in-esm-projects */
export type CircularHelper<T> = T
