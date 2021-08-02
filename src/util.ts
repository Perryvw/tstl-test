export function deepCopy(
  table: LuaTable,
  tableKey?: string | number,
): LuaTable {
  const functionName = "deepCopy";

  const tableType = type(table);
  if (tableType !== "table") {
    error(
      `The ${functionName} function was supplied with a ${tableType} instead of a table.`,
    );
  }

  const newTable = new LuaTable();

  // First, detect the special case of a TypeScript Map that is transpiled to Lua
  // In this case, we will just perform a shallow copy
  const metatable = getmetatable(table);
  if (metatable !== null) {
    if (table instanceof Map) {
      const shallowCopy = new Map(table);
      print("MAP DETECTED")
      return shallowCopy as unknown as LuaTable;
    }

    throwErrorMetatableNotSupported(functionName, tableKey);
  }

  // Copy over all of the fields
  for (const [key, value] of pairs(table)) {
    const valueType = type(value);

    if (
      valueType === "function" ||
      valueType === "thread" ||
      valueType === "userdata"
    ) {
      error(
        `The ${functionName} function does not support cloning tables that have elements of type ${valueType} in them.`,
      );
    }

    let newValue: unknown;
    if (valueType === "table") {
      newValue = deepCopy(value as LuaTable, key as string | number);
    } else {
      newValue = value;
    }

    newTable.set(key, newValue);
  }

  return newTable;
}

function throwErrorMetatableNotSupported(
  functionName: string,
  tableKey: string | number | undefined,
): never {
  const tableKeyType = type(tableKey);
  let tableKeyString: string;
  if (tableKeyType === "string") {
    tableKeyString = tableKey as string;
  } else if (tableKeyType === "number") {
    tableKeyString = tostring(tableKey);
  } else if (tableKeyType === "nil") {
    tableKeyString = "nil";
  } else {
    error(
      `The ${functionName} function does not support copying tables that have keys of type: ${tableKeyType}`,
    );
  }

  error(
    `The ${functionName} function encountered a table with a name of "${tableKeyString}" that has a metatable but is not a Map, which is not supported.`,
  );
}
