
import { arrayHelpers } from '../../jsonldHelpers/src/arrayHelpers.js';

describe('arrayHelpers.set (setRecord)', () => {
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

  test('should set new record in array', () => {
    const newRecord = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "@id": "product1",
      "name": "Widget"
    };
    
    const result = arrayHelpers.set(newRecord, [...baseRecords]);
    
    expect(result).toHaveLength(3);
    expect(result.find(r => r["@id"] === "product1")).toBeDefined();
  });

  test('should update existing record', () => {
    const updatedRecord = {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "Jane Doe",
      "age": 30
    };
    
    const result = arrayHelpers.set(updatedRecord, [...baseRecords]);
    
    expect(result).toHaveLength(2);
    const person = result.find(r => r["@id"] === "person1");
    expect(person.name).toBe("Jane Doe");
    expect(person.age).toBe(30);
  });

  test('should handle array of records', () => {
    const newRecords = [
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": "product1",
        "name": "Widget"
      },
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": "product2",
        "name": "Gadget"
      }
    ];
    
    const result = arrayHelpers.set(newRecords, [...baseRecords]);
    
    expect(result).toHaveLength(4);
  });

  test('should return original array for invalid record', () => {
    const originalLength = baseRecords.length;
    
    expect(arrayHelpers.set(null, [...baseRecords])).toHaveLength(originalLength);
    expect(arrayHelpers.set(undefined, [...baseRecords])).toHaveLength(originalLength);
    expect(arrayHelpers.set("string", [...baseRecords])).toHaveLength(originalLength);
    expect(arrayHelpers.set(123, [...baseRecords])).toHaveLength(originalLength);
  });

  test('should handle empty records array', () => {
    const newRecord = {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "John Doe"
    };
    
    const result = arrayHelpers.set(newRecord, []);
    
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
    
    const result = arrayHelpers.set(recordWithNested, [...baseRecords], true);
    
    expect(result.length).toBeGreaterThan(baseRecords.length);
  });
});
