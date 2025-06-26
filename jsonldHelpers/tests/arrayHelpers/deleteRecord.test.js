
import { arrayHelpers } from '../../jsonldHelpers/src/arrayHelpers.js';

describe('arrayHelpers.delete (deleteRecord)', () => {
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
    },
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "product1",
      "name": "Widget"
    }
  ];

  test('should delete record by @id reference', () => {
    const ref = { "@id": "person1" };
    const result = arrayHelpers.delete(ref, [...testRecords]);
    
    expect(result).toHaveLength(2);
    expect(result.find(r => r["@id"] === "person1")).toBeUndefined();
  });

  test('should delete record by @type and @id reference', () => {
    const ref = { "@type": "Organization", "@id": "org1" };
    const result = arrayHelpers.delete(ref, [...testRecords]);
    
    expect(result).toHaveLength(2);
    expect(result.find(r => r["@id"] === "org1")).toBeUndefined();
  });

  test('should handle array of references', () => {
    const refs = [{ "@id": "person1" }, { "@id": "org1" }];
    const result = arrayHelpers.delete(refs, [...testRecords]);
    
    expect(result).toHaveLength(1);
    expect(result[0]["@id"]).toBe("product1");
  });

  test('should return original array for non-existent record', () => {
    const ref = { "@id": "nonexistent" };
    const result = arrayHelpers.delete(ref, [...testRecords]);
    
    expect(result).toHaveLength(testRecords.length);
  });

  test('should return original array for invalid ref', () => {
    expect(arrayHelpers.delete(null, [...testRecords])).toHaveLength(testRecords.length);
    expect(arrayHelpers.delete(undefined, [...testRecords])).toHaveLength(testRecords.length);
    expect(arrayHelpers.delete("string", [...testRecords])).toHaveLength(testRecords.length);
    expect(arrayHelpers.delete(123, [...testRecords])).toHaveLength(testRecords.length);
  });

  test('should handle single record instead of array', () => {
    const ref = { "@id": "person1" };
    const result = arrayHelpers.delete(ref, testRecords[0]);
    
    expect(result).toHaveLength(0);
  });

  test('should handle empty records array', () => {
    const ref = { "@id": "person1" };
    const result = arrayHelpers.delete(ref, []);
    
    expect(result).toHaveLength(0);
  });

  test('should handle processNested parameter', () => {
    const recordWithNested = {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person2",
      "worksFor": {
        "@type": "Organization",
        "@id": "org2"
      }
    };
    
    const recordsWithNested = [...testRecords, recordWithNested];
    const result = arrayHelpers.delete(recordWithNested, recordsWithNested, true);
    
    expect(result.length).toBeLessThan(recordsWithNested.length);
  });
});
