import Requests from './Requests';
import { flattenJSON } from '^/services/Utils';

function constructUrl(endPoint) {
  return `${process.env.API_ROOT}${endPoint}`;
}

const Api = {

  deleteUser() {
    const url = constructUrl('/me/delete/');
    return Requests.request(url, {
      method: 'del',
      auth: true,
    });
  },

  getSelf() {
    const url = constructUrl('/me/');
    return Requests.request(url, { auth: true });
  },

  updateSelf(fields) {
    const url = constructUrl('/me/update/');
    return Requests.request(url, {
      method: 'put',
      body: { fields },
      auth: true,
    });
  },

  refreshDevice(id) {
    const url = constructUrl('/me/refresh-device/');
    return Requests.request(url, {
      method: 'post',
      body: { deviceToken: id },
      auth: true,
    });
  },

  saveTest(test) {
    const url = constructUrl('/me/test/');
    return Requests.request(url, {
      method: 'post',
      body: test,
      auth: true,
    });
  },

  getNudges() {
    const url = constructUrl('/me/nudges/');
    return Requests.request(url, { auth: true });
  },

  getRecommendations() {
    const url = constructUrl('/me/recommendations/');
    return Requests.request(url, { auth: true });
  },

  getActivity() {
    const url = constructUrl('/me/activity/');
    return Requests.request(url, { auth: true });
  },

  getThreads() {
    const url = constructUrl('/me/chat/');
    return Requests.request(url, { auth: true });
  },

  markThreadRead(matchUserId, threadId) {
    const url = constructUrl('/me/mark-thread-read/');
    return Requests.request(url, {
      method: 'post',
      auth: true,
      body: {
        matchUserId: matchUserId
      },
    }).then((response) => {
      response.threadId = threadId;
      return response;
    });
  },

  sendChatNotificationToSelf(message) {
    const url = constructUrl('/me/chat-notification/');
    return Requests.request(url, {
      method: 'post',
      auth: true,
      body: {
        message: message
      },
    });
  },

  getUsers(sort = [], filter = [], page) {
    const url = constructUrl('/user/');
    const query = flattenJSON({ sort, filter });
    query.page = page;
    return Requests.request(url, {
      query,
      auth: true,
    });
  },

  getUser(userId) {
    const url = constructUrl(`/user/${userId}/`);
    return Requests.request(url, { auth: true });
  },

  nudgeUser(userId) {
    const url = constructUrl(`/user/${userId}/nudge/`);
    return Requests.request(url, { method: 'post', auth: true });
  },

  blockUser(userId) {
    const url = constructUrl(`/user/${userId}/block/`);
    return Requests.request(url, { method: 'post', auth: true });
  },

  reportUser(userId, reasonId) {
    const url = constructUrl(`/user/${userId}/report/`);
    return Requests.request(url, {
      method: 'post',
      auth: true,
      body: {
        reasonId: reasonId
      },
    });
  },

  submitTest(userId, test) {
    const url = constructUrl(`/user/${userId}/test/`);
    return Requests.request(url, {
      method: 'post',
      body: test,
      auth: true,
    });
  },

  getQuestions() {
    const url = constructUrl('/questions/');
    return Requests.request(url, {
      auth: true,
    });
  },

  getTestResultMessages() {
    const url = constructUrl('/test-result-messages/');
    return Requests.request(url, {
      auth: true,
    });
  },

};

export default Api;
