// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MedicalHistory{
    struct Patient{
        address client;
        string name;
        uint age;
        string[] conditions;
        string[] allergies;
        string[] medications;
        string[] procedures;
    }

    mapping(address=>Patient) public patients;

    function AddPatient(address _client,string memory _name, uint _age, string[] memory _conditions, string[] memory _allergies, string[] memory _medications, string[] memory _procedures) public{
        require(msg.sender==0xdD870fA1b7C4700F2BD7f44238821C26f7392148,"Invalid Authentication");

        Patient memory patient=Patient({
            client:_client,
            name:_name,
            age:_age,
            conditions:_conditions,
            allergies:_allergies,
            medications:_medications,
            procedures:_procedures
        });

        patients[_client]=patient;
    }

    function updatePatient(address _client,string memory _name, uint _age, string[] memory _conditions, string[] memory _allergies, string[] memory _medications, string[] memory _procedures) public{
        require(msg.sender==0xdD870fA1b7C4700F2BD7f44238821C26f7392148,"Invalid Authentication");

        Patient memory patient=Patient({
            client:_client,
            name:_name,
            age:_age,
            conditions:_conditions,
            allergies:_allergies,
            medications:_medications,
            procedures:_procedures
        });

        patients[_client]=patient;
    }

    function getPatient(address _patientAddress) public view returns (string memory,uint, string[] memory,string[] memory,string[] memory, string[] memory){
        require(msg.sender==0xdD870fA1b7C4700F2BD7f44238821C26f7392148,"Invalid Authentication");

        Patient memory patient=patients[_patientAddress];
        return (patient.name,patient.age,patient.conditions,patient.allergies,patient.medications,patient.procedures);
    }
}