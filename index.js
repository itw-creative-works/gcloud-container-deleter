const argv = require('yargs').argv;
const exec = require('child_process').exec;

if (!argv.project) {
  return console.error("Please provide a project argument like: npm start -- --project='my-project'");
}

// DELETE
https://console.cloud.google.com/gcr/images/giftly-application/us/gcf-artifacts?project=giftly-application
https://console.cloud.google.com/artifacts?project=giftly-application

// https://us.gcr.io/giftly-application/gcf-artifacts/bm__api
// gcloud container images list --repository=us.gcr.io/giftly-application/gcf-artifacts
// gcloud container images list --project="giftly-application"

// const parentCommand = `gcloud container images list --repository=us.gcr.io/${argv.project}/gcf/us-central1`;
const parentCommand = `gcloud container images list --repository=us.gcr.io/${argv.project}/gcf-artifacts`;
// const childCommand = `gcloud container images delete us.gcr.io/${argv.project}/gcf/us-central1/{id}/{finalFolder}:latest --force-delete-tags --quiet`
const childCommand = `gcloud container images delete us.gcr.io/${argv.project}/gcf/us-central1/{id}/{finalFolder}:latest --force-delete-tags --quiet`

// gcloud container images delete us.gcr.io/giftly-application/gcf-artifacts/bm__api:latest --force-delete-tags --quiet
// gcloud container images delete us.gcr.io/giftly-application/gcf-artifacts/bm__api:latest

exec(parentCommand, function (error, stdout, stderr) {
  let folders = stdout.split('\n');
  folders.shift();
  folders.pop();

  console.log('Deleting folders...', folders);

  folders.forEach((folderPath, i) => {
    let subfolder = folderPath.split('/')
    subfolder = subfolder[subfolder.length - 1];
    const innerPath = childCommand.replace('{id}', subfolder);

    console.log('Deleting...', innerPath);

    exec(innerPath.replace('{finalFolder}', 'worker'), function (error, stdout, stderr) {
      console.log('Result', stdout);
    })

    exec(innerPath.replace('{finalFolder}', 'cache'), function (error, stdout, stderr) {
      console.log('Result', stdout);
    })

  });

});


// gcloud container images delete us.gcr.io/itw-creative-works/gcf/us-central1/009d5afd-cf88-4fd5-adfe-35c31d449a46/cache --force-delete-tags  --quiet
