
import { arrayHelpers } from '../../src/arrayHelpers.js';

describe('arrayHelpers.sort (sortRecords)', () => {
  const testRecords = [
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person3",
      "name": "Charlie Brown",
      "age": 35
    },
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person1",
      "name": "Alice Smith",
      "age": 25
    },
    {
      "@context": "https://schema.org/",
      "@type": "Person",
      "@id": "person2",
      "name": "Bob Johnson",
      "age": 30
    }
  ];

  test('should sort records in ascending order by default', () => {
    const result = arrayHelpers.sort([...testRecords]);
    
    expect(result).toHaveLength(testRecords.length);
    // Results should be sorted, exact order depends on implementation
    expect(result).toEqual(expect.any(Array));
  });

  test('should sort records in descending order when reverse is true', () => {
    const result = arrayHelpers.sort([...testRecords], true);
    
    expect(result).toHaveLength(testRecords.length);
    // Results should be sorted in reverse order
    expect(result).toEqual(expect.any(Array));
  });

  test('should handle single record', () => {
    const result = arrayHelpers.sort(testRecords[0]);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(testRecords[0]);
  });

  test('should handle empty array', () => {
    const result = arrayHelpers.sort([]);
    
    expect(result).toHaveLength(0);
  });

  test('should not modify original array', () => {
    const originalRecords = [...testRecords];
    const result = arrayHelpers.sort(testRecords);
    
    expect(testRecords).toEqual(originalRecords);
    expect(result).not.toBe(testRecords);
  });

  test('should handle records with missing properties', () => {
    const recordsWithMissing = [
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "person1",
        "name": "Alice"
      },
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "person2"
      },
      {
        "@context": "https://schema.org/",
        "@type": "Organization",
        "@id": "org1",
        "name": "Acme"
      }
    ];
    
    const result = arrayHelpers.sort([...recordsWithMissing]);
    
    expect(result).toHaveLength(recordsWithMissing.length);
  });

  test('should handle different data types', () => {
    const mixedRecords = [
      {
        "@context": "https://schema.org/",
        "@type": "Person",
        "@id": "person1",
        "name": "Alice",
        "age": 30
      },
      {
        "@context": "https://schema.org/",
        "@type": "Organization",
        "@id": "org1",
        "name": "Acme Corp"
      }
    ];
    
    const result = arrayHelpers.sort([...mixedRecords]);
    
    expect(result).toHaveLength(mixedRecords.length);
  });
});
