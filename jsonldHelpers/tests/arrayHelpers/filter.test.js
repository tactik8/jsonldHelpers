
import { arrayHelpers } from '../../jsonldHelpers/src/arrayHelpers.js';

describe('arrayHelpers.filter', () => {
  const testRecords = [
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "John Doe",
      "age": 30
    },
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person2",
      "name": "Jane Smith",
      "age": 25
    },
    {
      "@context": "https://schema.org/",
      "@type": "Organization",
      "@id": "org1",
      "name": "Acme Corp",
      "foundingDate": "2000"
    },
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "product1",
      "name": "Widget",
      "price": 19.99
    }
  ];

  test('should filter by @type', () => {
    const filterParams = { "@type": "Person" };
    const result = arrayHelpers.filter(testRecords, filterParams);
    
    expect(result).toHaveLength(2);
    expect(result.every(r => r["@type"] === "Person")).toBe(true);
  });

  test('should filter by name', () => {
    const filterParams = { "name": "John Doe" };
    const result = arrayHelpers.filter(testRecords, filterParams);
    
    expect(result).toHaveLength(1);
    expect(result[0]["@id"]).toBe("person1");
  });

  test('should filter by multiple criteria', () => {
    const filterParams = { "@type": "Person", "age": 30 };
    const result = arrayHelpers.filter(testRecords, filterParams);
    
    expect(result).toHaveLength(1);
    expect(result[0]["@id"]).toBe("person1");
  });

  test('should return empty array when no matches', () => {
    const filterParams = { "@type": "NonExistentType" };
    const result = arrayHelpers.filter(testRecords, filterParams);
    
    expect(result).toHaveLength(0);
  });

  test('should handle negative filter parameters', () => {
    const filterParams = { "@type": "Person" };
    const negativeFilterParams = { "age": 30 };
    const result = arrayHelpers.filter(testRecords, filterParams, negativeFilterParams);
    
    expect(result).toHaveLength(1);
    expect(result[0]["@id"]).toBe("person2");
  });

  test('should handle single record instead of array', () => {
    const filterParams = { "@type": "Person" };
    const result = arrayHelpers.filter(testRecords[0], filterParams);
    
    expect(result).toHaveLength(1);
    expect(result[0]["@id"]).toBe("person1");
  });

  test('should handle empty records array', () => {
    const filterParams = { "@type": "Person" };
    const result = arrayHelpers.filter([], filterParams);
    
    expect(result).toHaveLength(0);
  });

  test('should handle strict mode', () => {
    const filterParams = { "name": "John" };
    const resultNonStrict = arrayHelpers.filter(testRecords, filterParams, undefined, false);
    const resultStrict = arrayHelpers.filter(testRecords, filterParams, undefined, true);
    
    expect(resultNonStrict.length).toBeGreaterThanOrEqual(resultStrict.length);
  });

  test('should handle undefined filter parameters', () => {
    const result = arrayHelpers.filter(testRecords, undefined);
    
    expect(result).toHaveLength(testRecords.length);
  });
});
