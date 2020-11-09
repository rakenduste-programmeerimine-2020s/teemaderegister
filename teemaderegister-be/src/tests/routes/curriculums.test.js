const expect = require('chai').expect

module.exports = (supertest, { savedCurriculum }) => {
  describe('GET /:slug', () => {
    const { slugs: { et, en } } = savedCurriculum
    const INVALID_SLUG = 'Random'

    it('it should get curriculum meta by curriculum slug.et', done => {
      supertest
        .get(`/api/curriculums/${et}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          checkCurriculumMetaProperties(res.body, savedCurriculum)

          done()
        })
    })

    it('it should get curriculum meta by curriculum slug.en', done => {
      supertest
        .get(`/api/curriculums/${en}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          checkCurriculumMetaProperties(res.body, savedCurriculum)

          done()
        })
    })

    it('it should return 400 Bad Request with invalid slug', done => {
      supertest
        .get(`/api/curriculums/${INVALID_SLUG}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(done)
    })
  })
}

const checkCurriculumMetaProperties = (body, constants) => {
  const { meta, topics, supervisors } = body
  const { abbreviation, languages, faculty, slugs: {et, en} } = constants

  expect(meta).to.be.an('object')
  expect(topics).to.be.an('object')
  expect(supervisors).to.be.an('object')
  expect(meta).to.have.property('_id')
  expect(meta.abbreviation).to.equal(abbreviation)
  expect(meta.languages).to.be.an('array').to.deep.equal(languages)
  expect(meta.faculty).to.equal(faculty)
  expect(meta.representative.profile).to.be.an('object')
  expect(meta.slugs.et).to.equal(et)
  expect(meta.slugs.en).to.equal(en)
  expect(topics).to.have.property('available')
  expect(topics).to.have.property('registered')
  expect(topics).to.have.property('defended')
  expect(topics).to.have.property('all')
  expect(supervisors).to.have.property('all')
  expect(supervisors).to.have.property('supervised')
}
