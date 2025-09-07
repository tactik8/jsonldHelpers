/**
 * @file observationStats.services.js
 * @description Services for observationStats
 * @module observationStats/services
 */

import { BaseHelpers as h } from '../../../../baseHelpers.models.js'
export const services = {


    get: getAnalysis
    
};


/**
 * Gets the analysis of a set of actions
 * @param {Array} actions - The actions to analyze
 * @returns {Object} - The analysis of the actions
 * 
 */
function getAnalysis(actions) {
    // Get propertyIDs
    let propertyIDs = actions.map((x) => x?.["object"]?.["propertyID"]);

    propertyIDs = [...new Set(propertyIDs)];

    let record = {};

    // Iterate propertyIDs
    for (let propertyID of propertyIDs) {

        // Filter actions for propertyID
        let actionsForProperty = actions.filter(
            (x) => x?.["object"]?.["propertyID"] == propertyID,
        );
        actionsForProperty = sort(actionsForProperty);


        // Get unique values
        let values = actionsForProperty.map((x) => x?.["object"]?.["value"]);
        let uniqueValues = h.dedupe(values);


        // Iterate unique values
        let count = 0
        let stats = []
        for (let v of uniqueValues) {

            // Filter actions for value
            let actionsForValue = actionsForProperty.filter((x) =>
                _isSameValue(x?.["object"]?.["value"], v),
            );
            actionsForValue = sort(actionsForValue);

            // Get stats for value
            let valueAnalysis = {
                "@type": "PropertyValueAnalysis",
                propertyID: propertyID,
                value: v,
                position: count,
                stats: _getStatsForValue(actionsForValue, v),
            };
            stats.push(valueAnalysis);
            count ++
        }
        
        // Initialize record
        record[propertyID] = {
            "@type": "PropertyValueDistribution",
            "numberOfValues": uniqueValues.length, 
            "numberOfObservations": actionsForProperty.length,
            "bestValue": actionsForProperty[0]?.["object"]?.["value"],
            "itemListElement": stats
        };

        

        
    }
    return record;
}



function _getStatsForValue(actions, value){

    let stats = []
    
    // Keep actions for this value
    let subActions = actions.filter((x) => _isSameValue(x?.["object"]?.["value"], value))


    // Calculate confidence level
    let confidenceLevel = _getConfidenceLevel(subActions)
    stats.push(_getStatsVariable("confidenceLevel", "confidenceLevel", confidenceLevel))

    // Calculate nb of sources
    let nbSources = h.dedupe(
        subActions.map((x) => x?.["@metadata"]?.["datafeed"]),
    ).length;
    stats.push(_getStatsVariable("nbSources", "nbSources", nbSources))

    // Calculate nb of actions
    let nbActions = subActions.length;
    stats.push(_getStatsVariable("Count", "count", nbActions))

    // Calculate min credibility
    let minCredibility = Math.min(
        ...subActions.map(
            (x) => x?.["@metadata"]?.["credibility"],
        ),
    );
    stats.push(_getStatsVariable("minCredibility", "minCredibility", minCredibility))

    // Calculate max credibility
    let maxCredibility = Math.max(
        ...subActions.map(
            (x) => x?.["@metadata"]?.["credibility"],
        ),
    );

    stats.push(_getStatsVariable("maxCredibility", "maxCredibility", maxCredibility))

    // Calculate min date
    let minDate = h.date.min(...subActions.map((x) => _getDate(x)));
    stats.push(_getStatsVariable("minDate", "minDate", minDate))

    // Calculate max date
    let maxDate = h.date.max(...subActions.map((x) => _getDate(x)));
    stats.push(_getStatsVariable("maxDate", "maxDate", maxDate))

    return stats
    
    
}


function _getConfidenceLevel(actions) {
    let confidenceLevel =
        1 -
        actions.reduce(
            (t, x) => (1 - x?.["@metadata"]?.["credibility"]) * t,
            1,
        );

    confidenceLevel = Math.round(confidenceLevel * 1000) / 1000;

    return confidenceLevel;
}

function _getStatsVariable(measuredProperty, statType, value) {
    let record = {
        "@type": "StatisticalVariable",
        name: measuredProperty,
        measuredProperty: { "@id": measuredProperty },
        statType: { "@id": statType },
        value: value,
    };

    return record;
}






function lt(action1, action2) {
    // Priority 1. Credibility

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

function getMetadata(action) {
    return action?.["@metadata"] || {};
}




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
