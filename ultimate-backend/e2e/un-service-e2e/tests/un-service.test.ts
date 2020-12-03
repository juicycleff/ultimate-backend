import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('un-service e2e', () => {
  it('should create un-service', async (done) => {
    const plugin = uniq('un-service');
    ensureNxProject('@ultimate-backend/un-service', 'dist/packages/un-service');
    await runNxCommandAsync(
      `generate @ultimate-backend/un-service:un-service ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Builder ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('un-service');
      ensureNxProject(
        '@ultimate-backend/un-service',
        'dist/packages/un-service'
      );
      await runNxCommandAsync(
        `generate @ultimate-backend/un-service:un-service ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('un-service');
      ensureNxProject(
        '@ultimate-backend/un-service',
        'dist/packages/un-service'
      );
      await runNxCommandAsync(
        `generate @ultimate-backend/un-service:un-service ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
