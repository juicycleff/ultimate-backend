import {
  isValidJson,
  isValidToml,
  isValidYaml,
  StringFormatType,
  validateAndGetStringType,
} from './string-type-validator.utils';

describe('String Type Validator Utils', () => {
  it('should be true for valid [json] string', () => {
    const someString = `{"foo": "fine man"}`;
    expect(isValidJson(someString)).toBeTruthy();
  });

  it('should be false for invalid [json] string', () => {
    const someString = `{"foo": "fine man"} well`;
    expect(isValidJson(someString)).toBeFalsy();
  });

  it('should be true for valid [toml] string', () => {
    const someString = `
    # This is a TOML document.
    title = "TOML Example"

    [owner]
    name = "Tom Preston-Werner"
    `;
    expect(isValidToml(someString)).toBeTruthy();
  });

  it('should be false for invalid [toml] string', () => {
    const someString = `
    # This is a TOML document.
    title = "TOML Example"

    [owner]
    name = "Tom Preston-Werner"

    {"black": "green"}
    `;
    expect(isValidToml(someString)).toBeFalsy();
  });

  it('should be true for valid [yaml] string', () => {
    const someString = `
    title: "TOML Example"

    name:
      firstname: Tom
      lastname: Jerry
      displayName: \${{name.firstname}} \${{name.lastname}}
    `;
    expect(isValidYaml(someString)).toBeTruthy();
  });

  it('should be false for invalid [yaml] string', () => {
    const someString = `
    # This is a TOML document.
    title = "TOML Example"

    [owner]
    name = "Tom Preston-Werner"

    {"black": "green"}
    `;
    expect(isValidYaml(someString)).toBeFalsy();
  });

  it('should be validate for all valid string type', () => {
    const testcases = [
      `{"foo": "fine man"}`,
      `
      title = "TOML Example"

      [owner]
      name = "Tom Preston-Werner"
      `,
      `title: "TOML Example"`,
    ];

    expect(validateAndGetStringType(testcases[0])).toEqual(
      StringFormatType.json
    );
    expect(validateAndGetStringType(testcases[2])).toEqual(
      StringFormatType.yaml
    );
    expect(validateAndGetStringType(testcases[1])).toEqual(
      StringFormatType.toml
    );
  });

  /* it('should throw an error with invalid string type', () => {
    const testcase = `
      title = "TOML Example"
      {"foo": "fine man"}
    `;

    expect(validateAndGetStringType(testcase)).toThrow('Invalid config format (only supports json, yaml and toml)');
  }); */
});
