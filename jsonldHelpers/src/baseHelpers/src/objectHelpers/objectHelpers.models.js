import { services } from './objectHelpers.services.js'
import { PropertyHelpers as ph } from '../propertyHelpers/propertyHelpers.models.js'

export class ObjectHelpers {
    constructor(record){
        this._record = record?.record || record
    }



    // -----------------------------------------------------
    //  Properties 
    // -----------------------------------------------------

    get record(){
        return this._record
    }

    set record(value){
        this._record = value
    }
    
    get record_type(){
        return services.record_type.get(this.record)
    }

    set record_type(value){
        this.record = services.record_type.set(this.record, value)
    }

    get record_id(){
        return services.record_id.get(this.record)
    }

    set record_id(value){
        this.record = services.record_id.set(this.record, value)
    }

    get ref(){
        return services.ref.get(this.record)
    }

    set ref(value){
        this.record = services.ref.set(this.record, value)
    }

    get name(){
        return ph.value.get(this.record, 'name')
    }

    set name(value){
        this.record = ph.value.set(this.record, 'name', value)
    }

    get description(){
        return ph.value.get(this.record, 'description')
    }

    set description(value){
        this.record = ph.value.set(this.record, 'description', value)
    }

    get url(){
        return ph.value.get(this.record, 'url')
    }

    set url(value){
        this.record = ph.value.set(this.record, 'url', value)
    }

    



    // -----------------------------------------------------
    //  Methods 
    // -----------------------------------------------------

    /**
     * Checks if a record is valid
     * @returns {Boolean} - True if the record is valid, false otherwise
     */
    isValid(){
        return services.isValid(this.record)
    }

    /**
     * Checks if a record is null
     * @returns {Boolean} - True if the record is null, false otherwise
     * 
     */
    isNull(){
        return services.isNull(this.record)
    }

    /**
     * Checks if two objects are the same (type and id)
     * @param {Object} record - The record to compare to
     * @returns {Boolean} - True if the objects are the same, false otherwise
     */
    isSame(record){
        return services.isSame(this.record, record?.record || record)
    }

    /**
     * Checks if two objects are equal (all values)
     * @param {Object} record - The record to compare to
     * @returns {Boolean} - True if the objects are equal, false otherwise
     */
    isEqual(record){
        return services.isEqual(this.record, record?.record || record)
    }

    /**
     * Flattens a record
     * @returns {Array} - The flattened record
     */
    flatten(){
        return services.flatten(this.record?.record || record)
    }

    /**
     * Unflattens a record
     * @param {Array} records - The list of records to use for unflattening
     * @returns {Object} - The unflattened record
     */
    unFlatten(records){
        return services.unFlatten(this.record, records)
    }

    /**
     * Gets the nested records of a record
     * @returns {Array} - The nested records
     */
    children(){
        return services.children(this.record)
    }




    // -----------------------------------------------------
    //  static 
    // -----------------------------------------------------


    /**
     * Creates a new jsonld record
     * @param {String} record_type - The type of the record
     * @param {String} record_id - The id of the record
     * @returns {Object} - The new record
     */
    static new(record_type, record_id){
        return services.new(record_type, record_id)
    }

    /**
     * Sets the ID of an object if it does not have one
     * @param {Object} record - The object to set the ID of
     * @returns {Object} - The object with the ID set
     */
    static setID(record, defaultValue){
        return services.setID(record?.record || record, defaultValue)
    }

    /**
     * Cleans a record
     * @param {Object} record - The record to clean
     * @returns {Object} - The cleaned record
     */
    static clean(record){
        return services.clean(record?.record || record)
    }

    /**
     * Gets the reference object of an object
     * @param {Object} record - The object to get the reference object of
     * @returns {Object} - The reference object
     */
    static get ref(){
        return services.ref
    }

    /**
     * Checks if a record is valid
     * @param {Object} record - The record to check
     * @returns {Boolean} - True if the record is valid, false otherwise
     */
    static isValid(record){
        return services.isValid(record?.record || record)
    }

