const request = require('supertest');
const app = require('./index');

const hostname = 'test.pikapp.ch';
const base = `https://test.pik.app/redirect-legacy/`;

describe('task-redirect', () => {
  it('should not redirect if no argument is given', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/redirect/task/')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(base);
    done();
  });

  it('should redirect if an argument is given', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/redirect/task/123')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(`${base}task/123`);
    done();
  });

  it('should be insensitive of trailing slashes', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/redirect/task/123/')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(`${base}task/123`);
    done();
  });

  it('should throw on invalid URL', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/redirect/task/abc12')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(500);
    expect(res.body).toStrictEqual({});
    done();
  });
});

describe('task', () => {
  it('should redirect if an argument is given', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/tasks/project--56/task-slug--3')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(`${base}task/3`);
    done();
  });

  it('should redirect for weird slugs', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/tasks/project-1-2-3--3-4--56/task-slug--1--2---3')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(`${base}task/3`);
    done();
  });

  it('should be insensitive of trailing slashes', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/tasks/project--56/task-slug--3/')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(`${base}task/3`);
    done();
  });

  it('should throw on invalid URL', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/tasks/project--56/task-slug--/')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(500);
    expect(res.body).toStrictEqual({});
    done();
  });
});

['projects', 'projectviews'].forEach(type => {
  // eslint-disable-next-line jest/valid-title
  describe(type, () => {
    it('should redirect if an argument is given', async done => {
      expect.assertions(2);
      const res = await request(app)
        .get(`/${type}/slug--56`)
        .set('Host', hostname)
        .send();
      expect(res.statusCode).toStrictEqual(301);
      expect(res.header['location']).toStrictEqual(
        `${base}${type.slice(0, -1)}/56`
      );
      done();
    });

    it('should redirect for weird slugs', async done => {
      expect.assertions(2);
      const res = await request(app)
        .get(`/${type}/slug-1-2-3--3-4--56`)
        .set('Host', hostname)
        .send();
      expect(res.statusCode).toStrictEqual(301);
      expect(res.header['location']).toStrictEqual(
        `${base}${type.slice(0, -1)}/56`
      );
      done();
    });

    it('should be insensitive of trailing slashes', async done => {
      expect.assertions(2);
      const res = await request(app)
        .get(`/${type}/slug--56/`)
        .set('Host', hostname)
        .send();
      expect(res.statusCode).toStrictEqual(301);
      expect(res.header['location']).toStrictEqual(
        `${base}${type.slice(0, -1)}/56`
      );
      done();
    });

    it('should throw on invalid URL', async done => {
      expect.assertions(2);
      const res = await request(app)
        .get(`/${type}/slug--/`)
        .set('Host', hostname)
        .send();
      expect(res.statusCode).toStrictEqual(500);
      expect(res.body).toStrictEqual({});
      done();
    });
  });
});

describe('fallback', () => {
  it('should redirect if no path is given', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(base);
    done();
  });

  it('should redirect with query string', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/?foo=bar')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(base);
    done();
  });

  it('should redirect one level deep', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/foo')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(base);
    done();
  });

  it('should redirect one level deep with trailing slash', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/foo/')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(base);
    done();
  });

  it('should redirect two levels deep', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/foo/bar')
      .set('Host', hostname)
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual(base);
    done();
  });

  it('should redirect to fallback if no vhost can be detected', async done => {
    expect.assertions(2);
    const res = await request(app)
      .get('/')
      .send();
    expect(res.statusCode).toStrictEqual(301);
    expect(res.header['location']).toStrictEqual('https://pik.app');
    done();
  });
});
