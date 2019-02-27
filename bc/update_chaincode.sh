# --------------------------------------------------------------------------------------------
# create channels,join peer nodes to the channel,install chaincodes and instantiate chaincodes
# --------------------------------------------------------------------------------------------

jq --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
	echo "Please Install 'jq' to execute this script"
	echo
	exit 1
fi

starttime=$(date +%s)

# Language defaults to "golang"
LANGUAGE="golang"
CCNAME="energymanagement"
CCVERSION="v38"

##set chaincode path
function setChaincodePath(){
	LANGUAGE=`echo "$LANGUAGE" | tr '[:upper:]' '[:lower:]'`
	case "$LANGUAGE" in
		"golang")
		CC_SRC_PATH="chaincode"
		;;
		"node")
		CC_SRC_PATH="$PWD/artifacts/src/chaincode"
		;;
		*) printf "\n ------ Language $LANGUAGE is not supported yet ------\n"$
		exit 1
	esac
}
# Creating New Affiliation
# =============================================================================================

setChaincodePath
sleep 2
#===========================================================================================================================
echo "POST request Enroll on Residents  ..."
echo
ORG1_TOKEN=$(curl -s -X POST \
  http://localhost:4000/api/v1/enroll_users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d 'username=ResidentsAdmin&orgName=Residents')
echo $ORG1_TOKEN
ORG1_TOKEN=$(echo $ORG1_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG1 token is $ORG1_TOKEN"
echo
#===========================================================================================================================

echo "POST request Enroll on Bank ..."
echo
ORG2_TOKEN=$(curl -s -X POST \
  http://localhost:4000/api/v1/enroll_users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d 'username=BankAdmin&orgName=Bank')
echo $ORG2_TOKEN
ORG2_TOKEN=$(echo $ORG2_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG2 token is $ORG2_TOKEN"
echo
echo
#===========================================================================================================================
echo "POST request Enroll on UtilityCompany ..."
echo
ORG3_TOKEN=$(curl -s -X POST \
  http://localhost:4000/api/v1/enroll_users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d 'username=UtilityCompanyAdmin&orgName=UtilityCompany')
echo $ORG3_TOKEN
ORG3_TOKEN=$(echo $ORG3_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG2 token is $ORG3_TOKEN"
echo
echo
#===========================================================================================================================
echo "POST Install chaincode on Residents"
echo
curl -s -X POST \
  http://localhost:4000/api/v1/install_chaincodes \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.residents.jeabc.com\"],
	\"chaincodeName\":\"$CCNAME\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"$CCVERSION\"
}"
echo
echo
#===========================================================================================================================
echo "POST Install chaincode on Bank"
echo
curl -s -X POST \
  http://localhost:4000/api/v1/install_chaincodes \
  -H "authorization: Bearer $ORG2_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.bank.jeabc.com\"],
	\"chaincodeName\":\"$CCNAME\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"$CCVERSION\"
}"
echo
#===========================================================================================================================
echo "POST Install chaincode on UtilityCompany"
echo
curl -s -X POST \
  http://localhost:4000/api/v1/install_chaincodes \
  -H "authorization: Bearer $ORG3_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.utilitycompany.jeabc.com\"],
	\"chaincodeName\":\"$CCNAME\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"$CCVERSION\"
}"
echo


#===========================================================================================================================
echo "POST upgrade chaincode on peer0 of Residents"
echo
curl -s -X POST \
  http://localhost:4000/api/v1/upgrade_chaincode/jeadigitalchannel/chaincodes \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
  \"peers\": [\"peer0.residents.jeabc.com\"],
	\"chaincodeName\":\"$CCNAME\",
	\"chaincodeVersion\":\"$CCVERSION\",
	\"chaincodeType\": \"$LANGUAGE\",
  \"args\":[\" \"]
}"
echo
echo

echo
echo "Total execution time : $(($(date +%s)-starttime)) secs ..."
