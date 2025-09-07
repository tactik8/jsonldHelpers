
import { ArrayHelpers } from './src/arrayHelpers/arrayHelpers.models.js'
import { ObjectHelpers } from './src/objectHelpers/objectHelpers.models.js'
import { PropertyHelpers } from './src/propertyHelpers/propertyHelpers.models.js'
import { SchemaOrgHelpers } from './src/schemaOrgHelpers/schemaOrgHelpers.models.js'
import { UtilHelpers} from './src/utilHelpers/utilHelpers.models.js'
import { ValueHelpers} from './src/valueHelpers/valueHelpers.models.js'
import { ObservationHelpers} from './src/observationHelpers/observationHelpers.models.js'

import { services } from './baseHelpers.services.js'

export class BaseHelpers {
    constructor(){

        
        
    }

    // -----------------------------------------------------
    //  Sub modules 
    // -----------------------------------------------------


    static get ArrayHelpers(){
        return ArrayHelpers
    }

    static get ObjectHelpers(){
        return ObjectHelpers
    }

    static get ObservationHelpers(){
        return ObservationHelpers
    }

    static get PropertyHelpers(){
        return PropertyHelpers
    }

    static get SchemaOrgHelpers(){
        return SchemaOrgHelpers
    }

    static get UtilHelpers(){
        return UtilHelpers
    }

    static get ValueHelpers(){
        return ValueHelpers
    }
    

    // -----------------------------------------------------
    //  Properties 
    // -----------------------------------------------------

    static get keys(){
        return PropertyHelpers.keys
    }
    
    static get value(){
        return PropertyHelpers.value
    }

    static get values(){
        return PropertyHelpers.values
    }

    static get record_type(){
        return PropertyHelpers.record_type
    }

    static get record_id(){
        return PropertyHelpers.record_id
    }



    // -----------------------------------------------------
    //  Util opperators 
    // -----------------------------------------------------

    /**
     * 
     */
    static get date(){
        return UtilHelpers.date
    }

    /**
     * 
     */
    static get uuid(){
        return UtilHelpers.uuid
    }

    /**
     * Gets the base url of a url
     * @param {*} value
     * @returns {*}
     */
    static get url(){
        return UtilHelpers.url
    }


    
    // -----------------------------------------------------
    //  Base operators 
    // -----------------------------------------------------

    /**
     * Cleans a jsonld object
     * @param {*} value
     * @returns {*}
     * @description Removes undefined values, empty arrays, arrays of one from a jsonld object
     */
    static clean(value){
        return ObjectHelpers.clean(value)
    }

    /**
     * Checks if a value is a jsonld object
     * @param {*} value
     * @returns {boolean}
     */
    static isJSONLD(value){
        return ObjectHelpers.isValid(value)
    }
    
    /**
     * Checks if a value is a jsonld object
     * @param {*} value
     * @returns {boolean}
     */
    static isValid(value){
        return ObjectHelpers.isValid(value)
    }

    
    /**
     * Checks if a jsonld object is null (no properties beyond @)
     * @param {*} value
     * @returns {boolean}
     */
    static isNull(value){
        return ObjectHelpers.isNull(value)
    }

    /**
     * Gets the reference of a jsonld object (type and id)
     * @param {*} value
     * @returns {*}
     */
    static get ref(){
        return ObjectHelpers.ref
    }


    /**
     * Checks if a jsonld object meets the filter params
     * @param {*} value
     * @param {*} filterParams
     * @param {*} negativeFilterParams
     * @param {*} strict
     * TODO: Find better name
     */
    static test(value, filterParams, negativeFilterParams, strict){
        return ObjectHelpers.test(value, filterParams, negativeFilterParams, strict)
    }

    // -----------------------------------------------------
    //  Comparisons operators 
    // -----------------------------------------------------

    /**
     * Checks if two values are equal (jsonld or other)
     * @param {*} a
     * @param {*} b
     * @returns {boolean}
     */
    static eq(a, b){
        return ObjectHelpers.eq(a, b)
    }

    /**
     * Checks if two values are not equal (jsonld or other)
     * @param {*} a
     * @param {*} b
     * @returns {boolean}
     */
    static ne(a, b){
        return ObjectHelpers.ne(a, b)
    }

    /**
     * Checks if two values are the same (share same type and id)
     * @param {*} a
     * @param {*} b
     * @returns {boolean}
     */
    static isSame(a, b){
        return ObjectHelpers.isSame(a, b)
    }

    /**
     * Checks if a is less than b (alpha type, alpha id)
     * @param {*} a
     * @param {*} b
     * * @returns {boolean}
     */
    static lt(a, b){
        return ObjectHelpers.lt(a, b)
    }

