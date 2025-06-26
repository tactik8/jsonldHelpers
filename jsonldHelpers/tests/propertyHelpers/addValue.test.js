
import { propertyHelpers as p } from '../../src/propertyHelpers.js';

describe('addValue', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'hobbies': ['reading'],
    'skills': ['JavaScript']
  };

  test('should add value to existing array property', () => {
    const result = p.value.add(person, 'hobbies', 'swimming');
    expect(result.hobbies).toEqual(['reading', 'swimming']);
    expect(result.name).toBe('John Doe');
  });

  test('should not mutate original object', () => {
    const original = JSON.parse(JSON.stringify(person));
    p.value.add(person, 'hobbies', 'swimming');
    expect(person).toEqual(original);
  });

  test('should create array if property does not exist', () => {
    const result = p.value.add(person, 'languages', 'English');
    expect(result.languages).toEqual(['English']);
  });

  test('should add multiple values from array', () => {
    const result = p.value.add(person, 'hobbies', ['swimming', 'cycling']);
    expect(result.hobbies).toEqual(['reading', 'swimming', 'cycling']);
  });

  test('should not add duplicates by default', () => {
    const result = p.value.add(person, 'hobbies', 'reading');
    expect(result.hobbies).toEqual(['reading']);
  });

  test('should add duplicates when noDuplicates is false', () => {
    const result = p.value.add(person, 'hobbies', 'reading', false);
    expect(result.hobbies).toEqual(['reading', 'reading']);
  });

  test('should add to single value property by converting to array', () => {
    const result = p.value.add(person, 'name', 'Jane Doe');
    expect(result.name).toEqual(['John Doe', 'Jane Doe']);
  });

  test('should handle nested property paths', () => {
    const personWithAddress = {
      ...person,
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': ['US']
      }
    };
    const result = p.value.add(personWithAddress, 'address.addressCountry', 'Canada');
    expect(result.address.addressCountry).toEqual(['US', 'Canada']);
  });

  test('should handle JSON-LD objects as values', () => {
    const organization = {
      '@type': 'Organization',
      '@id': 'org-123',
      'name': 'Tech Corp'
    };
    const result = p.value.add(person, 'worksFor', organization);
    expect(result.worksFor).toEqual([organization]);
  });

  test('should handle invalid objects', () => {
    expect(p.value.add('string', 'prop', 'value')).toBe(false);
    expect(p.value.add(123, 'prop', 'value')).toBe(false);
    expect(p.value.add(null, 'prop', 'value')).toBe(false);
  });

  test('should handle empty arrays', () => {
    const emptyArrayPerson = { ...person, 'awards': [] };
    const result = p.value.add(emptyArrayPerson, 'awards', 'Best Developer');
    expect(result.awards).toEqual(['Best Developer']);
  });

  test('should maintain existing array elements when adding', () => {
    const multiHobby = { ...person, 'hobbies': ['reading', 'swimming', 'cycling'] };
    const result = p.value.add(multiHobby, 'hobbies', 'cooking');
    expect(result.hobbies).toEqual(['reading', 'swimming', 'cycling', 'cooking']);
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
    const result = p.value.add(person, 'employment', company);
    expect(result.employment).toEqual([company]);
  });

  test('should handle mixed data types in arrays', () => {
    const mixed = { ...person, 'data': ['string', 123] };
    const result = p.value.add(mixed, 'data', true);
    expect(result.data).toEqual(['string', 123, true]);
  });

  test('should handle array of JSON-LD objects', () => {
    const orgs = [
      { '@type': 'Organization', '@id': 'org-1', 'name': 'Corp A' },
      { '@type': 'Organization', '@id': 'org-2', 'name': 'Corp B' }
    ];
    const result = p.value.add(person, 'affiliations', orgs);
    expect(result.affiliations).toEqual(orgs);
  });
});
