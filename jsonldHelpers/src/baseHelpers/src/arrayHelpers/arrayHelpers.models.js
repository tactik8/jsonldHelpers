/**
 * @fileoverview This file contains the ArrayHelpers class, which provides methods for manipulating arrays of JSON-LD records.
 * @module arrayHelpers.models
 */

import { services } from "./arrayHelpers.services.js";

export class ArrayHelpers {
    constructor(records) {
        this.records = records;
    }


    /**
     * Gets the value of a reference from an array of records.
     * @param {*} ref - The reference to get.
     * @param {Boolean} processNested - Whether to process nested references.
     * @returns {*} - The value of the reference.
     */
    get(ref, processNested=false){
        this.records = services.get(ref, this.records, processNested);
    }

    /**
     * Sets the value of a reference in an array of records.
     * @param {*} value - The value to set.
     * @returns {Array} - The updated array of records.
     */
    set(value){
        this.records = services.set(value, this.records);
    }

    /**
     * Deletes a reference from an array of records.
     * @param {*} ref - The reference to delete.
     * @returns {Array} - The updated array of records.
     */
    delete(ref){
        this.records = services.delete(ref, this.records);
    }


    /**
     * Adds a value to an array of records.
     * @param {*} value - The value to add.
     * @returns {Array} - The updated array of records.
     */
    add(value){
        this.records = services.add(value, this.records);
    }

    /**
     * Filters an array of records based on filter parameters.
     * @param {Object} filterParams - The filter parameters.
     * @param {Object} negativeFilterParams - The negative filter parameters.
     * @returns {Array} - The filtered array of records.
     */
    filter(filterParams, negativeFilterParams){
        this.records = services.filter(this.records, filterParams, negativeFilterParams);
    }

    /**
     * Sorts an array of records based on sort parameters.
     * @param {Object} sortParams - The sort parameters.
     * @returns {Array} - The sorted array of records.
     */
    sort(sortParams){
        this.records = services.sort(this.records, sortParams);
    }

    /**
     * Gets the unique references from an array of records (@type & @id).
     * @returns {Array} - The unique references.
     */
    getUniqueRefs(){
        return services.getUniqueRefs(this.records);
    }

    /**
     * Deduplicates an array of records.
     * @returns {Array} - The deduplicated array of records.
     * @description - This method removes duplicate records from an array of records.
     * A record is considered a duplicate if it has the same @type and @id as another record in the array.
     * The first occurrence of a duplicate record is kept, and subsequent occurrences are removed.
     * The order of the records is preserved.
     * The deduplication is performed in place, meaning that the original array of records is modified.
     * 
     */
    deduplicate(){
        this.records = services.deduplicate(this.records);
    }

    /**
     * Gets the difference between an array of records and another array of records.
     * @param {Array} records - The array of records to compare.
     * @returns {Array} - The difference between the two arrays of records.
     * @description - This method returns an array of records that are in the first array of records but not in the second array of records.
     * A record is considered to be in the difference if it has the same @type and @id as a record in the first array of records but not in the second array of records.
     * The order of the records in the difference is the same as the order of the records in the first array of records.
     * The difference is NOT performed in place, meaning that the original array of records is NOT modified.
     */
    diff(records){
        return services.diff(this.records, records);
    }

    /**
     * Concatenates an array of records with another array of records.
     * @param {Array} records - The array of records to concatenate.
     * @returns {Array} - The concatenated array of records.
     * @description - This method returns an array of records that is the concatenation of the first array of records and the second array of records.
     * The order of the records in the concatenated array is the same as the order of the records in the first array of records followed by the order of the records in the second array of records.
     * The concatenation is performed in place, meaning that the original array of records is modified.
     */
    concat(records){
        this.records = services.concat(this.records, records);
    }

    /**
     * Checks if an array of records contains a value.
     * @param {*} value - The value to check.
     * @returns {Boolean} - True if the array of records contains the value, false otherwise.
     * @description - This method returns true if the array of records contains a record that has the same @type and @id as the value.
     */
    contains(value){
        return services.contains(this.records, value);
    }
    
    // -----------------------------------------------------
    //  Static 
    // -----------------------------------------------------



    /**
     * Converts a value to an array.
     * @param {*} value - The value to convert.
     * @returns {Array} - The array.  
     */
    static toArray(value){
        return services.toArray(value);
    }
    
    /**
     * Gets the value of a reference from an array of records.
     * @param {*} ref - The reference to get.
     * @param {Array} records - The array of records.
     * @param {Boolean} processNested - Whether to process nested references.
     * @returns {*} - The value of the reference.
     */
    static get(ref, records, processNested=false) {
        return services.get(ref, records, processNested);
    }

    /**
     * Sets the value of a reference in an array of records.
     * @param {*} value - The value to set.
     * @param {Array} records - The array of records.
     * @returns {Array} - The updated array of records.
     */
    static set(value, records){
        return services.set(value, records);
    }

    /**
     * Deletes a reference from an array of records.
     * @param {*} ref - The reference to delete.
     * @param {Array} records - The array of records.
     * @returns {Array} - The updated array of records.
     */
    static delete(ref, records){
        return services.delete(ref, records);
    }

    /**
     * Adds a value to an array of records.
     * @param {*} value - The value to add.
     * @param {Array} records - The array of records.
     * @returns {Array} - The updated array of records.
     */
    static add(value, records){
        return services.add(value, records);
    }

    /**
     * Filters an array of records based on filter parameters.
     * @param {Array} records - The array of records.
     * @param {Object} filterParams - The filter parameters.
     * @param {Object} negativeFilterParams - The negative filter parameters.
     * @returns {Array} - The filtered array of records.
     */
    static filter(records, filterParams, negativeFilterParams){
        return services.filter(records, filterParams, negativeFilterParams);
    }

    /**
     * Sorts an array of records based on sort parameters.
     * @param {Array} records - The array of records.
     * @param {Object} sortParams - The sort parameters.
     * @returns {Array} - The sorted array of records.
     */
    static sort(records, sortParams){
        return services.sort(records, sortParams);
    }

    /**
     * Gets the unique references from an array of records (@type & @id).
     * @param {Array} records - The array of records.
     * @returns {Array} - The unique references.
     */
    static getUniqueRefs(records){
        return services.getUniqueRefs(records);
    }

    /**
     * Deduplicates an array of records.
     * @param {Array} records - The array of records.
     * @returns {Array} - The deduplicated array of records.
     */
    static deduplicate(records){
        return services.deduplicate(records);
    }

    /**
     * Gets the difference between two arrays of records.
     * @param {Array} records1 - The first array of records.
     * @param {Array} records2 - The second array of records.
     * @returns {Array} - The difference between the two arrays of records.
     */
    static diff(records1, records2){
        return services.diff(records1, records2);
    }

    /**
     * Concatenates two arrays of records.
     * @param {Array} records1 - The first array of records.
     * @param {Array} records2 - The second array of records.
     * @returns {Array} - The concatenated array of records.
     */
    static concat(records1, records2){
        return services.concat(records1, records2);
    }

    /**
     * Checks if an array of records contains a value.
     * @param {Array} records - The array of records.
     * @param {*} value - The value to check.
     * @returns {Boolean} - True if the array of records contains the value, false otherwise.
     */
    static contains(records, value){
        return services.contains(records, value);
    }

}

