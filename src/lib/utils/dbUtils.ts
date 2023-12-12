const recordExists = <T>(records: T[]): boolean => {
  return records.length > 0 || records[0] !== undefined;
};

const recordsExists = <T>(records: T[]): boolean => {
  return records.length > 0;
};

export const dbUtils = {
  recordExists,
  recordsExists,
};
