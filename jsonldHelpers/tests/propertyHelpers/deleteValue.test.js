
import { PropertyHelpers as p } from '../../src/propertyHelpers/propertyHelpers.models.js';

describe('deleteValue', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'hobbies': ['reading', 'swimming', 'cycling'],
    'skills': ['JavaScript', 'Python', 'JavaScript'], // duplicate for testing
    'age': 30
  };

  test('should delete value from array property', () => {
    const result = p.value.delete(person, 'hobbies', 'swimming');
    expect(result.hobbies).toEqual(['reading', 'cycling']);
    expect(result.name).toBe('John Doe');
  });

  test('should not mutate original object', () => {
    const original = JSON.parse(JSON.stringify(person));
    p.value.delete(person, 'hobbies', 'swimming');
    expect(person).toEqual(original);
  });

  test('should delete all occurrences of value', () => {
    const result = p.value.delete(person, 'skills', 'JavaScript');
    expect(result.skills).toEqual(['Python']);
  });

  test('should handle deleting from single value property', () => {
    const result = p.value.delete(person, 'age', 30);
    expect(result.age).toEqual([]);
  });

  test('should return original if value not found', () => {
    const result = p.value.delete(person, 'hobbies', 'cooking');
    expect(result.hobbies).toEqual(['reading', 'swimming', 'cycling']);
  });

  test('should handle nested property paths', () => {
    const personWithAddress = {
      ...person,
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': ['US', 'Canada', 'Mexico']
      }
    };
    const result = p.value.delete(personWithAddress, 'address.addressCountry', 'Canada');
    expect(result.address.addressCountry).toEqual(['US', 'Mexico']);
  });

  test('should handle JSON-LD objects as values', () => {
    const organization = {
      '@type': 'Organization',
      '@id': 'org-123',
      'name': 'Tech Corp'
    };
    const personWithOrg = {
      ...person,
      'worksFor': [organization, { '@type': 'Organization', '@id': 'org-456', 'name': 'Other Corp' }]
    };
    const result = p.value.delete(personWithOrg, 'worksFor', organization);
    expect(result.worksFor).toEqual([{ '@type': 'Organization', '@id': 'org-456', 'name': 'Other Corp' }]);
  });

  test('should handle invalid objects', () => {
    expect(p.value.delete(null, 'prop', 'value')).toBeUndefined();
    expect(p.value.delete(undefined, 'prop', 'value')).toBeUndefined();
    expect(p.value.delete('string', 'prop', 'value')).toBeUndefined();
  });

  test('should handle non-existent properties', () => {
    const result = p.value.delete(person, 'nonexistent', 'value');
    expect(result).toEqual(person);
  });

  test('should handle empty arrays', () => {
    const emptyArrayPerson = { ...person, 'awards': [] };
    const result = p.value.delete(emptyArrayPerson, 'awards', 'Best Developer');
    expect(result.awards).toEqual([]);
  });

  test('should handle deleting all values from array', () => {
    const singleHobby = { ...person, 'hobbies': ['reading'] };
    const result = p.value.delete(singleHobby, 'hobbies', 'reading');
    expect(result.hobbies).toEqual([]);
  });

  test('should handle complex nested objects', () => {
    const company = {
      '@type': 'Organization',
      '@id': 'company-1',
      'department': {
        '@type': 'OrganizationalRole',
        'name': 'Engineering'
      }
    };
    const personWithCompany = {
      ...person,
      'employment': [company, { '@type': 'Organization', '@id': 'company-2' }]
    };
    const result = p.value.delete(personWithCompany, 'employment', company);
    expect(result.employment).toEqual([{ '@type': 'Organization', '@id': 'company-2' }]);
  });

  test('should handle mixed data types in arrays', () => {
    const mixed = { ...person, 'data': ['string', 123, true, 'string'] };
    const result = p.value.delete(mixed, 'data', 'string');
    expect(result.data).toEqual([123, true]);
  });

  test('should handle numeric values', () => {
    const numbers = { ...person, 'scores': [85, 90, 85, 92] };
    const result = p.value.delete(numbers, 'scores', 85);
    expect(result.scores).toEqual([90, 92]);
  });

  test('should handle boolean values', () => {
    const booleans = { ...person, 'flags': [true, false, true, false] };
    const result = p.value.delete(booleans, 'flags', true);
    expect(result.flags).toEqual([false, false]);
  });

  test('should handle null and undefined values', () => {
    const nulls = { ...person, 'nulls': [null, 'value', undefined, null] };
    const result = p.value.delete(nulls, 'nulls', null);
    expect(result.nulls).toEqual(['value', undefined]);
  });
});
