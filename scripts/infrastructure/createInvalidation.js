var AWS = require('aws-sdk');
var cloudFormation = new AWS.CloudFormation();
var cloudFront = new AWS.CloudFront();
var stackName = process.argv[2];

cloudFormation.describeStacks({
    StackName: stackName
}, function (error, data) {
    if (error) {
        console.log(error.code, error);
        process.exit(1);
    } else {
        var stack = data['Stacks'][0];
        stack['Outputs'].forEach(function (output) {
            if (output['OutputKey'] === 'CloudfrontDistributionID') {
                cloudFront.createInvalidation({
                    DistributionId: output['OutputValue'],
                    InvalidationBatch: {
                        CallerReference: `${stackName}-${new Date().getTime()}`,
                        Paths: {
                            Quantity: 1,
                            Items: [
                                '/*'
                            ]
                        }
                    }
                }, function (error) {
                    if (error) {
                        console.log(error.code, error);
                        process.exit(1);
                    } else {
                        process.exit();
                    }
                });
            }
        });
    }
});
