import {tokens} from "./tokens";

const baseAuthMock = {
    username: 'george.brad',
    password: 'Password123!',
};

const authMock = {
    user: { ...baseAuthMock, token: tokens.userToken },
};

module.exports = authMock;
