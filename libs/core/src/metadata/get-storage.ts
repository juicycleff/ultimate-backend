import { MetadataStorage } from './storage';

export function getMetadataStorage(): MetadataStorage {
  return (
    // @ts-ignore
    global.MetadataStorage || (global.MetadataStorage = new MetadataStorage())
  );
}
