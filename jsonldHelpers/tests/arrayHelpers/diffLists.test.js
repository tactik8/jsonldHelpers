
import { arrayHelpers } from '../../src/arrayHelpers.js';

describe('arrayHelpers.diff (diffLists)', () => {
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
    },
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "product1",
      "name": "Widget"
    }
  ];

  const records2 = [
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "John Doe"
    },
    {
      "@context": "https://schema.org/",
      "@type": "Organization",
      "@id": "org2",
      "name": "Other Corp"
    }
  ];

  test('should return records in first list not present in second', () => {
    const result = arrayHelpers.diff(records1, records2);
    
    expect(result).toHaveLength(2);
    expect(result.find(r => r["@id"] === "org1")).toBeDefined();
    expect(result.find(r => r["@id"] === "product1")).toBeDefined();
    expect(result.find(r => r["@id"] === "person1")).toBeUndefined();
  });

  test('should return empty array when all records are present', () => {
    const result = arrayHelpers.diff(records2, records1);
    
    expect(result).toHaveLength(1);
    expect(result[0]["@id"]).toBe("org2");
  });

  test('should handle identical arrays', () => {
    const result = arrayHelpers.diff(records1, records1);
    
    expect(result).toHaveLength(0);
  });

  test('should handle empty arrays', () => {
    expect(arrayHelpers.diff([], records1)).toHaveLength(0);
    expect(arrayHelpers.diff(records1, [])).toHaveLength(records1.length);
    expect(arrayHelpers.diff([], [])).toHaveLength(0);
  });

  test('should handle single records instead of arrays', () => {
    const result = arrayHelpers.diff(records1[0], records2[0]);
    
    expect(result).toHaveLength(0);
  });

  test('should handle single record vs array', () => {
    const result = arrayHelpers.diff(records1[0], records2);
    
    expect(result).toHaveLength(0);
  });

  test('should filter out null and undefined values', () => {
    const recordsWithNull = [
      ...records1,
      null,
      undefined
    ];
    
    const result = arrayHelpers.diff(recordsWithNull, records2);
    
    expect(result.every(r => r !== null && r !== undefined)).toBe(true);
  });

  test('should handle non-JSONLD objects', () => {
    const mixedRecords1 = [
      "string1",
      "string2",
      123,
      ...records1
    ];
    
    const mixedRecords2 = [
      "string1",
      456,
      records1[0]
    ];
    
    const result = arrayHelpers.diff(mixedRecords1, mixedRecords2);
    
    expect(result).toContain("string2");
    expect(result).toContain(123);
    expect(result.find(r => r && r["@id"] === "org1")).toBeDefined();
    expect(result.find(r => r && r["@id"] === "product1")).toBeDefined();
  });

  test('should handle records with partial matches', () => {
    const partialRecords = [
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "person1"
      }
    ];
    
    const result = arrayHelpers.diff(records1, partialRecords);
    
    expect(result).toHaveLength(2);
    expect(result.find(r => r["@id"] === "org1")).toBeDefined();
    expect(result.find(r => r["@id"] === "product1")).toBeDefined();
  });
});
