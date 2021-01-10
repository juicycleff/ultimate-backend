export class ConsulUtils {
  static getMetadata(tags: string[]): Map<string, string> {
    const metadata = new Map<string, string>();

    for (const tag of tags) {
      const parts = tag.split('=');
      metadata.set(parts[0], parts[1]);
    }

    return metadata;
  }
}
