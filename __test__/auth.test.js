'use strict';

const b64 = require('js-base64');
const { sequelize, AuthUser } = require('../src/models');
const { signin } = require('../src/auth/routes/index');

describe('Auth Routes', () => {
  it('returns a web token for a sign in route', async () => {
    await sequelize.sync();
    const user = await AuthUser.createWithHashed('Mike', 'pip1');

    const req = {
      header: jest.fn().mockImplementation((header) => {
        if (header === 'Authorization') {
          return `Basic ${b64.encode(`${user.username}:${user.password}`)}`;
        }
        return '';
      }),
    };
    const res = { send: jest.fn() };
    const next = jest.fn();
    await signin(req, res, next);

    const token = res.send.mock.calls[0][0];
    const [_header, payloadBase64, _signature] = token.split('.');
    const payload = JSON.parse(b64.decode(payloadBase64));
    expect(payload.username).toBe(user.username);
  });
});




