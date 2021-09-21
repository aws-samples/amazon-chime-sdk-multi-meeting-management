 #!/bin/bash
NODEVER="$(node --version)"
REQNODE="v12.0.0"
if ! [ "$(printf '%s\n' "$REQNODE" "$NODEVER" | sort -V | head -n1)" = "$REQNODE" ]; then
    echo 'node must be version 12+ https://nodejs.org/en/download/'
    exit 1
fi
if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed. https://www.npmjs.com/get-npm' >&2
  exit 1
fi
if ! [ -x "$(command -v aws)" ]; then
  echo 'Error: aws is not installed. https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html' >&2
  exit 1
fi
if ! [ -x "$(command -v cdk)" ]; then
  echo 'Error: cdk is not installed. https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install' >&2
  exit 1
fi
if [ -f "cdk.context.json" ]; then
    echo ""
    echo "INFO: Removing cdk.context.json"
    rm cdk.context.json
else
    echo ""
    echo "INFO: cdk.context.json not present, nothing to remove"
fi
if [ ! -f "package-lock.json" ]; then
    echo ""
    echo "Installing Packages"
    echo ""
    npm install --legacy-peer-deps
fi
if [ ! -d "front-end-resources/react-meeting/build" ]; then
    echo ""
    echo "Creating front-end-resources/react-meeting/build directory"
    echo ""
    mkdir front-end-resources/react-meeting/build
fi
if [ -z "$1" ]; then
    echo "No region parameter provided"
    echo "Deploying in us-east-1"
    export CDK_DEPLOY_REGION="us-east-1"
else 
    echo "Deploying in $1"
    export CDK_DEPLOY_REGION=$1
fi
echo ""
echo "Building CDK"
echo ""
npm run build
echo ""
echo "Deploying Back End"
echo ""
cdk deploy MeetingBackEnd -O front-end-resources/react-meeting/src/cdk-outputs.json --parameters region=${CDK_DEPLOY_REGION}
echo ""
echo "Building React App"
echo ""
pushd front-end-resources/react-meeting
if [ ! -f "package-lock.json" ]; then
    echo ""
    echo "Installing Packages"
    echo ""
    npm install --legacy-peer-deps
fi
npm run build
popd
echo ""
echo "Deploying Front End"
echo ""
cdk deploy MeetingFrontEnd