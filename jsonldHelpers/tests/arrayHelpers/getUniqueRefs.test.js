
import { arrayHelpers } from '../../jsonldHelpers/src/arrayHelpers.js';

describe('arrayHelpers.getUniqueRefs', () => {
  const testRecords = [
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "John Doe"
    },
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "John Doe Updated"
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

  test('should return unique references from records', () => {
    const result = arrayHelpers.getUniqueRefs(testRecords);
    
    expect(result).toHaveLength(3);
    expect(result.find(r => r["@id"] === "person1")).toBeDefined();
    expect(result.find(r => r["@id"] === "org1")).toBeDefined();
    expect(result.find(r => r["@id"] === "product1")).toBeDefined();
  });

  test('should handle records without duplicates', () => {
    const uniqueRecords = [
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
    
    const result = arrayHelpers.getUniqueRefs(uniqueRecords);
    
    expect(result).toHaveLength(2);
  });

  test('should handle single record', () => {
    const result = arrayHelpers.getUniqueRefs(testRecords[0]);
    
    expect(result).toHaveLength(1);
    expect(result[0]["@id"]).toBe("person1");
  });

  test('should handle empty array', () => {
    const result = arrayHelpers.getUniqueRefs([]);
    
    expect(result).toHaveLength(0);
  });

  test('should filter out invalid records', () => {
    const recordsWithInvalid = [
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "person1",
        "name": "John Doe"
      },
      null,
      undefined,
      "string",
      123,
      {
        "@context": "https://schema.org/",
        "@type": "Organization",
        "@id": "org1",
        "name": "Acme Corp"
      }
    ];
    
    const result = arrayHelpers.getUniqueRefs(recordsWithInvalid);
    
    expect(result).toHaveLength(2);
    expect(result.every(r => r && typeof r === 'object' && r["@id"])).toBe(true);
  });

  test('should handle records with same @id but different @type', () => {
    const recordsWithSameId = [
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "entity1",
        "name": "John Doe"
      },
      {
        "@context": "https://schema.org/",
        "@type": "Organization",
        "@id": "entity1",
        "name": "John Doe Corp"
      }
    ];
    
    const result = arrayHelpers.getUniqueRefs(recordsWithSameId);
    
    // Should be 2 unique refs since they have different @type
    expect(result).toHaveLength(2);
  });

  test('should handle records without @id', () => {
    const recordsWithoutId = [
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "name": "John Doe"
      },
      {
        "@context": "https://schema.org/",
        "@type": "Organization",
        "@id": "org1",
        "name": "Acme Corp"
      }
    ];
    
    const result = arrayHelpers.getUniqueRefs(recordsWithoutId);
    
    expect(result.length).toBeLessThanOrEqual(recordsWithoutId.length);
  });
});
