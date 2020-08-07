/* tslint:disable:variable-name */

/**
 * List of types that FindOperator can be.
 */
export type FindOperatorType =
  | 'not'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'moreThan'
  | 'moreThanOrEqual'
  | 'equal'
  | 'between'
  | 'in'
  | 'any'
  | 'isNull'
  | 'like'
  | 'raw';

/**
 * Find Operator used in Find Conditions.
 */
export class FindOperator<T> {
  // -------------------------------------------------------------------------
  // Private Properties
  // -------------------------------------------------------------------------

  /**
   * Operator type.
   */
  private _type: FindOperatorType;

  /**
   * Parameter value.
   */
  private _value: T | FindOperator<T>;

  /**
   * Indicates if parameter is used or not for this operator.
   */
  private _useParameter: boolean;

  /**
   * Indicates if multiple parameters must be used for this operator.
   */
  private _multipleParameters: boolean;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(
    type: FindOperatorType,
    value: T | FindOperator<T>,
    useParameter: boolean = true,
    multipleParameters: boolean = false,
  ) {
    this._type = type;
    this._value = value;
    this._useParameter = useParameter;
    this._multipleParameters = multipleParameters;
  }

  // -------------------------------------------------------------------------
  // Accessors
  // -------------------------------------------------------------------------

  /**
   * Indicates if parameter is used or not for this operator.
   * Extracts final value if value is another find operator.
   */
  get useParameter(): boolean {
    if (this._value instanceof FindOperator) {
      return this._value.useParameter;
    }

    return this._useParameter;
  }

  /**
   * Indicates if multiple parameters must be used for this operator.
   * Extracts final value if value is another find operator.
   */
  get multipleParameters(): boolean {
    if (this._value instanceof FindOperator) {
      return this._value.multipleParameters;
    }

    return this._multipleParameters;
  }

  /**
   * Gets the final value needs to be used as parameter value.
   */
  get value(): T {
    if (this._value instanceof FindOperator) {
      return this._value.value;
    }

    return this._value;
  }
}
