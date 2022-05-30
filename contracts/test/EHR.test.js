var EHR = artifacts.require("./EHR.sol");

//crypto libraries for signing and encryption
const EthCrypto = require('eth-crypto');
const ecies = require("eth-ecies");
const util = require('ethereumjs-util')


contract("EHR", function(accounts) {
  var EHRInstance;

    it("Store/Retrieve encrypted message1", async() => {
    const instance = await EHR.deployed() //get deployed contract instance

    // address and private key (in frontend you should get them from ganache)
    const alice = {
      address: '0x6aA0B88f676Ee559B47d43fd7310986A8ABd176e',
      privateKey: '684fe9b245c067edb978cde7a313b10527fa70b67346f8ea5ce2d0c5421dcd76',
    }

    // get public key from private key (no other way)
    let privateBuffer = new Buffer(alice.privateKey, 'hex');
    alice.publicKey = util.privateToPublic(privateBuffer).toString('hex')

    // patient JSON
    var patient = {
      name: "ahmed mokhtar",
      age: 88,
      weight: 67,
      height: 198,
      sex: "Male",
      medical_history: "Blood pressure: 90, pulse: 56, oxygen level: 86%;"
    }  

     // Normal Visit JSON
     var NormalVisit = {
      patient_name: "ahmed mokhtar",
      date: "10-10-2021",
      readings: "Blood pressure: 130, pulse: 80, oxygen level: 95%;",
      reason: "High blood pressure",
      diagnosis:"Gay",
      prescription:"1mg anti-gay pill once a day, further lab tests"
    }  

    // Normal Visit JSON
    var LabVisit = {
      patient_name: "ahmed mokhtar",
      date: "10-10-2021",
      readings: "xray turns you gay",
      results: "high amounts of radiation",
    }  
  
    //=========================ENCRYPT-PATIENT=========================
    // const enc_sig = encrypt_sign(patient, alice);
    // const hexEncrypted = enc_sig[0];
    // const encryptedHash = enc_sig[1];
    // const signature = enc_sig[2];

    //==================STORE-RETRIEVE-PATIENT=========================
    // await instance.addPatient(hexEncrypted, encryptedHash, signature);
    // const retrieved = await instance.getPatient(alice.address, 0);

    //==================RECOVER-PATIENT=========================
    // const recovered_data = recover_data(retrieved, alice);

    //===================PATIENTS-LENGTH========================
    // var p = await instance.NPatients(alice.address);
    // p = p.toNumber()

   //=========================ENCRYPT-NORMAL-VISIT=========================
    // const enc_sig = encrypt_sign(NormalVisit, alice);
    // const hexEncrypted = enc_sig[0];
    // const encryptedHash = enc_sig[1];
    // const signature = enc_sig[2];

    //==================STORE-RETRIEVE-NORMAL-VISIT=========================
    // await instance.addVisit(hexEncrypted, 0, encryptedHash, signature);
    // const retrieved = await instance.getVisit(alice.address, 0, 0);

    //==================RECOVER-NORMAL-VISIT=========================
    // const recovered_data = recover_data(retrieved, alice);

    //===================VISITS-LENGTH========================
    // var v1 = await instance.NVisits(alice.address, 0);
    // v1 = v1.toNumber()


    //=========================ENCRYPT-LAB-TEST=========================
    // const enc_sig = encrypt_sign(LabVisit, alice);
    // const hexEncrypted = enc_sig[0];
    // const encryptedHash = enc_sig[1];
    // const signature = enc_sig[2];
   
    //==================STORE-RETRIEVE-LAB-VISIT=========================
    // await instance.addVisit(hexEncrypted, 0, encryptedHash, signature);
    // const retrieved = await instance.getVisit(alice.address, 0, 1);
   
    //==================RECOVER-NORMAL-VISIT=========================
    // const recovered_data = recover_data(retrieved, alice);
   
    //===================VISITS-LENGTH========================
    // var v2 = await instance.NVisits(alice.address, 0);
    // v2 = v2.toNumber()

    // console.log(recovered_data);
    // console.log(p);
    // console.log(v1);
    // console.log(v2);

  });
});

/**
 * 
 * @param {data} message to be encrypted in JSON format 
 * @param {account} JSON Account containing private and public keys
 * @returns encrypted data in hexadecimal, hash of encryoted data, digital signature
 */
function encrypt_sign(data, account){
  data = JSON.stringify(data)

  const encrypted = encrypt(account.publicKey, data);
  const encryptedHash = EthCrypto.hash.keccak256(encrypted);
  const signature = EthCrypto.sign(account.privateKey, encryptedHash);
  const hexEncrypted = "0x" + new Buffer(JSON.stringify(encrypted)).toString('hex');

  return [hexEncrypted, encryptedHash, signature];
}

/**
 * 
 * @param {cipher} ciphertext to be decrypted in hexadecimal
 * @param {account} JSON Account containing private key
 * @returns JSON object of decrypted ciphertext
 */
function recover_data(cipher, account){
  const encrypted = new Buffer(cipher.substring(2), 'hex').toString();
  var recovered_data = decrypt(account.privateKey, encrypted)
  recovered_data = JSON.parse(recovered_data);

  return recovered_data;
}

/**
 * 
 * @param {publicKey} a hexadecimal string
 * @param {data} string data
 * @returns ciphertext
 */
function encrypt(publicKey, data) {
  let userPublicKey = Buffer(publicKey, 'hex');
  let bufferData = Buffer(data);

  let encryptedData = ecies.encrypt(userPublicKey, bufferData);

  return encryptedData.toString('base64')
}

/**
 * 
 * @param {privateKey} a hexadecimal string
 * @param {encryptedData} base64 string encrypted data
 * @returns message string
 */
function decrypt(privateKey, encryptedData) {
  let userPrivateKey = new Buffer(privateKey, 'hex');
  let bufferEncryptedData = new Buffer(encryptedData, 'base64');

  let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);
  
  return decryptedData.toString('utf8');
}