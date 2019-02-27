package main

import (
	"encoding/json"

	"bytes"
	"math"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func (s *SmartContract) registerResidents(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}
	resident := Resident{}
	coin := Coin{}
	energy := Energy{}
	bankaccount := BankAccount{}
	resident.ResidentID = args[0]
	resident.FirstName = args[1]
	resident.LastName = args[2]
	resident.Password = args[6]
	x, err := strconv.ParseFloat(args[5], 64)
	if err != nil {
		return shim.Error("Coinbalance  must be a number")
	}
	coin.CoinBalance = math.Floor(x*100) / 100

	coin.CoinID = "CN_" + args[0]
	coin.UserID = args[0]

	x, err = strconv.ParseFloat(args[3], 64)
	if err != nil {
		return shim.Error("Energyvalue  must be a number")
	}
	energy.EnergyValue = math.Floor(x*100) / 100
	energy.Units = "kwh"
	energy.EnergyID = " EN_" + args[0]
	energy.UserID = args[0]

	x, err = strconv.ParseFloat(args[4], 64)
	if err != nil {
		return shim.Error("cash value must be float")
	}
	bankaccount.CashValue = math.Floor(x*100) / 100
	bankaccount.Currency = "USD"
	bankaccount.UserID = args[0]
	bankaccount.AccountID =  args[0]

	resident.COIN = coin
	resident.ENERGY = energy
	resident.BANKACCOUNT = bankaccount

	key, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	userAsBytes, _ := stub.GetState(key)
	if userAsBytes != nil {
		return shim.Error("User already exist !")
	}
	userAsBytes, err = json.Marshal(resident)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, userAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	key1, err := stub.CreateCompositeKey(prefixCoin, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	coinAsBytes, _ := stub.GetState(key1)
	if coinAsBytes != nil {
		return shim.Error("coin already exist !")
	}
	coinAsBytes, err = json.Marshal(coin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key1, coinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	key2, err := stub.CreateCompositeKey(prefixEnergy, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	energyAsBytes, _ := stub.GetState(key2)
	if energyAsBytes != nil {
		return shim.Error("energy already exist !")
	}
	energyAsBytes, err = json.Marshal(energy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key2, energyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	key3, err := stub.CreateCompositeKey(prefixAccount, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	accountAsBytes, _ := stub.GetState(key3)
	if accountAsBytes != nil {
		return shim.Error("account already exist !")
	}
	accountAsBytes, err = json.Marshal(bankaccount)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key3, accountAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("{\"User\":\"" + args[1] + "\",\"status\":true,\"description\":\"Resident is successfully Registered\"}"))
}
func (s *SmartContract) authUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Auth user ***")
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	logger.Info(args[0])

	if args[2] == "Resident" {
		key, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
		if err != nil {
			return shim.Error(err.Error())
		}
		userAsBytes, _ := stub.GetState(key)
		if userAsBytes == nil {
			return shim.Error("Invalid Resident")
		}
		resident := Resident{}
		err = json.Unmarshal(userAsBytes, &resident)
		if resident.Password == args[1] {
			jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":true,\"role\":\"\",\"message\":\"Login successful\"}"
			return shim.Success([]byte(jsonResp))
		}
		jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":false,\"category\":\"\",\"message\":\"Invalid username or password\"}"
		return shim.Success([]byte(jsonResp))
	}
	if args[2] == "Bank" {

		key1, err := stub.CreateCompositeKey(prefixBank, []string{args[0]})
		if err != nil {
			return shim.Error(err.Error())
		}
		bankAsBytes, _ := stub.GetState(key1)
		if bankAsBytes == nil {
			return shim.Error("Invalid user id")
		}

		bank := Bank{}
		err = json.Unmarshal(bankAsBytes, &bank)
		if bank.Password == args[1] {
			jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":true,\"role\":\"\",\"message\":\"Login successful\"}"
			return shim.Success([]byte(jsonResp))
		}
		jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":false,\"category\":\"\",\"message\":\"Invalid username or password\"}"
		return shim.Success([]byte(jsonResp))
	}
	if args[2] == "UtilityCompany" {

		key2, err := stub.CreateCompositeKey(prefixUtilityCompany, []string{args[0]})
		if err != nil {
			return shim.Error(err.Error())
		}
		companyAsBytes, _ := stub.GetState(key2)
		if companyAsBytes == nil {
			return shim.Error("Invalid user id")
		}
		utilityCompany := UtilityCompany{}
		err = json.Unmarshal(companyAsBytes, &utilityCompany)
		if utilityCompany.Password == args[1] {
			jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":true,\"role\":\"\",\"message\":\"Login successful\"}"
			return shim.Success([]byte(jsonResp))
		}
		jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":false,\"category\":\"\",\"message\":\"Invalid username or password\"}"
		return shim.Success([]byte(jsonResp))
	}
	return shim.Error("Invalid user role")
}
func (s *SmartContract) getUserEnergyHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Get History of Energy***")
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	logger.Info("Getting history of resident:" + args[0])
	key, _ := stub.CreateCompositeKey(prefixUserHistory, []string{args[0]})
	resultsIterator, err := stub.GetHistoryForKey(key)
	if err != nil {
		return shim.Error("{\"status\":false,\"description\":\"" + err.Error() + "\"}")
	}
	defer resultsIterator.Close()
	// buffer is a JSON array containing historic values for the invoice
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error("{\"status\":false,\"description\":\"" + err.Error() + "\"}")
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"value\":")
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"isDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	logger.Info("History: \n" + buffer.String())
	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) updateEnergyValue(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	logger.Info(args)

	x, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		return shim.Error("energy value  must be a number")
	}
	energyval := math.Floor(x*100) / 100

	residentEnergyHistory := ResidentEnergyHistory{}
	utilEnergyHistory := UtilEnergyHistory{}
	utilEnergyHistory.User = args[0]
	key, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentAsBytes, err := stub.GetState(key)
	if residentAsBytes == nil {
		return shim.Error("Invalid Resident")
	}
	resident := Resident{}
	err = json.Unmarshal(residentAsBytes, &resident)
	//**********************************************************************************
	key1, err := stub.CreateCompositeKey(prefixEnergy, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentEnergyAsBytes, err := stub.GetState(key1)
	if residentEnergyAsBytes == nil {
		return shim.Error("Invalid energy")
	}
	residentEnergy := Energy{}
	err = json.Unmarshal(residentEnergyAsBytes, &residentEnergy)
	//**************************************************************************************
	key2, err := stub.CreateCompositeKey(prefixCoin, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentCoinAsBytes, err := stub.GetState(key2)
	if residentCoinAsBytes == nil {
		return shim.Error("Invalid resident coin")
	}
	residentCoin := Coin{}
	err = json.Unmarshal(residentCoinAsBytes, &residentCoin)

	//*************************************************************************************
	key3, err := stub.CreateCompositeKey(prefixUtilityCompany, []string{args[2]})
	if err != nil {
		return shim.Error(err.Error())
	}
	companyAsBytes, err := stub.GetState(key3)
	if companyAsBytes == nil {
		return shim.Error("Invalid company")
	}
	company := UtilityCompany{}
	err = json.Unmarshal(companyAsBytes, &company)
	//**************************************************************************************
	key4, err := stub.CreateCompositeKey(prefixEnergy, []string{args[2]})
	if err != nil {
		return shim.Error(err.Error())
	}
	companyEnergyAsBytes, err := stub.GetState(key4)
	if companyEnergyAsBytes == nil {
		return shim.Error("Invalid company energy")
	}
	companyEnergy := Energy{}
	err = json.Unmarshal(companyEnergyAsBytes, &companyEnergy)
	//**********************************************************************************
	key5, err := stub.CreateCompositeKey(prefixCoin, []string{args[2]})
	if err != nil {
		return shim.Error(err.Error())
	}
	companyCoinAsBytes, err := stub.GetState(key5)
	if companyCoinAsBytes == nil {
		return shim.Error("Invalid company coin")
	}
	companyCoin := Coin{}
	err = json.Unmarshal(companyCoinAsBytes, &companyCoin)
	//************************************************************************************

	residentEnergy.EnergyValue = residentEnergy.EnergyValue - energyval
	companyEnergy.EnergyValue = companyEnergy.EnergyValue + energyval

	//*****************************************************************************

	EnergyRate := 1.0

	//sell energy
	if energyval > 0 {

		coinChange := energyval * EnergyRate

		coinChange = math.Floor(coinChange*100) / 100

		logger.Info(coinChange)
		logger.Info(companyCoin.CoinBalance)
		logger.Info(residentEnergy.EnergyValue)
		logger.Info(energyval)
		if companyCoin.CoinBalance < coinChange {
			return shim.Error("Unable to sell energy either due to insufficient coin balance or insufficient energy")
		}

		residentCoin.CoinBalance = residentCoin.CoinBalance + coinChange

		companyCoin.CoinBalance = companyCoin.CoinBalance - coinChange

		resident.COIN = residentCoin
		resident.ENERGY = residentEnergy
		company.COIN = companyCoin
		company.ENERGY = companyEnergy

		residentEnergyHistory.Energy = energyval
		utilEnergyHistory.Energy = energyval

		residentEnergyHistory.Type = "SELL"
		residentEnergyHistory.CoinCredit = coinChange

		utilEnergyHistory.Type = "BUY"
		utilEnergyHistory.CoinDebit = coinChange

	}
	if energyval < 0 {
		coinChange := energyval * EnergyRate * -1
		coinChange = math.Floor(coinChange*100) / 100

		if residentCoin.CoinBalance < coinChange {
			return shim.Error("Unable to buy energy either due to insufficient energy or due to insufficient")
		}

		residentCoin.CoinBalance = residentCoin.CoinBalance - coinChange

		companyCoin.CoinBalance = companyCoin.CoinBalance + coinChange

		resident.COIN = residentCoin
		resident.ENERGY = residentEnergy
		company.COIN = companyCoin
		company.ENERGY = companyEnergy

		residentEnergyHistory.Energy = energyval * -1
		utilEnergyHistory.Energy = energyval * -1

		residentEnergyHistory.Type = "BUY"
		residentEnergyHistory.CoinDebit = coinChange

		utilEnergyHistory.Type = "SELL"
		utilEnergyHistory.CoinCredit = coinChange

	}

	residentAsBytes, err = json.Marshal(resident)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, residentAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//****************************************************************************
	residentEnergyAsBytes, err = json.Marshal(residentEnergy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key1, residentEnergyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//**********************************************************************
	residentCoinAsBytes, err = json.Marshal(residentCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key2, residentCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//*********************************************************************
	companyAsBytes, err = json.Marshal(company)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key3, companyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//******************************************************************
	companyEnergyAsBytes, err = json.Marshal(companyEnergy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key4, companyEnergyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//************************************************************
	companyCoinAsBytes, err = json.Marshal(companyCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key5, companyCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//****************************************************************
	residentHistorykey, err := stub.CreateCompositeKey(prefixUserHistory, []string{args[0]})
	utilityCompanyHistorykey, err := stub.CreateCompositeKey(prefixUtilHistory, []string{})
	residentEnergyHistoryAsbytes, err := json.Marshal(residentEnergyHistory)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(residentHistorykey, residentEnergyHistoryAsbytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	utilityCompanyEnergyHistoryAsbytes, err := json.Marshal(utilEnergyHistory)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(utilityCompanyHistorykey, utilityCompanyEnergyHistoryAsbytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("Successfully updated energy value"))

}
func (s *SmartContract) getUserStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	key, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	userAsBytes, err := stub.GetState(key)
	if userAsBytes == nil {
		return shim.Error("Invalid user")
	}
	resident := Resident{}
	err = json.Unmarshal(userAsBytes, &resident)
	resident.Password = "****"
	userAsBytes, err = json.Marshal(resident)
	return shim.Success(userAsBytes)
}

func (s *SmartContract) registerBank(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	var err error
	bank := Bank{}

	bank.BankID = args[0]
	bank.BankName = args[1]
	bank.Password = args[2]

	key, err := stub.CreateCompositeKey(prefixBank, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	bankAsBytes, _ := stub.GetState(key)
	if bankAsBytes != nil {
		return shim.Error("User already exist !")
	}
	bankAsBytes, err = json.Marshal(bank)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, bankAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("{\"User\":\"" + args[1] + "\",\"status\":true,\"description\":\"Bank is successfully Registered\"}"))

}

func (s *SmartContract) registerUtilityCompany(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	var err error
	utilitycompany := UtilityCompany{}
	coin := Coin{}
	energy := Energy{}
	bankaccount := BankAccount{}

	utilitycompany.CompanyID = args[0]
	utilitycompany.CompanyName = args[1]
	utilitycompany.Password = args[4]
	bankaccount.AccountID =  args[0]

	x, err := strconv.ParseFloat(args[5], 64)
	if err != nil {
		return shim.Error("Cash value  must be a number")
	}
	bankaccount.CashValue = math.Floor(x*100) / 100

	bankaccount.Currency = "USD"
	bankaccount.UserID = args[0]

	x, err = strconv.ParseFloat(args[3], 64)
	if err != nil {
		return shim.Error("Coin balance  must be a number")
	}
	coin.CoinBalance = math.Floor(x*100) / 100

	coin.UserID = args[0]
	coin.CoinID = "CN_" + args[0]

	x, err = strconv.ParseFloat(args[2], 64)
	if err != nil {
		return shim.Error("Energy value  must be a number")
	}
	energy.EnergyValue = math.Floor(x*100) / 100

	energy.Units = "kwh"
	energy.UserID = args[0]
	energy.EnergyID = "EN_" + args[0]
	utilitycompany.COIN = coin
	utilitycompany.ENERGY = energy
	utilitycompany.BANKACCOUNT = bankaccount

	key, err := stub.CreateCompositeKey(prefixUtilityCompany, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	companyAsBytes, _ := stub.GetState(key)
	if companyAsBytes != nil {
		return shim.Error("User already exist !")
	}
	companyAsBytes, err = json.Marshal(utilitycompany)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, companyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	key1, err := stub.CreateCompositeKey(prefixCoin, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	coinAsBytes, _ := stub.GetState(key1)
	if coinAsBytes != nil {
		return shim.Error("invalid coin !")
	}
	coinAsBytes, err = json.Marshal(coin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key1, coinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	key2, err := stub.CreateCompositeKey(prefixEnergy, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	energyAsBytes, _ := stub.GetState(key2)
	if energyAsBytes != nil {
		return shim.Error("energy already exist !")
	}
	energyAsBytes, err = json.Marshal(energy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key2, energyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	key3, err := stub.CreateCompositeKey(prefixAccount, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	accountAsBytes, _ := stub.GetState(key3)
	if accountAsBytes != nil {
		return shim.Error("account already exist !")
	}
	accountAsBytes, err = json.Marshal(bankaccount)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key3, accountAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("{\"User\":\"" + args[1] + "\",\"status\":true,\"description\":\"UtilityCompany is successfully Registered\"}"))
}
func (s *SmartContract) getAllUserStatus(stub shim.ChaincodeStubInterface) pb.Response {
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixResident, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		resident := Resident{}
		err = json.Unmarshal(kvResult.Value, &resident)
		if err != nil {
			return shim.Error(err.Error())
		}
		resident.Password = "****"
		results = append(results, resident)

	}

	residentAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(residentAsBytes)

}
func (s *SmartContract) userToBankTransaction(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	userBankHistory := UserBankHistory{}
	
	Residentkey, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentAsBytes, err := stub.GetState(Residentkey)
	if residentAsBytes == nil {
		return shim.Error("Invalid Resident")
	}
	resident := Resident{}
	err = json.Unmarshal(residentAsBytes, &resident)
	////////////////////////////////////////////////////////
	Companykey, err := stub.CreateCompositeKey(prefixUtilityCompany, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	companyAsBytes, err := stub.GetState(Companykey)
	if companyAsBytes == nil {
		return shim.Error("Invalid company")
	}
	company := UtilityCompany{}
	err = json.Unmarshal(companyAsBytes, &company)
	///////////////////////////////////////////////////////////////
	CompanyAccountkey, err := stub.CreateCompositeKey(prefixAccount, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	companyAccountAsBytes, err := stub.GetState(CompanyAccountkey)
	if companyAccountAsBytes == nil {
		return shim.Error("Invalid company account")
	}
	companyAccount := BankAccount{}
	err = json.Unmarshal(companyAccountAsBytes, &companyAccount)
	///////////////////////////////////////////////////////////////////
	residentAccountKey, err := stub.CreateCompositeKey(prefixAccount, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentAccountAsBytes, err := stub.GetState(residentAccountKey)
	if residentAccountAsBytes == nil {
		return shim.Error("Invalid resident account")
	}
	residentAccount := BankAccount{}
	err = json.Unmarshal(residentAccountAsBytes, &residentAccount)
	/////////////////////////////////////////////////////////////////////////////////
	residentCoinKey, err := stub.CreateCompositeKey(prefixCoin, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentCoinAsBytes, err := stub.GetState(residentCoinKey)
	if residentCoinAsBytes == nil {
		return shim.Error("Invalid resident coin")
	}
	residentCoin := Coin{}
	err = json.Unmarshal(residentCoinAsBytes, &residentCoin)

	////////////////////////////////////////////////////////////////////////////////
	companyCoinKey, err := stub.CreateCompositeKey(prefixCoin, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	companyCoinAsBytes, err := stub.GetState(companyCoinKey)
	if companyCoinAsBytes == nil {
		return shim.Error("Invalid company coin")
	}
	companyCoin := Coin{}
	err = json.Unmarshal(companyCoinAsBytes, &companyCoin)
	////////////////////////////////////////////////////////////////////////////
	transactionRate := 1.0
	userBankHistoryKey:= ""
	utilityCompanyBankHistoryKey:=""
	if args[2] == "Get Coin" {
		cashValue, _ := strconv.ParseFloat(args[3], 64)
		coinChange := transactionRate * cashValue

		residentCoin.CoinBalance = residentCoin.CoinBalance + coinChange
		residentAccount.CashValue = residentAccount.CashValue - cashValue

		companyCoin.CoinBalance = companyCoin.CoinBalance - coinChange
		companyAccount.CashValue = companyAccount.CashValue + cashValue

		resident.COIN = residentCoin
		resident.BANKACCOUNT = residentAccount
		company.COIN = companyCoin
		company.BANKACCOUNT = companyAccount

		userBankHistory.From = args[0]
		userBankHistory.To = args[1]
		userBankHistory.Amount = cashValue
		
		userBankHistory.Type = "Debit"
		userBankHistoryKey, _ = stub.CreateCompositeKey(prefixUserBankHistory, []string{args[0]})
		utilityCompanyBankHistoryKey, _ = stub.CreateCompositeKey(prefixUserBankHistory, []string{args[1]})

	} else if args[2] == "Get Cash" {
		coinValue, _ := strconv.ParseFloat(args[3], 64)
		cashChange := transactionRate * coinValue

		residentCoin.CoinBalance = residentCoin.CoinBalance - coinValue
		residentAccount.CashValue = residentAccount.CashValue + cashChange

		companyCoin.CoinBalance = companyCoin.CoinBalance + coinValue
		companyAccount.CashValue = companyAccount.CashValue - cashChange

		resident.COIN = residentCoin
		resident.BANKACCOUNT = residentAccount
		company.COIN = companyCoin
		company.BANKACCOUNT = companyAccount

		userBankHistory.From = args[1]
		userBankHistory.To = args[0]
		userBankHistory.Amount = cashChange
		
		userBankHistory.Type = "Credit"
		userBankHistoryKey, _= stub.CreateCompositeKey(prefixUserBankHistory, []string{args[1]})
		utilityCompanyBankHistoryKey, _ = stub.CreateCompositeKey(prefixUserBankHistory, []string{args[0]})

	}
	///////////////////////////////////////////////////////////////////////////
	residentAsBytes, err = json.Marshal(resident)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(Residentkey, residentAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	///////////////////////////////////////////////////////////////
	companyAsBytes, err = json.Marshal(company)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(Companykey, companyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	///////////////////////////////////////////////////
	companyAccountAsBytes, err = json.Marshal(companyAccount)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(CompanyAccountkey, companyAccountAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	///////////////////////////////////////////////////////
	residentAccountAsBytes, err = json.Marshal(residentAccount)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(residentAccountKey, residentAccountAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	////////////////////////////////////////////////////////////
	residentCoinAsBytes, err = json.Marshal(residentCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(residentCoinKey, residentCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	/////////////////////////////////////////////////////////////
	companyCoinAsBytes, err = json.Marshal(companyCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(companyCoinKey, companyCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	///////////////////////////////////////////////////////

	userBankHistoryAsBytes, err := json.Marshal(userBankHistory)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(userBankHistoryKey, userBankHistoryAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	utilitycompanyBankHistoryAsBytes, err := json.Marshal(userBankHistory)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(utilityCompanyBankHistoryKey, utilitycompanyBankHistoryAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	/////////////////////////////////////////////////////

	return shim.Success([]byte("Successfull Transaction"))

}
func (s *SmartContract) getUtilityCompanyStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	key, err := stub.CreateCompositeKey(prefixUtilityCompany, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyAsBytes, err := stub.GetState(key)
	if utilitycompanyAsBytes == nil {
		return shim.Error("Invalid user")
	}
	utilitycompany := UtilityCompany{}
	err = json.Unmarshal(utilitycompanyAsBytes, &utilitycompany)
	utilitycompany.Password = "****"
	utilitycompanyAsBytes, err = json.Marshal(utilitycompany)
	return shim.Success(utilitycompanyAsBytes)
}
func (s *SmartContract) getUtilityCompanyEnergyHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Get History Energy from all residents ***")
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	key, _ := stub.CreateCompositeKey(prefixUtilHistory, []string{})
	resultsIterator, err := stub.GetHistoryForKey(key)
	if err != nil {
		return shim.Error("{\"status\":false,\"description\":\"" + err.Error() + "\"}")
	}
	defer resultsIterator.Close()
	// buffer is a JSON array containing historic values for the invoice
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error("{\"status\":false,\"description\":\"" + err.Error() + "\"}")
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"value\":")
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"isDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	logger.Info("History: \n" + buffer.String())
	return shim.Success(buffer.Bytes())
}
func (s *SmartContract) getUserBankHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Get History of Energy***")
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	logger.Info("Getting history of resident:" + args[0])
	key, _ := stub.CreateCompositeKey(prefixUserBankHistory, []string{args[0]})
	resultsIterator, err := stub.GetHistoryForKey(key)
	if err != nil {
		return shim.Error("{\"status\":false,\"description\":\"" + err.Error() + "\"}")
	}
	defer resultsIterator.Close()
	// buffer is a JSON array containing historic values for the invoice
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error("{\"status\":false,\"description\":\"" + err.Error() + "\"}")
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"value\":")
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"isDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	logger.Info("History: \n" + buffer.String())
	return shim.Success(buffer.Bytes())
}
func (s *SmartContract) getUCBankHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Get History of Energy***")
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	logger.Info("Getting history of resident:" + args[0])
	key, _ := stub.CreateCompositeKey(prefixUserBankHistory, []string{args[0]})
	resultsIterator, err := stub.GetHistoryForKey(key)
	if err != nil {
		return shim.Error("{\"status\":false,\"description\":\"" + err.Error() + "\"}")
	}
	defer resultsIterator.Close()
	// buffer is a JSON array containing historic values for the invoice
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error("{\"status\":false,\"description\":\"" + err.Error() + "\"}")
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"value\":")
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"isDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	logger.Info("History: \n" + buffer.String())
	return shim.Success(buffer.Bytes())
}
func (s *SmartContract) listAllCustomers(stub shim.ChaincodeStubInterface) pb.Response {

	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixAccount, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		bankaccount := BankAccount{}
		err = json.Unmarshal(kvResult.Value, &bankaccount)
		if err != nil {
			return shim.Error(err.Error())
		}

		results = append(results, bankaccount)

	}

	accountAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(accountAsBytes)
}
func (s *SmartContract) sellEnergyResidentToUtilityCompany(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	key, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentAsBytes, err := stub.GetState(key)
	if residentAsBytes == nil {
		return shim.Error("Invalid user")
	}
	resident := Resident{}
	err = json.Unmarshal(residentAsBytes, &resident)

	//*****************************************************************************

	key1, err := stub.CreateCompositeKey(prefixUtilityCompany, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyAsBytes, err := stub.GetState(key1)
	if utilitycompanyAsBytes == nil {
		return shim.Error("Invalid user")
	}
	utilitycompany := UtilityCompany{}
	err = json.Unmarshal(utilitycompanyAsBytes, &utilitycompany)

	//******************************************************************************
	key2, err := stub.CreateCompositeKey(prefixEnergy, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentEnergyAsBytes, err := stub.GetState(key2)
	if residentEnergyAsBytes == nil {
		return shim.Error("Invalid energy")
	}
	residentEnergy := Energy{}
	err = json.Unmarshal(residentEnergyAsBytes, &residentEnergy)
	//*******************************************************************
	key3, err := stub.CreateCompositeKey(prefixEnergy, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyEnergyAsBytes, err := stub.GetState(key3)
	if utilitycompanyEnergyAsBytes == nil {
		return shim.Error("Invalid energy")
	}
	utilitycompanyEnergy := Energy{}
	err = json.Unmarshal(utilitycompanyEnergyAsBytes, &utilitycompanyEnergy)
	//******************************************************************
	key4, err := stub.CreateCompositeKey(prefixCoin, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentCoinAsBytes, err := stub.GetState(key4)
	if residentCoinAsBytes == nil {
		return shim.Error("Invalid coin")
	}
	residentCoin := Coin{}
	err = json.Unmarshal(residentCoinAsBytes, &residentCoin)
	//***************************************************************
	key5, err := stub.CreateCompositeKey(prefixCoin, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyCoinAsBytes, err := stub.GetState(key5)
	if utilitycompanyCoinAsBytes == nil {
		return shim.Error("Invalid coin")
	}
	utilitycompanyCoin := Coin{}
	err = json.Unmarshal(utilitycompanyCoinAsBytes, &utilitycompanyCoin)
	//************************************************************************

	EnergyExchanged, err := strconv.ParseFloat(args[2], 64)
	if err != nil {
		return shim.Error("Energy exchanged  must be a number")
	}
	EnergyRate, err := strconv.ParseFloat(args[3], 64)
	if err != nil {
		return shim.Error("Energy rate  must be a number")
	}
	coinChange := EnergyExchanged * EnergyRate * 0.9
	if utilitycompanyCoin.CoinBalance <= 0 || residentEnergy.EnergyValue < EnergyExchanged {
		return shim.Error("Unable to sell energy either due to insufficient coin balance or insufficient energy")
	}
	residentEnergy.EnergyValue = residentEnergy.EnergyValue - EnergyExchanged
	residentCoin.CoinBalance = residentCoin.CoinBalance + coinChange

	utilitycompanyEnergy.EnergyValue = utilitycompanyEnergy.EnergyValue + EnergyExchanged
	utilitycompanyCoin.CoinBalance = utilitycompanyCoin.CoinBalance - coinChange

	resident.COIN = residentCoin
	resident.ENERGY = residentEnergy
	utilitycompany.COIN = utilitycompanyCoin
	utilitycompany.ENERGY = utilitycompanyEnergy

	//***************************************************************************************
	residentEnergyAsBytes, err = json.Marshal(residentEnergy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key2, residentEnergyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//******************************************************************************
	utilitycompanyEnergyAsBytes, err = json.Marshal(utilitycompanyEnergy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key3, utilitycompanyEnergyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//******************************************************************************
	residentCoinAsBytes, err = json.Marshal(residentCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key4, residentCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//**************************************************************************************
	utilitycompanyCoinAsBytes, err = json.Marshal(utilitycompanyCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key5, utilitycompanyCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//****************************************************************************************
	residentAsBytes, err = json.Marshal(resident)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, residentAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//*****************************************************************************************
	utilitycompanyAsBytes, err = json.Marshal(utilitycompany)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key1, utilitycompanyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	residentEnergyHistory := ResidentEnergyHistory{}
	utilEnergyHistory := UtilEnergyHistory{}
	utilEnergyHistory.User = args[0]

	residentEnergyHistory.Energy , err = strconv.ParseFloat(args[2], 64)
	utilEnergyHistory.Energy , err = strconv.ParseFloat(args[2], 64)




	residentEnergyHistory.Type = "SELL"
	residentEnergyHistory.CoinCredit = coinChange

	utilEnergyHistory.Type = "BUY"
	utilEnergyHistory.CoinDebit = coinChange


	residentHistorykey, err := stub.CreateCompositeKey(prefixUserHistory, []string{args[0]})
	utilityCompanyHistorykey, err := stub.CreateCompositeKey(prefixUtilHistory, []string{})
	residentEnergyHistoryAsbytes, err := json.Marshal(residentEnergyHistory)
	if err != nil {
	return shim.Error(err.Error())
	}
	err = stub.PutState(residentHistorykey, residentEnergyHistoryAsbytes)
	if err != nil {
	return shim.Error(err.Error())
	}

	utilityCompanyEnergyHistoryAsbytes, err := json.Marshal(utilEnergyHistory)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(utilityCompanyHistorykey, utilityCompanyEnergyHistoryAsbytes)
	if err != nil {
	return shim.Error(err.Error())
	}
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	return shim.Success([]byte("energy request updated"))
}

func (s *SmartContract) buyEnergyResidentToUtilityCompany(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	key, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentAsBytes, err := stub.GetState(key)
	if residentAsBytes == nil {
		return shim.Error("Invalid user")
	}
	resident := Resident{}
	err = json.Unmarshal(residentAsBytes, &resident)

	//*****************************************************************************

	key1, err := stub.CreateCompositeKey(prefixUtilityCompany, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyAsBytes, err := stub.GetState(key1)
	if utilitycompanyAsBytes == nil {
		return shim.Error("Invalid user")
	}
	utilitycompany := UtilityCompany{}
	err = json.Unmarshal(utilitycompanyAsBytes, &utilitycompany)

	//******************************************************************************
	key2, err := stub.CreateCompositeKey(prefixEnergy, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentEnergyAsBytes, err := stub.GetState(key2)
	if residentEnergyAsBytes == nil {
		return shim.Error("Invalid energy")
	}
	residentEnergy := Energy{}
	err = json.Unmarshal(residentEnergyAsBytes, &residentEnergy)
	//*******************************************************************
	key3, err := stub.CreateCompositeKey(prefixEnergy, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyEnergyAsBytes, err := stub.GetState(key3)
	if utilitycompanyEnergyAsBytes == nil {
		return shim.Error("Invalid energy")
	}
	utilitycompanyEnergy := Energy{}
	err = json.Unmarshal(utilitycompanyEnergyAsBytes, &utilitycompanyEnergy)
	//******************************************************************
	key4, err := stub.CreateCompositeKey(prefixCoin, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentCoinAsBytes, err := stub.GetState(key4)
	if residentCoinAsBytes == nil {
		return shim.Error("Invalid coin")
	}
	residentCoin := Coin{}
	err = json.Unmarshal(residentCoinAsBytes, &residentCoin)
	//***************************************************************
	key5, err := stub.CreateCompositeKey(prefixCoin, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyCoinAsBytes, err := stub.GetState(key5)
	if utilitycompanyCoinAsBytes == nil {
		return shim.Error("Invalid coin")
	}
	utilitycompanyCoin := Coin{}
	err = json.Unmarshal(utilitycompanyCoinAsBytes, &utilitycompanyCoin)
	//************************************************************************

	EnergyExchanged, err := strconv.ParseFloat(args[2], 64)
	if err != nil {
		return shim.Error("Energy exchanged  must be a number")
	}
	EnergyRate, err := strconv.ParseFloat(args[3], 64)
	if err != nil {
		return shim.Error("Energy rate  must be a number")
	}
	coinChange := EnergyExchanged * EnergyRate
	if utilitycompanyEnergy.EnergyValue < EnergyExchanged || residentCoin.CoinBalance < coinChange {
		return shim.Error("Unable to buy energy either due to insufficient energy or due to insufficient")
	}

	residentEnergy.EnergyValue = residentEnergy.EnergyValue + EnergyExchanged
	residentCoin.CoinBalance = residentCoin.CoinBalance - coinChange

	utilitycompanyEnergy.EnergyValue = utilitycompanyEnergy.EnergyValue - EnergyExchanged
	utilitycompanyCoin.CoinBalance = utilitycompanyCoin.CoinBalance + coinChange

	resident.COIN = residentCoin
	resident.ENERGY = residentEnergy
	utilitycompany.COIN = utilitycompanyCoin
	utilitycompany.ENERGY = utilitycompanyEnergy

	//*************************************************************************************
    residentEnergyAsBytes, err = json.Marshal(residentEnergy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key2, residentEnergyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//******************************************************************************
	utilitycompanyEnergyAsBytes, err = json.Marshal(utilitycompanyEnergy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key3, utilitycompanyEnergyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//******************************************************************************
	residentCoinAsBytes, err = json.Marshal(residentCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key4, residentCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//**************************************************************************************
	utilitycompanyCoinAsBytes, err = json.Marshal(utilitycompanyCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key5, utilitycompanyCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//****************************************************************************************
	residentAsBytes, err = json.Marshal(resident)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, residentAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//*****************************************************************************************
	utilitycompanyAsBytes, err = json.Marshal(utilitycompany)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key1, utilitycompanyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

  	//###############################################################################
	residentEnergyHistory := ResidentEnergyHistory{}
	utilEnergyHistory := UtilEnergyHistory{}
	utilEnergyHistory.User = args[0]

	residentEnergyHistory.Energy , err = strconv.ParseFloat(args[2], 64)
	utilEnergyHistory.Energy , err = strconv.ParseFloat(args[2], 64)




	residentEnergyHistory.Type = "BUY"
	residentEnergyHistory.CoinDebit = coinChange

	utilEnergyHistory.Type = "SELL"
	utilEnergyHistory.CoinCredit = coinChange


	residentHistorykey, err := stub.CreateCompositeKey(prefixUserHistory, []string{args[0]})
	utilityCompanyHistorykey, err := stub.CreateCompositeKey(prefixUtilHistory, []string{})
	residentEnergyHistoryAsbytes, err := json.Marshal(residentEnergyHistory)
	if err != nil {
	return shim.Error(err.Error())
	}
	err = stub.PutState(residentHistorykey, residentEnergyHistoryAsbytes)
	if err != nil {
	return shim.Error(err.Error())
	}

	utilityCompanyEnergyHistoryAsbytes, err := json.Marshal(utilEnergyHistory)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(utilityCompanyHistorykey, utilityCompanyEnergyHistoryAsbytes)
	if err != nil {
	return shim.Error(err.Error())
	}
	//###############################################################################

	return shim.Success([]byte("energy request updated"))
}


//**********************************

func (s *SmartContract) submitQuote(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}
	key, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentAsBytes, err := stub.GetState(key)
	if residentAsBytes == nil {
		return shim.Error("Invalid user")
	}
	resident := Resident{}
	err = json.Unmarshal(residentAsBytes, &resident)
	keyQuote, err := stub.CreateCompositeKey(prefixQuote, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	quoteAsBytes, err := stub.GetState(keyQuote)
	quote := Quote{}
	quote.QuoteID = args[0]
	quote.Name = resident.FirstName
	quote.Address = resident.LastName
	quote.Price = args[1]
	quote.TotalPower = args[2]
	quote.StartDate = args[3]
	quote.EndDate = args[4]
	quote.Status = "Active"
	quote.AvailableCapacity = args[5]
	quote.Rating = args[6]
	quote.TotalPowerTransaction = strconv.FormatFloat(resident.ENERGY.EnergyValue, 'f', -1, 64)

	quoteAsBytes, err = json.Marshal(quote)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(keyQuote, quoteAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
    //**************************************************************
	//**************************************************************
	
	//*****************************************************************************

	key1, err := stub.CreateCompositeKey(prefixUtilityCompany, []string{"u202@email.com"})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyAsBytes, err := stub.GetState(key1)
	if utilitycompanyAsBytes == nil {
		return shim.Error("Invalid user")
	}
	utilitycompany := UtilityCompany{}
	err = json.Unmarshal(utilitycompanyAsBytes, &utilitycompany)

	//******************************************************************************
	key2, err := stub.CreateCompositeKey(prefixEnergy, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentEnergyAsBytes, err := stub.GetState(key2)
	if residentEnergyAsBytes == nil {
		return shim.Error("Invalid energy")
	}
	residentEnergy := Energy{}
	err = json.Unmarshal(residentEnergyAsBytes, &residentEnergy)
	//*******************************************************************
	key3, err := stub.CreateCompositeKey(prefixEnergy, []string{"u202@email.com"})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyEnergyAsBytes, err := stub.GetState(key3)
	if utilitycompanyEnergyAsBytes == nil {
		return shim.Error("Invalid energy")
	}
	utilitycompanyEnergy := Energy{}
	err = json.Unmarshal(utilitycompanyEnergyAsBytes, &utilitycompanyEnergy)
	//******************************************************************
	key4, err := stub.CreateCompositeKey(prefixCoin, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentCoinAsBytes, err := stub.GetState(key4)
	if residentCoinAsBytes == nil {
		return shim.Error("Invalid coin")
	}
	residentCoin := Coin{}
	err = json.Unmarshal(residentCoinAsBytes, &residentCoin)
	//***************************************************************
	key5, err := stub.CreateCompositeKey(prefixCoin, []string{"u202@email.com"})
	if err != nil {
		return shim.Error(err.Error())
	}
	utilitycompanyCoinAsBytes, err := stub.GetState(key5)
	if utilitycompanyCoinAsBytes == nil {
		return shim.Error("Invalid coin")
	}
	utilitycompanyCoin := Coin{}
	err = json.Unmarshal(utilitycompanyCoinAsBytes, &utilitycompanyCoin)
	//************************************************************************

	EnergyExchanged, err := strconv.ParseFloat(args[2], 64)
	if err != nil {
		return shim.Error("Energy exchanged  must be a number")
	}
	EnergyRate, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		return shim.Error("Energy rate  must be a number")
	}
	coinChange := EnergyExchanged * EnergyRate * 0.9
	if utilitycompanyCoin.CoinBalance <= 0 || residentEnergy.EnergyValue < EnergyExchanged {
		return shim.Error("Unable to sell energy either due to insufficient coin balance or insufficient energy")
	}
	residentEnergy.EnergyValue = residentEnergy.EnergyValue - EnergyExchanged
	residentCoin.CoinBalance = residentCoin.CoinBalance + coinChange

	utilitycompanyEnergy.EnergyValue = utilitycompanyEnergy.EnergyValue + EnergyExchanged
	utilitycompanyCoin.CoinBalance = utilitycompanyCoin.CoinBalance - coinChange

	resident.COIN = residentCoin
	resident.ENERGY = residentEnergy
	utilitycompany.COIN = utilitycompanyCoin
	utilitycompany.ENERGY = utilitycompanyEnergy

	//***************************************************************************************
	residentEnergyAsBytes, err = json.Marshal(residentEnergy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key2, residentEnergyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//******************************************************************************
	utilitycompanyEnergyAsBytes, err = json.Marshal(utilitycompanyEnergy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key3, utilitycompanyEnergyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//******************************************************************************
	residentCoinAsBytes, err = json.Marshal(residentCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key4, residentCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//**************************************************************************************
	utilitycompanyCoinAsBytes, err = json.Marshal(utilitycompanyCoin)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key5, utilitycompanyCoinAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//****************************************************************************************
	residentAsBytes, err = json.Marshal(resident)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, residentAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//*****************************************************************************************
	utilitycompanyAsBytes, err = json.Marshal(utilitycompany)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key1, utilitycompanyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	//***************************************************************

	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	residentEnergyHistory := ResidentEnergyHistory{}
	utilEnergyHistory := UtilEnergyHistory{}
	utilEnergyHistory.User = args[0]
	
	residentEnergyHistory.Energy , err = strconv.ParseFloat(args[2], 64)
	utilEnergyHistory.Energy , err = strconv.ParseFloat(args[2], 64)




	residentEnergyHistory.Type = "SELL"
	residentEnergyHistory.CoinCredit = coinChange

	utilEnergyHistory.Type = "BUY"
	utilEnergyHistory.CoinDebit = coinChange

	//****************************************************************
	residentHistorykey, err := stub.CreateCompositeKey(prefixUserHistory, []string{args[0]})
	utilityCompanyHistorykey, err := stub.CreateCompositeKey(prefixUtilHistory, []string{})
	residentEnergyHistoryAsbytes, err := json.Marshal(residentEnergyHistory)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(residentHistorykey, residentEnergyHistoryAsbytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	utilityCompanyEnergyHistoryAsbytes, err := json.Marshal(utilEnergyHistory)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(utilityCompanyHistorykey, utilityCompanyEnergyHistoryAsbytes)
	if err != nil {
		return shim.Error(err.Error())
	}
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	return shim.Success([]byte("Sucessfully Submitted new quote"))

}

func (s *SmartContract) getQuote(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixQuote, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		quote := Quote{}
		err = json.Unmarshal(kvResult.Value, &quote)
		if err != nil {
			return shim.Error(err.Error())
		}
		results = append(results, quote)

	}

	quoteAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(quoteAsBytes)

}
func (s *SmartContract) incrementEnergyValue(stub shim.ChaincodeStubInterface, args []string) pb.Response{
	key, err := stub.CreateCompositeKey(prefixResident, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	residentAsBytes, err := stub.GetState(key)
	if residentAsBytes == nil {
		return shim.Error("Invalid user")
	}
	resident := Resident{}
	err = json.Unmarshal(residentAsBytes, &resident)

	Energykey, err := stub.CreateCompositeKey(prefixEnergy, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	energyAsBytes, err := stub.GetState(Energykey)
	if energyAsBytes == nil {
		return shim.Error("Invalid Energy")
	}
	energy := Energy{}
	err = json.Unmarshal(energyAsBytes, &energy)

	incrementValue ,_:= strconv.ParseFloat(args[1],64)
	energy.EnergyValue=energy.EnergyValue + incrementValue
	resident.ENERGY=energy

	residentAsBytes, err = json.Marshal(resident)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, residentAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	energyAsBytes, err = json.Marshal(energy)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(Energykey, energyAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("Sucessfully Updated Energy Value"))



}


