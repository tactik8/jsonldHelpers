
import { arrayHelpers } from '../../src/arrayHelpers.js';

describe('arrayHelpers.deduplicate', () => {
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
      "age": 30
    },
    {
      "@context": "https://schema.org/",
      "@type": "Organization",
      "@id": "org1",
      "name": "Acme Corp"
    },
    {
      "@context": "https://schema.org/",
      "@type": "Organization",
      "@id": "org1",
      "foundingDate": "2000"
    }
  ];

  test('should deduplicate records by merging duplicates', () => {
    const result = arrayHelpers.deduplicate(testRecords);
    
    expect(result).toHaveLength(2);
    
    const person = result.find(r => r["@id"] === "person1");
    expect(person).toBeDefined();
    expect(person.name).toBe("John Doe");
    expect(person.age).toBe(30);
    
    const org = result.find(r => r["@id"] === "org1");
    expect(org).toBeDefined();
    expect(org.name).toBe("Acme Corp");
    expect(org.foundingDate).toBe("2000");
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
    
    const result = arrayHelpers.deduplicate(uniqueRecords);
    
    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining(uniqueRecords));
  });

  test('should handle single record', () => {
    const result = arrayHelpers.deduplicate(testRecords[0]);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(testRecords[0]);
  });

  test('should handle empty array', () => {
    const result = arrayHelpers.deduplicate([]);
    
    expect(result).toHaveLength(0);
  });

  test('should handle non-JSONLD objects', () => {
    const mixedRecords = [
      "string1",
      "string1",
      "string2",
      123,
      123,
      null,
      null,
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "person1",
        "name": "John Doe"
      }
    ];
    
    const result = arrayHelpers.deduplicate(mixedRecords);
    
    expect(result.length).toBeLessThan(mixedRecords.length);
    expect(result).toContain("string1");
    expect(result).toContain("string2");
    expect(result).toContain(123);
    expect(result).toContain(null);
    expect(result.find(r => r && r["@id"] === "person1")).toBeDefined();
  });

  test('should handle invalid records', () => {
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
        "@type": "Person",
        "@id": "person1",
        "age": 30
      }
    ];
    
    const result = arrayHelpers.deduplicate(recordsWithInvalid);
    
    expect(result.length).toBeLessThan(recordsWithInvalid.length);
    
    const person = result.find(r => r && r["@id"] === "person1");
    expect(person).toBeDefined();
    expect(person.name).toBe("John Doe");
    expect(person.age).toBe(30);
  });

  test('should handle records with different @type but same @id separately', () => {
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
    
    const result = arrayHelpers.deduplicate(recordsWithSameId);
    
    expect(result).toHaveLength(2);
  });
});