    /**
     * Checks if a record is null
     * @param {Object} record - The record to check
     * @returns {Boolean} - True if the record is null, false otherwise
     */
    static isNull(record){
        return services.isNull(record?.record || record)
    }

    /**
     * Checks if two records are the same type and id
     * @param {Object} record1 - The first record
     * @param {Object} record2 - The second record
     * @returns {Boolean} - True if the records are the same, false otherwise
     */
    static isSame(record1, record2){
        return services.isSame(record1, record2)
    }

    /**
     * Sorts a list of records
     * @param {Array} records - The list of records to sort
     * @param {Boolean} reverse - If true, sorts in reverse order
     * @returns {Array} - The sorted list of records
     */
    static sort(records, reverse = false){
        return services.sort(records, reverse)
    }

    /**
     * Flattens a record
     * @param {Object} record - The record to flatten
     * @returns {Array} - The flattened record
     * 
     */
    static flatten(record){
        return services.flatten(record?.record || record)
    }

    /**
     * Unflattens a record
     * @param {Object} record - The record to unflatten
     * @param {Array} records - The list of records to use for unflattening
     * @returns {Object} - The unflattened record
     */
    static unFlatten(record, records){
        return services.unFlatten(record, records)
    }

    /**
     * Gets the nested records of a record
     * @param {Object} record - The record to get the nested records of
     * @returns {Array} - The nested records
     */
    static get children(){
        return services.children
    }

    /**
     * Tests if a record meets the filter parameters
     * @param {Object} record - The record to test
     * @param {Object} filterParams - The filter parameters
     * @param {Object} negativeFilterParams - The negative filter parameters
     * @returns {Boolean} - True if the record meets the filter parameters, false otherwise
     */
    static test(record, filterParams, negativeFilterParams){
        return services.test(record, filterParams, negativeFilterParams)
    }

    /**
     * Checks if two objects are equal (all values)
     * @param {Object} object1 - The first object
     * @param {Object} object2 - The second object
     * @returns {Boolean} - True if the objects are equal, false otherwise
     */
    static eq(object1, object2){
        return services.eq(object1, object2)
    }

    /**
     * Checks if the first object is less than the second object
     * @param {Object} object1 - The first object
     * @param {Object} object2 - The second object
     * @returns {Boolean} - True if the first object is less than the second object, false otherwise
     */
    static lt(object1, object2){
        return services.lt(object1, object2)
    }

    /**
     * Checks if the first object is less than or equal to the second object
     * @param {Object} object1 - The first object
     * @param {Object} object2 - The second object
     * @returns {Boolean} - True if the first object is less than or equal to the second object, false otherwise
     */
    static le(object1, object2){
        return services.le(object1, object2)
    }

    /**
     * Checks if the first object is greater than the second object
     * @param {Object} object1 - The first object
     * @param {Object} object2 - The second object
     * @returns {Boolean} - True if the first object is greater than the second object, false otherwise
     */
    static gt(object1, object2){
        return services.gt(object1, object2)
    }

    /**
     * Checks if the first object is greater than or equal to the second object
     * @param {Object} object1 - The first object
     * @param {Object} object2 - The second object
     * @returns {Boolean} - True if the first object is greater than or equal to the second object, false otherwise
     */
    static ge(object1, object2){
        return services.ge(object1, object2)
    }

    /**
     * Returns values in Obj1 not present in Obj2
     * @param {Object} object1 - The first object
     * @param {Object} object2 - The second object
     * @returns {Object} - The difference between the two objects
     */
    static diff(object1, object2){
        return services.diff(object1, object2)
    }

    /**
     * Merges two objects
     * @param {Object} object1 - The first object
     * @param {Object} object2 - The second object
     * @returns {Object} - The merged object
     */
    static merge(object1, object2){
        return services.merge(object1, object2)
    }

  
}


