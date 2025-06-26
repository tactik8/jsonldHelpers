
import { arrayHelpers } from '../../src/arrayHelpers.js';

describe('arrayHelpers.get (getRecord)', () => {
  const testRecords = [
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "John Doe",
      "worksFor": {
        "@type": "Organization",
        "@id": "org1"
      }
    },
    {
      "@context": "https://schema.org/",
      "@type": "Organization",
      "@id": "org1",
      "name": "Acme Corp",
      "employee": {
        "@type": "Person",
        "@id": "person1"
      }
    },
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "product1",
      "name": "Widget",
      "manufacturer": {
        "@type": "Organization",
        "@id": "org1"
      }
    }
  ];

  test('should get record by @id reference', () => {
    const ref = { "@id": "person1" };
    const result = arrayHelpers.get(ref, testRecords);
    
    expect(result).toBeDefined();
    expect(result["@id"]).toBe("person1");
    expect(result.name).toBe("John Doe");
  });

  test('should get record by @type and @id reference', () => {
    const ref = { "@type": "Organization", "@id": "org1" };
    const result = arrayHelpers.get(ref, testRecords);
    
    expect(result).toBeDefined();
    expect(result["@id"]).toBe("org1");
    expect(result.name).toBe("Acme Corp");
  });

  test('should return undefined for non-existent record', () => {
    const ref = { "@id": "nonexistent" };
    const result = arrayHelpers.get(ref, testRecords);
    
    expect(result).toBeUndefined();
  });

  test('should handle single record instead of array', () => {
    const ref = { "@id": "person1" };
    const result = arrayHelpers.get(ref, testRecords[0]);
    
    expect(result).toBeDefined();
    expect(result["@id"]).toBe("person1");
  });

  test('should return undefined for invalid ref', () => {
    expect(arrayHelpers.get(null, testRecords)).toBeUndefined();
    expect(arrayHelpers.get(undefined, testRecords)).toBeUndefined();
    expect(arrayHelpers.get("string", testRecords)).toBeUndefined();
    expect(arrayHelpers.get(123, testRecords)).toBeUndefined();
  });

  test('should handle empty records array', () => {
    const ref = { "@id": "person1" };
    const result = arrayHelpers.get(ref, []);
    
    expect(result).toBeUndefined();
  });

  test('should handle processNested parameter', () => {
    const ref = { "@id": "person1" };
    const resultWithNested = arrayHelpers.get(ref, testRecords, true);
    const resultWithoutNested = arrayHelpers.get(ref, testRecords, false);
    
    expect(resultWithNested).toBeDefined();
    expect(resultWithoutNested).toBeDefined();
  });
});