    /**
     * Checks if a is less than or equal to b (alpha type, alpha id)
     * @param {*} a
     * @param {*} b
     * * @returns {boolean}
     */
    static le(a, b){
        return ObjectHelpers.le(a, b)
    }

    /**
     * Checks if a is greater than b (alpha type, alpha id)
     * @param {*} a
     * @param {*} b
     * * @returns {boolean}
     */
    static gt(a, b){
        return ObjectHelpers.gt(a, b)
    }

    /**
     * Checks if a is greater than or equal to b (alpha type, alpha id)
     * @param {*} a
     * @param {*} b
     * * @returns {boolean}
     */
    static ge(a, b){
        return ObjectHelpers.ge(a, b)
    }


    /**
     * Gets the difference between two jsonld objects
     * @param {*} a
     * @param {*} b
     * @returns {*}
     */
    static diff(a, b){
        return ObjectHelpers.diff(a, b)
    }

    /**
     * Merges two jsonld objects
     * @param {*} a
     * @param {*} b
     * @returns {*}
     */
    static merge(a, b){
        return ObjectHelpers.merge(a, b)
    }

    

    // -----------------------------------------------------
    //  Nested values operators 
    // -----------------------------------------------------

    /**
     * Gets the nested records of a jsonld object
     * @param {*} value
     * @returns {*}
     */
    static get children(){
        return ObjectHelpers.children
    }

    /**
     * Flattens a jsonld object
     * @param {*} value
     * @returns {*}
     */
    static flatten(value){
        return ObjectHelpers.flatten(value)
    }

    /**
     * Flattens a jsonld object
     * @param {*} value
     * @returns {*}
     */
    static flat(value){
        return ObjectHelpers.flatten(value)
    }

    /**
     * Unflattens a jsonld object
     * @param {*} value
     * @param {*} records
     * @returns {*}
     */
    static unFlatten(value, records){
        return ObjectHelpers.unFlatten(value, records)
    }
    
    
    // -----------------------------------------------------
    //  Array operators
    // -----------------------------------------------------

    static toArray(value){
        return ArrayHelpers.toArray(value)
    }

    /**
     * Finds first jsonld object in an array that meets condition
     * @param {*} values
     * @param {*} filterParams
     * @returns {*}
     */
    static find(filter, values){
        return ArrayHelpers.search(filter)?.[0]
    }


    /**
     * Adds a jsonld object to an array of jsonld objects
     * @param {*} value
     * @param {*} values
     * @returns {*}
     */
    static add(value, values){
        return ArrayHelpers.add(value, values)
    }
    
    /**
     * Replaces values in an array of jsonld objects
     * @param {*} value
     * @param {*} values
     * @param {*} processNested
     */
    static replace(value, values, processNested){
        return ArrayHelpers.replace(value, values, processNested)
    }
    
    /**
     * Filters an array of jsonld objects
     * @param {*} values
     * @param {*} filterParams
     * @param {*} negativeFilterParams
     * @param {*} strict
     * @returns {*}
     * 
     */
    static get filter(){
        return ArrayHelpers.filter
    }

    /**
     * Deduplicates an array of jsonld objects
     * @param {*} values
     * @returns {*}
     * @description Removes duplicates from an array of jsonld objects
     */
    static get dedupe(){
        return ArrayHelpers.deduplicate
    }

    /**
     * Sorts an array of jsonld objects
     * @param {*} values
     * @param {*} inverse
     * @returns {*}
     */
    static sort(values, inverse){
        return ArrayHelpers.sort(values, inverse)
    }

    /**
     * Deduplicates an array of jsonld objects
     * @param {*} values
     * @returns {*}
     * @description Removes duplicates from an array of jsonld objects
     */
    static deduplicate(values){
        return ArrayHelpers.deduplicate(values)
    }

    /**
     * Deduplicates an array of jsonld objects
     * @param {*} values
     * @returns {*}
     */
    static dedupe(values){
        return ArrayHelpers.deduplicate(values)
    }

    /**
     * Gets the difference between two arrays of jsonld objects
     * @param {*} listA
     * @param {*} listB
     * @returns {*} The elements in listA not in listB
     */
    static diff(listA, listB){
        return ArrayHelpers.diff(listA, listB)
    }

    /**
     * Concatenates two arrays of jsonld objects
     * @param {*} listA
     * @param {*} listB
     * @returns {*} The elements in listA and listB
     */
    static concat(listA, listB){
        return ArrayHelpers.concat(listA, listB)
    }

    /**
     * Checks if an array of jsonld objects contains a value (type and id)
     * @param {*} records
     * @param {*} value
     * @returns {boolean}
     */
    static contains(records, value){
        return ArrayHelpers.contains(records, value)
    }
    
}