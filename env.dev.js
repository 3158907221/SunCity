"use strict";

const VUE_APP_URL = "http://localhost:8080";
const LOGIN_URL = "http://127.0.0.1/login?title=员工考勤查询&url=";
const PROJECT_NAME = "prjEmployeeQuery";
const COOKIE_TIMEOUT = 3600 * 1000;

module.exports = {
  NODE_ENV: '"development"',
  VUE_APP_URL_STRING: VUE_APP_URL,
  VUE_APP_URL: JSON.stringify(VUE_APP_URL),
  LOGIN_URL: JSON.stringify(LOGIN_URL),
  PROJECT_NAME: JSON.stringify(PROJECT_NAME),
  COOKIE_TIMEOUT: JSON.stringify(COOKIE_TIMEOUT),
};
