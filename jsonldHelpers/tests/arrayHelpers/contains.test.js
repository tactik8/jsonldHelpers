
import { arrayHelpers } from '../../jsonldHelpers/src/arrayHelpers.js';

describe('arrayHelpers.contains', () => {
  const testRecords = [
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "John Doe"
    },
    {
      "@context": "https://schema.org/",
      "@type": "Organization",
      "@id": "org1",
      "name": "Acme Corp"
    }
  ];

  test('should return true when array contains value', () => {
    const value = { "@id": "person1" };
    const result = arrayHelpers.contains(testRecords, value);
    
    expect(result).toBe(true);
  });

  test('should return false when array does not contain value', () => {
    const value = { "@id": "nonexistent" };
    const result = arrayHelpers.contains(testRecords, value);
    
    expect(result).toBe(false);
  });

  test('should handle exact object match', () => {
    const value = testRecords[0];
    const result = arrayHelpers.contains(testRecords, value);
    
    expect(result).toBe(true);
  });

  test('should handle partial object match', () => {
    const value = { "@type": "Person", "@id": "person1" };
    const result = arrayHelpers.contains(testRecords, value);
    
    expect(result).toBe(true);
  });

  test('should handle empty array', () => {
    const value = { "@id": "person1" };
    const result = arrayHelpers.contains([], value);
    
    expect(result).toBe(false);
  });

  test('should handle null/undefined values', () => {
    expect(arrayHelpers.contains(testRecords, null)).toBe(false);
    expect(arrayHelpers.contains(testRecords, undefined)).toBe(false);
  });

  test('should handle primitive values', () => {
    const primitiveArray = ["apple", "banana", "cherry"];
    
    expect(arrayHelpers.contains(primitiveArray, "apple")).toBe(true);
    expect(arrayHelpers.contains(primitiveArray, "grape")).toBe(false);
  });

  test('should handle mixed types', () => {
    const mixedArray = [1, "hello", { "@id": "test" }, null];
    
    expect(arrayHelpers.contains(mixedArray, 1)).toBe(true);
    expect(arrayHelpers.contains(mixedArray, "hello")).toBe(true);
    expect(arrayHelpers.contains(mixedArray, { "@id": "test" })).toBe(true);
    expect(arrayHelpers.contains(mixedArray, null)).toBe(true);
    expect(arrayHelpers.contains(mixedArray, "missing")).toBe(false);
  });
});
