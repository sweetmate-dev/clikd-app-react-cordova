function logPageView(page) {
  try {
    window.cordova.plugins.firebase.analytics.logEvent('page_view', { page });
    window.cordova.plugins.firebase.analytics.setCurrentScreen(page);
  } catch (error) {
    console.log(error);
  }
}

function setUserProperty(name, value) {
  try {
    if (name == 'id') {
      window.cordova.plugins.firebase.analytics.setUserId(value);
    } else {
      window.cordova.plugins.firebase.analytics.setUserProperty(name, value);
    }
  } catch (error) {
    console.log(error);
  }
}

export default {
  logPageView,
  setUserProperty,
};
