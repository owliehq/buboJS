export abstract class BuboRepository<ModelType, ModelData = ModelType> {
  /**
   * Find an instance of the model corresponding to the value of the given field with optional given options
   * Throw an error if not found
   * @param key name of field to use for searching
   * @param value value of the field
   * @param any options that should be specified by the service itself
   */
  abstract findOneBy<Key extends keyof ModelData>(key: Key, value: ModelData[Key], ...any): Promise<ModelType>

  /**
   * Find an instance of the model corresponding to the value of the given field with optional given options
   * Does not throw an error if not found
   * @param key name of field to use for searching
   * @param value value of the field
   * @param any options that should be specified by the service itself
   */
  abstract findOneByNoThrow<Key extends keyof ModelData>(
    key: Key,
    value: ModelData[Key],
    ...any
  ): Promise<ModelType | null | undefined>

  /**
   * Find all instance of the model matching the field with the given value with optional given options
   * @param key name of field to use for searching
   * @param value value of the field
   * @param any options that should be specified by the service itself
   */
  abstract findAllBy<Key extends keyof ModelData>(key: Key, value: ModelData[Key], ...any): Promise<Array<ModelType>>

  /**
   * Delete some instance by searching a field matching the given value with optional given options
   * @param key name of field to use for searching
   * @param value value of the field
   * @param any options that should be specified by the service itself
   */
  abstract deleteBy<Key extends keyof ModelData>(key: Key, value: ModelData[Key], ...any): Promise<void>

  /**
   * Create a new instance with the given data with optional given options
   * @param data creation data of the model
   * @param any options that should be specified by the service itself
   */
  abstract create(data: { [K in keyof ModelData]: ModelData[K] }, ...any): Promise<ModelType>

  /**
   * Update an entry by its primary key with given data and according to optional given options
   * @param pk primary key of the model to update
   * @param data full or partial data contained in the model that should be updated
   * @param any options that should be specified by the service itself
   */
  abstract update(pk: string, data: { [K in keyof ModelData]?: ModelData[K] }, ...any): Promise<ModelType>

  /**
   * Delete an entry by its primary key with optional given options
   * @param pk primary key of the model to delete
   * @param any options that should be specified by the service itself
   */
  abstract delete(pk: string, ...any): Promise<void>

  /**
   * Get an instance according to the optional given options
   * @param pk primary key of the model to update
   * @param any options that should be specified by the service itself
   */
  abstract findById(pk: string, ...any): Promise<ModelType>

  /**
   * Get all models instances according to th optional given options
   * @param any options that should be specified by the service itself
   */
  abstract findAll(...any): Promise<Array<ModelType>>
}
