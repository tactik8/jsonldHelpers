
// Test Data Helper - Sample JSON-LD Records
export const testData = {
    // Valid JSON-LD records
    validRecords: {
        person: {
            "@context": "https://schema.org/",
            "@type": "Person",
            "@id": "person-1",
            "name": "John Doe",
            "age": 30,
            "email": "john@example.com"
        },
        
        organization: {
            "@context": "https://schema.org/",
            "@type": "Organization",
            "@id": "org-1",
            "name": "ACME Corp",
            "url": "https://acme.com",
            "employees": [
                {
                    "@type": "Person",
                    "@id": "person-1",
                    "name": "John Doe"
                },
                {
                    "@type": "Person",
                    "@id": "person-2",
                    "name": "Jane Smith"
                }
            ]
        },
        
        nestedRecord: {
            "@context": "https://schema.org/",
            "@type": "Article",
            "@id": "article-1",
            "name": "Test Article",
            "author": {
                "@type": "Person",
                "@id": "author-1",
                "name": "Author Name",
                "worksFor": {
                    "@type": "Organization",
                    "@id": "publisher-1",
                    "name": "Publisher Inc"
                }
            },
            "publisher": {
                "@type": "Organization",
                "@id": "publisher-1",
                "name": "Publisher Inc"
            }
        }
    },
    
    // Invalid records
    invalidRecords: {
        noType: {
            "@context": "https://schema.org/",
            "@id": "invalid-1",
            "name": "No Type"
        },
        
        noId: {
            "@context": "https://schema.org/",
            "@type": "Thing",
            "name": "No ID"
        },
        
        emptyObject: {},
        
        nullValue: null,
        
        undefinedValue: undefined,
        
        stringValue: "just a string",
        
        numberValue: 42,
        
        arrayValue: [1, 2, 3]
    },
    
    // Arrays of records
    recordArrays: {
        mixed: [
            {
                "@context": "https://schema.org/",
                "@type": "Person",
                "@id": "person-1",
                "name": "John Doe"
            },
            {
                "@context": "https://schema.org/",
                "@type": "Organization",
                "@id": "org-1",
                "name": "ACME Corp"
            }
        ],
        
        duplicates: [
            {
                "@context": "https://schema.org/",
                "@type": "Person",
                "@id": "person-1",
                "name": "John Doe",
                "age": 30
            },
            {
                "@context": "https://schema.org/",
                "@type": "Person",
                "@id": "person-1",
                "name": "John Doe",
                "email": "john@example.com"
            }
        ]
    },
    
    // List objects
    listObjects: {
        simple: {
            "@context": "https://schema.org/",
            "@type": "ItemList",
            "@id": "list-1",
            "name": "Test List",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "@id": "item-1",
                    "position": 0,
                    "item": {
                        "@type": "Thing",
                        "@id": "thing-1",
                        "name": "First Item"
                    }
                },
                {
                    "@type": "ListItem",
                    "@id": "item-2",
                    "position": 1,
                    "item": {
                        "@type": "Thing",
                        "@id": "thing-2",
                        "name": "Second Item"
                    }
                }
            ]
        }
    }
};

// Helper function to create deep copies
export function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepCopy(item));
    if (typeof obj === 'object') {
        const copy = {};
        Object.keys(obj).forEach(key => {
            copy[key] = deepCopy(obj[key]);
        });
        return copy;
    }
}
