



import { objectHelpers} from './objectHelpers.js'
import { arrayHelpers} from './arrayHelpers.js'
import { valueHelpers} from './valueHelpers.js'


export const services = {

    
}





// -----------------------------------------------------
//  Comment 
// -----------------------------------------------------

const STRING_KEYS = ['@type', 'name', 'actionStatus', 'startTime', 'endTime', 'duration', 'object', 'result']


// -----------------------------------------------------
//  Comment 
// -----------------------------------------------------

function toString(action, defaultValue) {
    /**
     * Convert record to string
     * @param {object} action
     * @returns {string}
     * 
     */

    const STRING_KEYS = ['@type', 'name', 'actionStatus', 'startTime', 'endTime', 'duration', 'object', 'result']

    // Handle array

    if (Array.isArray(action)){
        return toStringArray(action, defaultValue)
    }

    // error handling
    if (isValid(action) === false) {
        if (defaultValue === undefined) {
            throw new Error("Invalid action", action)
        }
        return defaultAction
    }



    // return string
    let humanRecord = toHuman(action)
    let content = []
    for (let k of STRING_KEYS) {
        content.push(`${k}: ${humanRecord?.[k] || ''}`)
    }


    // Join content
    let result = content.join(", ")
    return result
}



function getDuration(action, defaultValue){
    /**
     * Get duration of action in seconds
     * @param {object} action
     * @returns {number} in seconds
     * 
     */


    // error handling
    if (isValid(action) === false) {
        if (defaultValue === undefined) {
            throw new Error("Invalid action", action)
        }
        return defaultAction
    }




    // Retrieve duration
    let duration = undefined

    let date1 = action?.["startTime"]
    let date2 = action?.["endTime"] || new Date()

    // Handle null
    if (date1 === undefined || date1 === null) {
        return undefined
    }

    // Handle date
    let c1 = typeof date1.getMonth === 'function'
    let c2 = typeof date2.getMonth === 'function'

    if (c1 && c2){
        duration = (date2 - date1) / 1000
    }

    return duration

}


function toHuman(action, defaultValue) {
    /**
     * Convert record to human readable format
     * @param {object} action
     * @returns {string}
     */

    // Initialize human record
    let newRecord = {}
    STRING_KEYS.map(x => newRecord[x] = action?.[x])



    // Convert status
    if (typeof action["actionStatus"] === "string") {
        newRecord["actionStatus"] = action["actionStatus"].replace("ActionStatus", "")
        newRecord["actionStatus"] = newRecord["actionStatus"].charAt(0).toUpperCase() + newRecord["actionStatus"].slice(1)
    }

    // Convert dates
    if (action["startTime"] && typeof action["startTime"].getMonth === 'function') {
        newRecord["startTime"] = action["startTime"].toLocaleString()
    }
    if (action["endTime"] && typeof action["endTime"].getMonth === 'function') {
        newRecord["endTime"] = action["endTime"].toLocaleString()
    }

    // Calculate duration
    newRecord["duration"] = getDuration(action)

    // Handle object, instrument, agent, result
    for (let k of STRING_KEYS) {

        let value = newRecord[k]

        if (value === undefined) {
            continue
        }

        if (Array.isArray(value) ) {
            if (value.length === 0) {
                continue
            } else if (value.length === 1) {
                newRecord[k] = value[0]
            }
        } 

        // Handle array
        if (Array.isArray(value) ) {
            newRecord[k] = `(${value.length})`
            continue
        }

        // Handle object
        else if (typeof value === "object") {
            let ref = `${value?.["@type"] || ''}/${value["@id"] || ''}`
            newRecord[k] = ref
            continue
        }

        else {
            // Handle others
            newRecord[k] = value
        }

    }
    // Ensure all values are strings
    for (let k in newRecord) {
        let value = newRecord?.[k]
        if ((value === undefined || value === null) && value !== 0) {
            newRecord[k] = 'NA'
        } else {
            newRecord[k] = value.toString()
        }
    }

    // Ensure all values are < than 22 characters (for dates)
    for (let k in newRecord) {

        let value = newRecord?.[k]
        if (value.length > 22) {
            newRecord[k] = value.substring(0, 18) + '...'
        }
    }


    //
    return newRecord


}


function newAction(name) {
    /**
     * @param {string} actionName
     * @returns {object}
     * 
     */

    let record = {
        "@type": "Action",
        "@id": objectHelpers.uuid.new(),
        "name": name,
        "actionStatus": "completedActionStatus",
        "startTime": undefined,
        "endTime": undefined,
        "object": undefined,
        "result": undefined,
        "instrument": undefined,
        "url": undefined
    }

    return record
}

function isValid(action) {
    /**
     * Check if record is valid action
     * @param {object} action
     * @returns {boolean}
     */

    // Check if undefined
    if (action === undefined || action === null) {
        return false
    }

    // Check if object
    if (typeof action !== "object") {
        return false
    }


    // Retrieve @type
    let record_type = action?.["@type"] || undefined

    if (record_type === undefined || record_type == []) {
        return false
    }

    //Convert to array
    record_type = Array.isArray(record_type)
        ? record_type : [record_type]

    //Go through array 
    for (let r of record_type) {

        // Check if string
        if (typeof r !== "string") {
            continue
        }

        // Convert to lowercase
        r = r.toLowerCase()

        // Check if string includes action
        if (r.includes('action')) {
            return true
        }
    }

    return false
}




// -----------------------------------------------------
//  Get status 
// -----------------------------------------------------


