import { UtilHelpers as uh } from "../utilHelpers/utilHelpers.models.js";

export const services = {


    dataCatalog: {
        get: getDataCatalog,
    },
    datafeed: {
        get: getDatafeed,
    },
    datafeedItem: {
        get: getDatafeedItem,
    },
    test: {
        organization: getTestRecordOrganization,
        dataCatalog: getTestRecordDataCatalog,
        datafeed: getTestRecordDatafeed,
        datafeedItem: getTestRecordDatafeedItem
    }

    
};



/**
 * Returns a data catalog record
 */
function getDataCatalog(record_or_name, description, url, organization) {

    let name = record_or_name?.["name"] || record_or_name
    description = description || record_or_name?.["description"]
    url = url || record_or_name?.["url"]
    organization = organization || record_or_name?.["organization"]

    
    let dataCatalog = {
        "@context": "https://schema.org/",
        "@type": "DataCatalog",
        "@id": url + "#datacatalog",
        name: name,
        description: description,
        url: url,
        provider: organization,
        dataset: []
    };
    return dataCatalog;
}

function getDatafeed(record_or_name, url, description, dataCatalog, dateModified, dataFeedElement, variableMeasured, distribution) {


    let name = record_or_name?.["name"] || record_or_name
    url = url || record_or_name?.["url"]
    description = description || record_or_name?.["description"]
    dataCatalog = dataCatalog || record_or_name?.["dataCatalog"]
    dateModified = dateModified || record_or_name?.["dateModified"]
    dataFeedElement = dataFeedElement || record_or_name?.["dataFeedElement"]
    variableMeasured = variableMeasured || record_or_name?.["variableMeasured"]
    distribution = distribution || record_or_name?.["distribution"]
    
    
    let datafeed = {
        "@type": "Datafeed",
        "@id": url + "#datafeed",
        name: name,
        description: description,
        url: url,
        includedInDataCatalog: dataCatalog,
        dateModified: dateModified,
        variableMeasured: variableMeasured,
        dataFeedElement: dataFeedElement || [],
        distribution: distribution 
    };
    return datafeed;
}

/**
 * Returns a datafeedItem record
 * @param {*} item
 * @param {*} dateCreated
 * @param {*} dateModified
 * * @param {*} dateDeleted
 * @returns {Object} - A datafeed item
 */
function getDatafeedItem(record_or_name, datafeed, item, dateModified, dateCreated, dateDeleted) {

    let name = record_or_name?.["name"] || (typeof record_or_name == "string" ? record_or_name : "")
    datafeed = datafeed || record_or_name?.["datafeed"]
    item = item || record_or_name?.["item"]
    dateModified = dateModified || record_or_name?.["dateModified"]
    dateCreated = dateCreated || record_or_name?.["dateCreated"]
    dateDeleted = dateDeleted || record_or_name?.["dateDeleted"]
    

    let datafeedItem = {
        "@type": "DatafeedItem",
        "@id": "datafeedItem_" + uh.uuid.get(),
        name: name,
        dateCreated: dateCreated,
        dateDeleted: dateDeleted,
        dateModified: dateModified,
        "@reverse": {
            "dataFeedElement": {"@type": datafeed?.["@type"], "@id": datafeed?.["@id"]}
          },
        item: item

    };
    return datafeedItem;
}


/**
 * Returns a dataDownload record
 * @param {*} name
 * * @param {*} description
 * * @param {*} encodingFormat
 * * @param {*} contentUrl
 * * @returns {Object} - A dataDownload record
 */
function getDataDownload(record_or_name, description, encodingFormat, contentUrl){

    let name = record_or_name?.["name"] || record_or_name
    propertyID = propertyID || record_or_name?.["propertyID"]
    description = description || record_or_name?.["description"]
    encodingFormat = encodingFormat || record_or_name?.["encodingFormat"]
    contentUrl = contentUrl || record_or_name?.["contentUrl"]
    
    let dataDownload = {
        "@type": "DataDownload",
        "@id": contentUrl + "#datadownload",
        name: name,
        description: description,
        encodingFormat: encodingFormat,
        contentUrl: contentUrl
    };
    return dataDownload;
}


/**
 * Returns a propertyValue record
 * @description Returns a propertyValue record to be used as variable measured
 * @param {*} name
 * @param {*} propertyID
 * @param {*} description
 * * @param {*} url
 * 
 */
function getPropertyValue(record_or_name, propertyID, description, url){

    let name = record_or_name?.["name"] || record_or_name
    let record_id = record_or_name?.["@id"] || uh.uuid.get()
    propertyID = propertyID || record_or_name?.["propertyID"]
    description = description || record_or_name?.["description"]
    url = url || record_or_name?.["url"]
    
    
    let variableMeasured = {
        "@type": "PropertyValue",
        "@id": record_id,
        "name": name,
        "propertyID": propertyID,
        "description": description,
        "url": url
    };
    return variableMeasured;
}


// -----------------------------------------------------
//  Test records 
// -----------------------------------------------------


function getTestRecordOrganization(no=0){

    let url = `https://www.testorganization_${String(no)}.com/`
    let organization = {
        "@type": "Organization",
        "@id": `${url}#organization`,
        "name": `Test organization_${String(no)}` ,
        "url": url
    }
    return organization
}

function getTestRecordDataCatalog(no=0, nbDatasets=2){

    let organization = getTestRecordOrganization(no)

    let record = {
        name: "Test catalog_" + String(no),
        description: "Description value",
        url: organization.url,
        organization: organization
    }

    let dataCatalog = getDataCatalog(record)

    dataCatalog.dataset = []
    for(let i = 0; i < nbDatasets; i++){
       dataCatalog.dataset.push(getTestRecordDatafeed(i, 10, dataCatalog))
    }

    
    return dataCatalog
}

function getTestRecordDatafeed(no=0, nbItems=10, dataCatalog, date){

    let name = "Test datafeed_" + String(no)

    let organization = dataCatalog.provider || getTestRecordOrganization(no)
    dataCatalog = dataCatalog || getTestRecordDataCatalog(no)


    let record = {
        url: dataCatalog.url + "/datafeed_" + String(no),
        name: name,
        description: "Description value",
        dataCatalog: dataCatalog,
        organization: organization
    }

    let datafeed = getDatafeed(record)

    datafeed.dataFeedElement = []
    for(let i = 0; i < nbItems; i++){
        datafeed.dataFeedElement.push(getTestRecordDatafeedItem(i, datafeed, date))
    }
    
    
    return datafeed
    
}

function getTestRecordDatafeedItem(no, datafeed, date, url){


    let item = {
        "@type": "Thing",
        "@id": "item_" + String(no),
        "name": "thing_" + String(no),
        "description": "A generic data feed item value ",
        
    }

    let record = {
        datafeed:  datafeed || getTestRecordDatafeed(no),
        modifiedDate: date || new Date(),
        url: datafeed.url + "/datafeedItem_" + String(no),
        item: item
    }
    
    let datafeedItem = getDatafeedItem(record)

    return datafeedItem

}