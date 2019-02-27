package main

type Resident struct {
	ResidentID  string      `json:"ResidentID"`
	FirstName   string      `json:"FirstName"`
	LastName    string      `json:"LastName"`
	COIN        Coin        `json:"COIN"`
	BANKACCOUNT BankAccount `json:"BANKACCOUNT"`
	ENERGY      Energy      `json:"ENERGY"`
	Password    string      `json:"Password"`
}
type Bank struct {
	BankID   string `json:"BankID"`
	BankName string `json:"BankName"`
	Password string `json:"Password"`
}
type Customer struct {
	CustomerID string         `json:"CustomerID"`
	Residents  Resident       `json:"Residents"`
	Company    UtilityCompany `json:"Company"`
}
type UtilityCompany struct {
	CompanyID   string      `json:"CompanyID"`
	CompanyName string      `json:"CompanyName"`
	COIN        Coin        `json:"COIN"`
	BANKACCOUNT BankAccount `json:"BANKACCOUNT"`
	ENERGY      Energy      `json:"ENERGY"`
	Password    string      `json:"Password"`
}

type Coin struct {
	CoinID      string  `json:"CoinID"`
	UserID      string  `json:"UserID"`
	CoinBalance float64 `json:"CoinBalance"`
}
type BankAccount struct {
	AccountID string  `json:"AccountID"`
	UserID    string  `json:"UserID"`
	Currency  string  `json:"Currency"`
	CashValue float64 `json:CashValue"`
}
type Energy struct {
	EnergyID    string  `json:"EnergyID"`
	Units       string  `json:"Units"`
	EnergyValue float64 `json:"EnergyValue"`
	UserID      string  `json:"UserID"`
}

type ResidentEnergyHistory struct {
	Energy     float64 `json:"Energy"`
	Type       string  `json:"Type"`
	CoinCredit float64 `json:"CoinCredit"`
	CoinDebit  float64 `json:"CoinDebit"`
}

type UtilEnergyHistory struct {
	Energy     float64 `json:"Energy"`
	Type       string  `json:"Type"`
	CoinCredit float64 `json:"CoinCredit"`
	User       string  `json:"User"`
	CoinDebit  float64 `json:"CoinDebit"`
}

type UserBankHistory struct {
	From     string  `json:"From"`
	To       string  `json:"To"`
	Amount   float64 `json:"Amount"`
	Type   string  `json:"Type"`

}

type Quote struct {
	QuoteID               string `json:"QuoteID"`
	Name                  string `json:"Name"`
	Address               string `json:"Address"`
	Price                 string `json:"Price"`
	TotalPower            string `json:"TotalPower"`
	StartDate             string `json:"StartDate"`
	EndDate               string `json:"EndDate"`
	Status                string `json:"Status"`
	AvailableCapacity     string `json:"AvailableCapacity"`
	Rating                string `json:"Rating"`
	TotalPowerTransaction string `json:"TotalPowerTransaction"`
}
