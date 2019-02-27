# ---------------------------------------------------------------------------
# Generate certificates using cryptogen tool
# ---------------------------------------------------------------------------

CHANNEL_NAME="jeadigitalchannel"

which cryptogen
if [ "$?" -ne 0 ]; then
echo "cryptogen tool not found. exiting..."
exit 1
fi
  echo
  echo "----------------------------------------------------------"
  echo "##### Generate certificates using cryptogen tool #########"
  echo "----------------------------------------------------------"
    if [ -d "crypto-config" ]; then
    rm -Rf crypto-config
  fi
  cryptogen generate --config=cryptogen.yaml
  if [ "$?" -ne 0 ]; then
    echo "Failed to generate certificates..."
    exit 1
  fi
  echo "Sucessfully Generated certificates using cryptogen tool"

#-----------------------------------------------------------------------------
# Generate genesis block ,channel.tx and anchor peer using configtxgen tool
#-----------------------------------------------------------------------------
     which configtxgen
  if [ "$?" -ne 0 ]; then
    echo "configtxgen tool not found. exiting..."
    exit 1
  fi

  echo "----------------------------------------------------------"
  echo "#########  Generating Orderer Genesis block ##############"
  echo "----------------------------------------------------------"

  configtxgen -profile ThreeOrgsOrdererGenesis -outputBlock ./genesis.block
  if [ "$?" -ne 0 ]; then
    echo "Failed to generate orderer genesis block..."
    exit 1
  fi
  echo
  echo "-----------------------------------------------------------------------"
  echo "### Generating channel configuration transaction 'jeadigitalchannel.tx' ###"
  echo "-----------------------------------------------------------------------"
  configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx ./jeadigitalchannel.tx -channelID $CHANNEL_NAME
  if [ "$?" -ne 0 ]; then
    echo "Failed to generate channel configuration transaction..."
    exit 1
  fi

  echo
  echo "-----------------------------------------------------------------------------"
  echo "#######  Generating anchor peer update  Govt, Builder and User ###########"
  echo "-----------------------------------------------------------------------------"
  configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./ResidentsMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ResidentsMSP
  configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./BankMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BankMSP
  configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./UtilityCompanyMSPanchors.tx -channelID $CHANNEL_NAME -asOrg UtilityCompanyMSP
  if [ "$?" -ne 0 ]; then
    echo "Failed to generate anchor peer ..."
    exit 1
  fi
