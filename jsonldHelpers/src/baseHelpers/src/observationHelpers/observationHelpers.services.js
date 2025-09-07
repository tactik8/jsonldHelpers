
import { ObservationStats} from './src/observationStats/observationStats.models.js'

import { BaseHelpers as h } from '../../baseHelpers.models.js'

export const services = {
    record: {
        get: reducer,
        toObservations: toObservations,
    },
    observations: {
        get: toObservations,
        toRecord: reducer,
    },
    sort: sort,
    toString: toString,
    toJSON: toJSON,
    analysis: {
        get: getAnalysis,
    }
};

// -----------------------------------------------------
//  Comment
// -----------------------------------------------------

function toJSON(action) {
    if (Array.isArray(action)) {
        return action.map((x) => toJSON(x));
    }

    let record = {
        "@type": action?.targetCollection?.["@type"] || "",
        "@id": action?.targetCollection?.["@id"] || "",
        propertyID: action?.["object"]?.["propertyID"] || "",
        credibility: action?.["@metadata"]?.["credibility"] || "",
        value: action?.["object"]?.["value"] || "",
    };
    return record;
}

function toString(action) {
    if (Array.isArray(action)) {
        return action.map((x) => toString(x)).join("\n");
    }

    return `${action?.["@type"] || ""} ${action?.["object"]?.["propertyID"] || ""} ${action?.["@metadata"]?.["credibility"] || ""} ${action?.["object"]?.["value"] || ""}`;
}

// -----------------------------------------------------
//  to obs
// -----------------------------------------------------

/**
 * Converts a record to a list of observations
 * @param {Object} record
 * @param {Object} metadata
 * @param {Boolean} setAsAdd
 * @returns {Array}
 *
 */
function toObservations(record, metadata, setAsAdd = false) {
    if (Array.isArray(record)) {
        return record.map((x) => toObservations(x, metadata, setAsAdd));
    }

    if (typeof record !== "object") {
        return undefined;
    }

    let results = [];
    for (let k of Object.keys(record)) {
        let values = record?.[k] || [];
        values = Array.isArray(values) ? values : [values];

        let observationGroup =  h.uuid.get()
        for (let value of values) {
            if (setAsAdd === true) {
                results.push(addAction(record, k, value, metadata, observationGroup));
            } else {
                results.push(replaceAction(record, k, "*", value, metadata, observationGroup));
            }
        }
    }
    return results;
}

// -----------------------------------------------------
//  Reducer
// -----------------------------------------------------

/**
 * Reduces a list of actions to a record
 * @param {Array} actions
 * @returns {Object}
 *
 */
function reducer(actions) {
    let result = {};

    // Get propertyIDs
    let propertyIDs = actions.map((x) => x?.["object"]?.["propertyID"]);
    propertyIDs = [...new Set(propertyIDs)];

    propertyIDs.sort()

    
    // Iterate propertyIDs
    for (let propertyID of propertyIDs) {
        // Get actions for propertyID
        let subActions = actions.filter(
            (x) => x?.["object"]?.["propertyID"] == propertyID,
        );

        // Sort sub actions
        subActions = sort(subActions);

        // For each delete action, remove all lower actions
        let deleteActions = subActions.filter(
            (x) => x?.["@type"] === "DeleteAction",
        );
        for (let deleteAction of deleteActions) {
            subActions = subActions.filter((x) => !lt(x, deleteAction) );
        }

        // For each replace actions, remove older value
        let replaceActions = subActions.filter(
            (x) => x?.["@type"] === "ReplaceAction",
        );
        for (let replaceAction of replaceActions) {
            subActions = subActions.filter(
                (x) =>
                    x?.["object"]?.["value"] !=
                        replaceAction?.["replacee"]?.["value"] &&
                    !lt(x, replaceAction) ,
            );
        }

        // For each replace actions with star, remove older value
        let replaceActionsStar = subActions.filter(
            (x) =>
                x?.["@type"] === "ReplaceAction" &&
                x?.["replacee"]?.["value"] === "*",
        );
        for (let replaceAction of replaceActionsStar) {
            subActions = subActions.filter((x) => !lt(x, replaceAction) );
        }

        // Compile new values
        let values = subActions.map((x) => x?.["object"]?.["value"]);

        // Dedupe new values
        values = h.dedupe(values);

        // Assign new value to record
        if (values.length == 1) {
            result[propertyID] = values?.[0];
        }
        if (values.length > 1) {
            result[propertyID] = values;
        }
    }

    return result;
}

// -----------------------------------------------------
//  Comment
// -----------------------------------------------------

function getAnalysis(actions) {

    return ObservationStats.get(actions)
}

