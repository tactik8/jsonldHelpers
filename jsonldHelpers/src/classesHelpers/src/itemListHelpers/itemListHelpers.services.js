import { objectHelpers as h } from "./objectHelpers.js";
import { arrayHelpers as ah } from "./arrayHelpers.js";
import { propertyHelpers as ph } from "./propertyHelpers.js";
import { valueHelpers as vh } from "./valueHelpers.js";

import { utilHelpers as utils } from '../utilHelpers/utilHelpers.models.js'


export const services = {
    toListItem: toListItem,
    toList: toList,
    length: length,
    itemListElement: {
        get: getListItem,
        filter: filterListItems,
        delete: deleteListItem,
        insert: insertListItem,
        prepend: prepend,
        append: append,
    },
    getListItem: getListItem,
    filterListItems: filterListItems,
    cleanListObject: cleanListObject,
    resetPosition: resetPosition,
    deleteListItem: deleteListItem,
    insertListItem: insertListItem,
    append: append,
    prepend: prepend,
};

// -----------------------------------------------------
//  List objects operations:

// -----------------------------------------------------

function toItemList(record) {
    /**
     * Converts a list of records to a list of objects
     * @param {Array} records - The list of records
     * @returns {Object} - The list object
     */

    record.itemListElement = record?.itemListElement || [];
    record.itemListElement = Array.isArray(record.itemListElement)
        ? record.itemListElement
        : [record.itemListElement];

    let l = record.itemListElement.length;

    for (let i = 0; i < length; i++) {
        if (
            (record.itemListElement[i]?.["@type"]?.[0] || record.itemListElement[i]?.['@type']) !==
            "ListItem"
        ) {
            let listItem = {
                "@type": "ListItem",
                "@id": utils.uuid.get(),
                item: itemListelements[i],
                position: i,
                previousElement: i === 0 ? undefined : itemListelements[i - 1],
                nextElement: i === l - 1 ? undefined : itemListelements[i + 1],
            };
            record.itemListElement[i] = listItem;
        }
    }

    return record;
    
}


function toListItem(record){
    /**
     * Converts a record to a list item
     * @param {Object} record - The record to convert
     * @returns {Object} - The list item
     * @example toListItem({name: "John Doe", age: 30}) // {@type: "ListItem", item: {name: "John Doe", age: 30}}
     * 
     */

    if((record?.['@type']?.[0] || record?.["@type"]) == "ListItem"){
        return record
    }

    let listItem = {
        "@type": "ListItem",
        "@id": utils.uuid.get(),
        item: record
    };
    
    return listItem

}




function length(listObject) {
    /**
     * Gets the length of a list object
     * @param {Object} listObject - The list object
     * @returns {Number} - The length of the list object
     * @example length({@type: "List", itemListElement: [{@type: "Thing", name: "John Doe"}]}) // 1
     */
    return ph.value.get(listObject, "itemListElement", []).length;
}

function getListItem(listObject, index, defaultValue) {
    /**
     * Gets a list item from a list object
     * @param {Object} listObject - The list object
     * @param {Number} index - The index of the list item
     * @returns {Object} - The list item
     * @example getListItem({@type: "List", itemListElement: [{@type: "Thing", name: "John Doe"}]}, 0) // {@type: "Thing", name: "John Doe"}
     */

    let values = valueHelpers.value.get(listObject, "itemListElement", []);

    for (let v of values) {
        if (getValue(v, "position") === index) {
            return v;
        }
    }

    if (defaultValue !== undefined) {
        return defaultValue;
    }
    return undefined;
}

function filterListItems(
    listObject,
    filterParams,
    negativeFilterParams,
    strict = false,
) {
    /**
     * Filters a list object
     * @param {Object} listObject - The list object
     * @param {Object} filterParams - The filter parameters
     * @returns {Object} - The filtered list object
     * @example filterListItems({@type: "List", itemListElement: [{@type: "Thing", name: "John Doe"}]}, {name: "John Doe"}) // {@type: "List", itemListElement:
     * [{@type: "Thing", name: "John Doe"}]}
     *
     */
    let values = valueHelpers.value.get(listObject, "itemListElement", []);
    let filteredValues = filter(
        values,
        filterParams,
        negativeFilterParams,
        strict,
    );

    return filteredValues;
}

