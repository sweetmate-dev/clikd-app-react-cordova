export default {
  init(storeObj) {
    if (window.device.platform === 'browser') {
      return;
    }

    let store = storeObj;

    if (process.env.BRANCH_IO_TEST_MODE) {
      Branch.setDebug(true).then(function(res) {
        console.log('setDebug Response: ', res);
      }).catch(function(err) {
        console.log('setDebug Error: ', err);
      });
    }

    // Branch initialization
    Branch.initSession(function(data) {
      if (data['+clicked_branch_link']) {
        // read deep link data on click
        console.log('Deep Link Data: ', JSON.stringify(data));
      }
    }).then(function(res) {
      console.log('Response: ', res);
    }).catch(function(err) {
      console.log('Error: ', err);
    })
  },
};