// -----------------------------------------------------
//  Comment
// -----------------------------------------------------

function addAction(object, propertyID, value, metadata, observationGroup) {
    let record = {
        "@type": "AddAction",
        "@id": "action_" + h.uuid.get(),
        name: "Add PropertyValue",
        actionStatus: "CompletedActionStatus",
        startTime: new Date(),
        endTime: new Date(),
        object: getPropertyValue(propertyID, value),
        targetCollection: _getRef(object),
        instrument: metadata?.instrument,
        observationGroup: observationGroup,
        "@metadata": metadata,
    };

    return record;
}

function deleteAction(object, propertyID, value, metadata, observationGroup) {
    let record = {
        "@type": "DeleteAction",
        "@id": "action_" + h.uuid.get(),
        name: "Delete PropertyValue",
        actionStatus: "CompletedActionStatus",
        startTime: new Date(),
        endTime: new Date(),
        object: getPropertyValue(propertyID, value),
        targetCollection: _getRef(object),
        instrument: metadata?.instrument,
        observationGroup: observationGroup,
        "@metadata": metadata,
    };

    return record;
}

function replaceAction(object, propertyID, oldValue, newValue, metadata, observationGroup) {
    let record = {
        "@type": "ReplaceAction",
        "@id": "action_" + h.uuid.get(),
        name: "Delete PropertyValue",
        actionStatus: "CompletedActionStatus",
        startTime: new Date(),
        endTime: new Date(),
        object: getPropertyValue(propertyID, newValue),
        replacee: getPropertyValue(propertyID, oldValue),
        targetCollection: _getRef(object),
        instrument: metadata?.instrument,
        observationGroup: observationGroup,
        "@metadata": metadata,
    };

    return record;
}

// -----------------------------------------------------
//  Comparison / manipulation
// -----------------------------------------------------

function getMetadata(action) {
    return action?.["@metadata"] || {};
}

function lt(action1, action2) {
    // Priority 1. Credibility


    if(action1?.observationGroup && action1?.observationGroup == action2?.observationGroup){
        return false
    }
    
    let c1 = getMetadata(action1)?.["credibility"] || 0;
    let c2 = getMetadata(action2)?.["credibility"] || 0;
    if (c1 != c2) {
        return c1 < c2;
    }

    // Priority 2. Date
    let d1 = _getDate(action1);
    let d2 = _getDate(action2);

    if (_isNotNull(d1)) {
        return h.date.lt(d1, d2);
    }

    return false;
}

function gt(action1, action2) {
    // Priority 1. Credibility

    if(action1?.observationGroup && action1?.observationGroup == action2?.observationGroup){
        return false
    }
    
    let c1 = getMetadata(action1)?.["credibility"] || 0;
    let c2 = getMetadata(action2)?.["credibility"] || 0;
    if (c1 != c2) {
        return c1 > c2;
    }

    // Priority 2. Date
    let d1 = _getDate(action1);
    let d2 = _getDate(action2);

    if (_isNotNull(d1)) {
        return h.date.gt(d1, d2);
    }

    return false;
}

function sort(actions) {
    actions = actions.sort((a, b) => lt(a, b));
    return actions;
}

function filter() {}

// -----------------------------------------------------
//  Helpers
// -----------------------------------------------------

function _isNull(value) {
    return (
        value === undefined ||
        value === null ||
        value === "" ||
        value == [] ||
        value == {}
    );
}

function _isNotNull(value) {
    return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value != [] &&
        value != {}
    );
}

function _getDate(action) {
    return (
        action?.metadata?.dateModified ||
        action?.metadata?.dateCreated ||
        action?.["startTime"] ||
        action?.["endTime"]
    );
}

function _isSameValue(value1, value2) {
    if (_isNull(value1) && _isNull(value2)) {
        return true;
    }

    if (_isNull(value1) || _isNull(value2)) {
        return false;
    }

    if (typeof value1 === "object" && typeof value2 === "object") {
        if (value1?.["@id"] === value2?.["@id"]) {
            return true;
        } else {
            return false;
        }
    }

    return value1 == value2;
}

function getPropertyValue(propertyID, value) {
    let record = {
        "@type": "PropertyValue",
        "@id": "propertyValue_" + h.uuid.get(),
        propertyID: propertyID,
        value: value,
    };
    return record;
}

function _getRef(record_or_record_type, record_id) {
    let record_type = record_or_record_type?.["@type"] || record_or_record_type;

    record_id = record_or_record_type?.["@id"] || record_id;

    let ref = {
        "@type": record_type,
        "@id": record_id,
    };

    return ref;
}