function cleanListObject(listObject) {
    /**
     * Cleans a list object
     *
     */

    // Get values
    let values = ph.value.get(listObject, "itemListElement", []);

    // Set number of items
    ph.value.set(listObject, "numberOfItems", values.length);

    // Deal with empty list
    if (values.length === 0) {
        return listObject;
    }

    // Retrieve first value
    let firstValue = values.filter(
        (x) =>
            getValue(x, "previousElement") === undefined ||
            getValue(x, "position") === 0,
    )?.[0];
    // If no first value, reset all values
    if (firstValue === undefined) {
        firstValue = values[0];
        let count = 0;
        for (let v of values) {
            ph.value.set(v, "position", count);
            count += 1;
        }
    }

    // Iterate
    let previousValue = undefined;
    let currentValue = firstValue;
    let nextValue = undefined;
    let count = 0;

    while (currentValue !== undefined) {
        let nextValueRef = getValue(currentValue, "nextElement");
        nextValue = values.filter(
            (x) =>
                sameAs(nextValueRef, x) ||
                getValue(x, "position") === count + 1,
        )?.[0];

        ph.value.set(currentValue, "position", count);
        ph.value.set(currentValue, "previousElement", getRef(previousValue));
        ph.value.set(currentValue, "nextElement", getRef(nextValue));

        previousValue = currentValue;
        currentValue = nextValue;
        count += 1;
    }

    return listObject;
}

function resetPosition(listObject, startingPoint, delta) {
    /**
     * Resets the position of the list items in a list object
     */
    let values = valueHelpers.value.get(listObject, "itemListElement", []);
    for (let v of values) {
        if (getValue(v, "position") >= startingPoint) {
            ph.value.set(v, "position", getValue(v, "position") + delta);
        }
    }
    return listObject;
}

function deleteListItem(listObject, index) {
    /**
     * Deletes a list item from a list object
     * @param {Object} listObject - The list object
     * @param {Number} index - The index of the list item
     * @returns {Object} - The list object with the list item deleted
     * @example deleteListItem({@type: "List", itemListElement: [{@type: "Thing", name: "John Doe"}]}, 0) // {@type: "List", itemListElement: []}
     *
     */
    let item = getListItem(listObject, index);
    if (item === undefined) {
        return listObject;
    }

    // Get neighbors
    let previousItem = getListItem(listObject, index - 1);
    let nextItem = getListItem(listObject, index + 1);

    // Reset item
    ph.value.set(item, "position", undefined);
    ph.value.set(item, "previousElement", undefined);
    ph.value.set(item, "nextElement", undefined);

    // Reset neighbors
    if (previousItem !== undefined) {
        ph.value.set(previousItem, "nextElement", getRef(nextItem));
    }
    if (nextItem !== undefined) {
        ph.value.set(nextItem, "previousElement", getRef(previousItem));
    }

    // Reset position
    listObject = resetPosition(listObject, index, -1);

    // Remove item
    deleteValue(listObject, "itemListElement", item);

    return listObject;
}

/**
 * Inserts a list item into a list object
 * @param {Object} listObject - The list object
 * @param {Number} index - The index of the list item
 * @param {Object} listItem - The list item
 * @returns {Object} - The list object with the list item inserted
 */
function insertListItem(listObject, index, listItem) {
    /**
     * Inserts a list item into a list object
     *
     */

    // Check if index is valid
    if (index < 0 || index > length(listObject)) {
        index = length(listObject);
    }

    // Insert item
    let previousItem = getListItem(listObject, index - 1);
    let nextItem = getListItem(listObject, index + 1);
    let newItem = toListItem(listItem);
    ph.value.set(newItem, "position", index);
    ph.value.set(newItem, "previousElement", getRef(previousItem));
    ph.value.set(newItem, "nextElement", getRef(nextItem));

    if (previousItem !== undefined) {
        ph.value.set(previousItem, "nextElement", getRef(newItem));
    }
    if (nextItem !== undefined) {
        ph.value.set(nextItem, "previousElement", getRef(newItem));
    }

    // Reset position
    listObject = resetPosition(listObject, index, 1);

    // Add value
    addValue(listObject, "itemListElement", newItem);

    return listObject;
}

function append(listObject, listItem) {
    /**
     * Appends a record to a list object
     * @param {Object} listObject - The list object
     * @param {Object} record - The record to append
     * @returns {Object} - The list object with the record appended
     * @example append({@type: "List", itemListElement: [{@type: "Thing", name: "John Doe"}]}, {@type: "Thing", name: "Jane Doe"}) // {@type: "List", item
     * ListElement: [{@type: "Thing", name: "John Doe"}, {@type: "Thing", name: "Jane Doe"}]}
     *
     */

    return insertListItem(listObject, length(listObject), listItem);
}

function prepend(listObject, listItem) {
    /**
     * Prepends a record to a list object
     * @param {Object} listObject - The list object
     * @param {Object} record - The record to prepend
     * @returns {Object} - The list object with the record prepended
     * @example prepend({@type: "List", itemListElement: [{@type: "Thing", name: "John Doe"}]}, {@type: "Thing", name: "Jane Doe"}) // {@type: "List",
     * itemListElement: [{@type: "Thing", name: "Jane Doe"}, {@type: "Thing", name: "John Doe"}]}
     */
    return insertListItem(listObject, 0, listItem);
}
