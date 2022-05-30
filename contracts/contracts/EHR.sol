pragma solidity  >=0.5.16;

contract EHR{
    mapping(address => bytes[]) private patients; // patient storage
    mapping(address => mapping(uint => bytes[])) private visits; // visit storage

    /**
    Description: check the validity of the signature and store a patient in my clinic's storage
    Params:
        patient   -> encrypted patient (not signed)
        hashed    -> the hash of patient (keccak256)
        signatrue -> signature signed by the clinic
    Returns: Boolean indicating insertion success
    */
    function addPatient (bytes memory patient, bytes32 hashed, bytes memory signature) public returns(bool){ 
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = splitSignature(signature);
      
        address signer = ecrecover(hashed, v, r, s);

        if(msg.sender == signer){
            patients[msg.sender].push(patient);
            return true;
        }

        return false;
    }

    /**
    Description: getter method for patients
    Params:
        clinic -> address of the clinic
        indx   -> id of the wanted patient inside clinic
    Returns: encrypted patient as an array of hexadecimal bytes
    */
    function getPatient (address clinic, uint indx) public view returns(bytes memory){ 
        if(indx < patients[clinic].length){
            return patients[clinic][indx];
        }
        else{
            revert('Not found');
        }
    }

    /**
    Description: a getter for the number of patients in a clinic's storage
    Params:
        clinic -> address of the clinic
    Returns: A BN object that needs conversion to number
    */
    function NPatients(address clinic) public view returns(uint){
        return patients[clinic].length;
    }


    /**
    Description: check the validity of the signature and store a visit for a patient 
                 in a specific clinic
    Params:
        visit        -> encrypted visit (not signed)
        patient_indx -> id of the patient corresponding to the visit
        hashed       -> the hash of visit (keccak256)
        signatrue    -> signature signed by the clinic
    Returns: Boolean indicating insertion success
    */
    function addVisit (bytes memory visit, uint patient_indx, bytes32 hashed, bytes memory signature) public returns(bool){ 
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = splitSignature(signature);
      
        address signer = ecrecover(hashed, v, r, s);

        if(msg.sender == signer){
            visits[msg.sender][patient_indx].push(visit);
            return true;
        }

        return false;
    }

    /**
    Description: getter method for visits
    Params:
        clinic       -> address of the clinic
        patient_indx -> id of the wanted patient corresponding to the visit
        visit_indx   -> id of the visit
    Returns: encrypted patient as an array of hexadecimal bytes
    */
    function getVisit (address clinic, uint patient_indx, uint visit_indx) public view returns(bytes memory){ 
        if(visit_indx < visits[clinic][patient_indx].length){
            return visits[clinic][patient_indx][visit_indx];
        }
        else{
            revert('Not found');
        }
    }

    /**
    Description: a getter for the number of visits for a patient inside a clinic's storage
    Params:
        clinic       -> address of the clinic
        patient_indx -> id of the patient
    Returns: A BN object that needs conversion to number
    */
    function NVisits(address clinic, uint patient_indx) public view returns(uint){
        return visits[clinic][patient_indx].length;
    }
    //================================EVENTS======================================
    /* Events help you with updating the frontend whenever
     * changes happen here in the backend 
     */

    /**
    Description: Triggers when a patient is added.
    Returns: address of the clinic inserting the patient and the new patient id
    */
    event PatientAddedEvent (address clinic, uint index);


    /**
    Description: Triggers when a visit is added.
    Returns: address of the clinic inserting the visit, the patient id, and the visit id;
    */
    event VisitAddedEvent (address clinic, uint patient_index, uint visit_index);


    //================================HELPERS======================================

    /**
    Description: segments the signature to its constituents
    Params:
        sig -> the signature to be segmented
    Returns: values of v, r, s in order to verify the signature
    */
    function splitSignature(bytes memory sig) private pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65);
       
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
        return (v, r, s);
    }
}