function isPotential(action){
    /**
     * Check if action is potential
     * @param {object} action
     * @returns {boolean}
     * */
    return action?.["actionStatus"] === "potentialActionStatus"
}

function isActive(action){
    /**
     * Check if action is active
     * @param {object} action
     * @returns {boolean}
     * */
    return action?.["actionStatus"] === "activeActionStatus"
}

function isCompleted(action){
    /**
     * Check if action is completed
     * @param {object} action
     * @returns {boolean}
     * */
    return action?.["actionStatus"] === "completedActionStatus"
}

function isFailed(action){
    /**
     * Check if action is failed
     * @param {object} action
     * @returns {boolean}
     * */
    return action?.["actionStatus"] === "failedActionStatus"
}



// -----------------------------------------------------
//  Set status 
// -----------------------------------------------------



function setPotential(action, defaultValue) {
    /**
     * Set the actionStatus parameter to potentialActionStatus
     * and set the startTime parameter to the current time
     * @param {object} action
     * @param {date || string} startTime
     * @returns {object}   
     * 
     */

    // error handling
    if (isValid(action) === false) {
        if (defaultValue === undefined) {
            throw new Error("Invalid action", action)
        }
        return defaultAction
    }

    // set active
    action["actionStatus"] = "potentialActionStatus"

    // set startTime
    action["startTime"] = undefined
    action["endTime"] = undefined

    // return action
    return action


}


function setActive(action, defaultValue) {
    /**
     * Set the actionStatus parameter to activeActionStatus
     * and set the startTime parameter to the current time
     * @param {object} action
     * @param {date || string} startTime
     * @returns {object}   
     * 
     */

    // error handling
    if (isValid(action) === false) {
        if (defaultValue === undefined) {
            throw new Error("Invalid action", action)
        }
        return defaultAction
    }

    // set active
    action["actionStatus"] = "activeActionStatus"

    // set startTime
    action["startTime"] = new Date()

    // return action
    return action


}

function setCompleted(action, defaultValue) {
    /**
     * Set the actionStatus parameter to completedActionStatus
     * and set the endTime parameter to the current time
     * @param {object} action
     * @param {date || string} startTime
     * @returns {object}   
     * 
     */

    // error handling
    if (isValid(action) === false) {
        if (defaultValue === undefined) {
            throw new Error("Invalid action", action)
        }
        return defaultAction
    }

    // set active
    action["actionStatus"] = "completedActionStatus"

    // set startTime
    action["startTime"] = action?.["startTime"] || new Date()
    action["endTime"] = new Date()

    // return action
    return action


}

function setFailed(action, error, defaultValue) {
    /**
     * Set the actionStatus parameter to failedActionStatus
     * and set the endTime parameter to the current time
     * @param {object} action
     * @param {date || string} startTime
     * @returns {object}   
     * 
     */

    // error handling
    if (isValid(action) === false) {
        if (defaultValue === undefined) {
            throw new Error("Invalid action", action)
        }
        return defaultAction
    }

    // set active
    action["actionStatus"] = "failedActionStatus"

    // set startTime
    action["startTime"] = action?.["startTime"] || new Date()
    action["endTime"] = new Date()

    // set error
    action["error"] = error

    // return action
    return action
}



// -----------------------------------------------------
//  Array 
// -----------------------------------------------------


function toStringArray(action, defaultValue) {
    /**
     * Convert record to string
     * @param {object} action
     * @returns {string}
     */


    //
    let records = action.map(x => toHuman(x))

    // Initialize lines
    let lines = []
    lines.push('')
    lines.push('')
    action.map(x => lines.push(''))


    //Cycle through keys
    for (let k of STRING_KEYS) {

        // Get max length of key
        let maxLength = k.length
        records.map(x => maxLength < x[k]?.length || 0 ? maxLength = x[k].length : maxLength)

        lines[0] = lines[0] + k.padEnd(maxLength, ' ') + ' | '
        lines[1] = lines[1] + ''.padEnd(maxLength, '-') + ' | '

        records.map((x, i) => lines[i + 2] = lines[i + 2] + x[k]?.padEnd(maxLength, ' ') + ' | ')

    }


    // Add number of records
    lines.push('Number of records: ' + records.length)

    // FOrmat lines
    let result = lines.join('\n')

    return result

}


// -----------------------------------------------------
//  Filter based on status 
// -----------------------------------------------------



function get(actions, filterParams, negativeFilterParams){
    /**
     * Get actions based on filterParams
     * @param {array} actions
     * @param {object} filterParams
     * @param {object} negativeFilterParams
     * @returns {array}
     * 
     */

    return arrayHelpers.filter(actions, filterParams, negativeFilterParams)

}

function getPotential(actions){
    /**
     * Get active actions
     * @param {array} actions
     * @returns {array}
     */

    let filterParams = {
        "actionStatus": "potentialActionStatus"
    }

    return get(actions, filterParams)

}

function getActive(actions){
    /**
     * Get active actions
     * @param {array} actions
     * @returns {array}
     */


    let filterParams = {
        "actionStatus": "activeActionStatus"
    }

    return get(actions, filterParams)

}

function getCompleted(actions){
    /**
     * Get active actions
     * @param {array} actions
     * @returns {array}
     */

    let filterParams = {
        "actionStatus": "completedActionStatus"
    }

    return get(actions, filterParams)
}

function getFailed(actions){
    /**
     * Get active actions
     * @param {array} actions
     * @returns {array}
     */

    let filterParams = {
        "actionStatus": "failedActionStatus"
    }

    return get(actions, filterParams)
}


