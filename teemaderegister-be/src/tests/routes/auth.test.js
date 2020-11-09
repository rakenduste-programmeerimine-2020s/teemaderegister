module.exports = (supertest) => {
  const sampleUserData = {
    firstName: 'Kalle',
    lastName: 'Tamme',
    email: 'ktamm@tlu.ee',
    password: '11111111',
    roles: [ 'supervisor' ]
  }

  const { firstName, lastName, email, password, roles } = sampleUserData

  let jwtToken

  describe('POST /local/signup', () => {
    it('it should not allow password shorter than 8', done => {
      supertest
        .post('/api/auth/local/signup')
        .send({ firstName, lastName, email, password: 'short', roles })
        .expect(422)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should create new user', done => {
      supertest
        .post('/api/auth/local/signup')
        .send(sampleUserData)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not allow empty fields', done => {
      supertest
        .post('/api/auth/local/signup')
        .send({ })
        .expect(422)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not allow empty first name', done => {
      supertest
        .post('/api/auth/local/signup')
        .send({ lastName, email, password, roles })
        .expect(422)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not allow empty last name', done => {
      supertest
        .post('/api/auth/local/signup')
        .send({ firstName, email, password, roles })
        .expect(422)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not sign up user without full name', done => {
      supertest
        .post('/api/auth/local/signup')
        .send({ email, password, roles })
        .expect(422)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not allow same slug in database', done => {
      supertest
        .post('/api/auth/local/signup')
        .send(sampleUserData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not create user with existing email', done => {
      supertest
        .post('/api/auth/local/signup')
        .send({
          firstName: 'Foo',
          lastName: 'Bar',
          email,
          password,
          roles
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not login user with wrong email', done => {
      supertest
        .post('/api/auth/local/login')
        .send({ email: 'random@email.com', password })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not login the user with wrong password', done => {
      supertest
        .post('/api/auth/local/login')
        .send({
          email,
          password: 'randomsequence'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should not login user with wrong password and email', done => {
      supertest
        .post('/api/auth/local/login')
        .send({
          email: 'random@email.com',
          password: 'randomsequence'
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })

    it('it should login the user with correct email and password', done => {
      supertest
        .post('/api/auth/local/login')
        .send({ email, password })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          jwtToken = res.body.token
          done()
        })
    })
  })

  describe('POST /logout', () => {
    it('it should logout the user', done => {
      supertest
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })
}
