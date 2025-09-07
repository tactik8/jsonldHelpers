
import { services} from './observationHelpers.services.js'

export class ObservationHelpers {
    constructor(record, metadata){

        this._observations = []
        this._record = {}
        this._metadata = metadata
        this.record = record
    }

    get record(){
        return this._record
    }

    set record(value){
        this._record = value
        this._observations = services.observations.get(this._record, this._metadata)
    }

    get observations(){
        return this._observations
    }

    set observations(observations){
        observations = Array.isArray(observations) ? observations : [observations]
        this._observations = observations
        this._record = services.observations.toRecord(this._observations)
    }
    
    // -----------------------------------------------------
    //  Comment 
    // -----------------------------------------------------

    static get(record, metadata){
        return services.observations.get(record, metadata)
    }

    static toRecord(observations){
        return services.observations.toRecord(observations)
    }

    static toObservations(record, metadata){
        return services.observations.get(record, metadata)
    }

    static sort(observations){
        return services.sort(observations)
    }

    static toString(observations){
        return services.toString(observations)
    }

    static toJSON(observations){
        return services.toJSON(observations)
    }

    static get analysis(){
        return services.analysis
    }
}