package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const prefixResident = "PS"
const prefixBank = "PB"
const prefixUtilityCompany = "PU"
const prefixCoin = "CN_"
const prefixAccount = "CA_"
const prefixEnergy = "EN_"
const prefixQuote = "QUT"
const prefixUserHistory = "HYE"
const prefixUtilHistory = "UTILHISTORY"
const prefixUserBankHistory = "USRBNKHSTRY"
const projectName = "Jeadigital-Energy-Transaction-app"
const version = "v1"

var logger = shim.NewLogger("Jeadigital-Energy-Transaction-app:")

type SmartContract struct {
}

func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("*** " + projectName + " *** " + version + " Init ***")
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("*** " + projectName + " *** " + version + " Invoke ***")
	function, args := stub.GetFunctionAndParameters()
	logger.Info("Function: " + function)
	switch function {
	case "registerResidents":
		return s.registerResidents(stub, args)
	case "authUser":
		return s.authUser(stub, args)
	case "getUserEnergyHistory":
		return s.getUserEnergyHistory(stub, args)
	case "updateEnergyValue":
		return s.updateEnergyValue(stub, args)
	case "getUserStatus":
		return s.getUserStatus(stub, args)
	case "registerBank":
		return s.registerBank(stub, args)
	case "registerUtilityCompany":
		return s.registerUtilityCompany(stub, args)
	case "getAllUserStatus":
		return s.getAllUserStatus(stub)
	case "userToBankTransaction":
		return s.userToBankTransaction(stub, args)
	case "getUtilityCompanyStatus":
		return s.getUtilityCompanyStatus(stub, args)
	case "getUtilityCompanyEnergyHistory":
		return s.getUtilityCompanyEnergyHistory(stub, args)
	case "getUserBankHistory":
		return s.getUserBankHistory(stub, args)
	case "getUCBankHistory":
		return s.getUCBankHistory(stub, args)
	case "listAllCustomers":
		return s.listAllCustomers(stub)
	case "sellEnergyResidentToUtilityCompany":
		return s.sellEnergyResidentToUtilityCompany(stub, args)
	case "buyEnergyResidentToUtilityCompany":
		return s.buyEnergyResidentToUtilityCompany(stub, args)
	case "submitQuote":
		return s.submitQuote(stub, args)
	case "getQuote":
		return s.getQuote(stub, args)
	case "incrementEnergyValue":
		return s.incrementEnergyValue(stub, args)
		

	/*case "residentToUtilityCompanyCoinTransaction":
		return s.residentToUtilityCompanyCoinTransaction(stub, args)


	case "getBankStatus":
		return s.getBankStatus(stub, args)
	case "getAllBankStatus":
		return s.getAllBankStatus(stub)

	case "getAllUtilityCompanyStatus":
		return s.getAllUtilityCompanyStatus(stub)



	/*case "queryUserStatus":
		return s.queryUserStatus(stub, args)
	case "queryAllUserStatus":
		return s.queryAllUserStatus(stub, args)*/
	/*
			case "listAllEnergy":
			return s.listAllEnergy(stub, args)
		case "listAllCoin":
			return s.listAllCoin(stub, args)
		case "listAllCash":
			return s.listAllCash(stub, args)

		case "getEnergyStatus":
			return s.getEnergyStatus(stub, args)
		case "getCoinStatus":
			return s.getCoinStatus(stub, args)
		case "getCashStatus":
			return s.getCashStatus(stub, args)
			case "utilityCompanyToBankTransaction":
		return s.utilityCompanyToBankTransaction(stub, args)


	*/
	default:
		jsonResp := "{\"status\":false,\"description\":\"Invalid Smart Contract function name.\"}"
		return shim.Error(jsonResp)
	}
}
func main() {
	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
