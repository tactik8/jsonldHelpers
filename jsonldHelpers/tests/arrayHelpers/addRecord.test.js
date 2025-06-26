
import { arrayHelpers } from '../../src/arrayHelpers.js';

describe('arrayHelpers.add (addRecord)', () => {
  const baseRecords = [
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

  test('should add new record to array', () => {
    const newRecord = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "product1",
      "name": "Widget"
    };
    
    const result = arrayHelpers.add(newRecord, [...baseRecords]);
    
    expect(result).toHaveLength(3);
    expect(result.find(r => r["@id"] === "product1")).toBeDefined();
  });

  test('should merge with existing record when mergeIfExist is true', () => {
    const existingRecord = {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "age": 30
    };
    
    const result = arrayHelpers.add(existingRecord, [...baseRecords], true);
    
    expect(result).toHaveLength(2);
    const person = result.find(r => r["@id"] === "person1");
    expect(person.name).toBe("John Doe");
    expect(person.age).toBe(30);
  });

  test('should replace existing record when mergeIfExist is false', () => {
    const existingRecord = {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "age": 30
    };
    
    const result = arrayHelpers.add(existingRecord, [...baseRecords], false);
    
    expect(result).toHaveLength(2);
    const person = result.find(r => r["@id"] === "person1");
    expect(person.name).toBeUndefined();
    expect(person.age).toBe(30);
  });

  test('should return original array for invalid record', () => {
    const originalLength = baseRecords.length;
    
    expect(arrayHelpers.add(null, [...baseRecords])).toHaveLength(originalLength);
    expect(arrayHelpers.add(undefined, [...baseRecords])).toHaveLength(originalLength);
    expect(arrayHelpers.add("string", [...baseRecords])).toHaveLength(originalLength);
    expect(arrayHelpers.add(123, [...baseRecords])).toHaveLength(originalLength);
  });

  test('should handle single record instead of array', () => {
    const newRecord = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "product1",
      "name": "Widget"
    };
    
    const result = arrayHelpers.add(newRecord, baseRecords[0]);
    
    expect(result).toHaveLength(2);
  });

  test('should handle empty records array', () => {
    const newRecord = {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "John Doe"
    };
    
    const result = arrayHelpers.add(newRecord, []);
    
    expect(result).toHaveLength(1);
    expect(result[0]["@id"]).toBe("person1");
  });

  test('should handle processNested parameter', () => {
    const recordWithNested = {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person2",
      "name": "Bob Smith",
      "worksFor": {
        "@type": "Organization",
        "@id": "org2",
        "name": "New Corp"
      }
    };
    
    const result = arrayHelpers.add(recordWithNested, [...baseRecords], true, true);
    
    expect(result.length).toBeGreaterThan(baseRecords.length);
  });
});
