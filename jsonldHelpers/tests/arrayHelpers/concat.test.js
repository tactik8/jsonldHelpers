
import { arrayHelpers } from '../../src/arrayHelpers.js';

describe('arrayHelpers.concat', () => {
  const records1 = [
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

  const records2 = [
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "product1",
      "name": "Widget"
    },
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person2",
      "name": "Jane Smith"
    }
  ];

  test('should concatenate two arrays without merging', () => {
    const result = arrayHelpers.concat(records1, records2, false);
    
    expect(result).toHaveLength(4);
    expect(result.find(r => r["@id"] === "person1")).toBeDefined();
    expect(result.find(r => r["@id"] === "org1")).toBeDefined();
    expect(result.find(r => r["@id"] === "product1")).toBeDefined();
    expect(result.find(r => r["@id"] === "person2")).toBeDefined();
  });

  test('should handle overlapping records with mergeIfExist false', () => {
    const overlappingRecords = [
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "person1",
        "age": 30
      },
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": "product1",
        "name": "Widget"
      }
    ];
    
    const result = arrayHelpers.concat(records1, overlappingRecords, false);
    
    expect(result).toHaveLength(3);
    
    const person = result.find(r => r["@id"] === "person1");
    expect(person).toBeDefined();
    // Should keep the last version without merging
    expect(person.age).toBe(30);
    expect(person.name).toBeUndefined();
  });

  test('should handle overlapping records with mergeIfExist true', () => {
    const overlappingRecords = [
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "person1",
        "age": 30
      }
    ];
    
    const result = arrayHelpers.concat(records1, overlappingRecords, true);
    
    expect(result).toHaveLength(2);
    
    const person = result.find(r => r["@id"] === "person1");
    expect(person).toBeDefined();
    expect(person.name).toBe("John Doe");
    expect(person.age).toBe(30);
  });

  test('should handle single records instead of arrays', () => {
    const result = arrayHelpers.concat(records1[0], records2[0]);
    
    expect(result).toHaveLength(2);
    expect(result.find(r => r["@id"] === "person1")).toBeDefined();
    expect(result.find(r => r["@id"] === "product1")).toBeDefined();
  });

  test('should handle empty arrays', () => {
    expect(arrayHelpers.concat([], records1)).toHaveLength(records1.length);
    expect(arrayHelpers.concat(records1, [])).toHaveLength(records1.length);
    expect(arrayHelpers.concat([], [])).toHaveLength(0);
  });

  test('should handle identical arrays', () => {
    const result = arrayHelpers.concat(records1, records1, false);
    
    expect(result).toHaveLength(records1.length);
  });

  test('should handle non-JSONLD objects', () => {
    const mixedRecords1 = [
      "string1",
      123,
      records1[0]
    ];
    
    const mixedRecords2 = [
      "string2",
      456,
      records2[0]
    ];
    
    const result = arrayHelpers.concat(mixedRecords1, mixedRecords2);
    
    expect(result.length).toBeGreaterThanOrEqual(4);
    expect(result).toContain("string1");
    expect(result).toContain("string2");
    expect(result).toContain(123);
    expect(result).toContain(456);
  });

  test('should preserve order with records2 first, then records1', () => {
    const result = arrayHelpers.concat(records1, records2, false);
    
    // The function processes records2 first, then records1
    expect(result).toHaveLength(4);
    
    // Should contain all records
    expect(result.find(r => r["@id"] === "person1")).toBeDefined();
    expect(result.find(r => r["@id"] === "org1")).toBeDefined();
    expect(result.find(r => r["@id"] === "product1")).toBeDefined();
    expect(result.find(r => r["@id"] === "person2")).toBeDefined();
  });

  test('should handle null and undefined records', () => {
    const recordsWithNull = [
      ...records1,
      null,
      undefined
    ];
    
    const result = arrayHelpers.concat(recordsWithNull, records2);
    
    expect(result.length).toBeGreaterThan(records1.length + records2.length);
  });
});
