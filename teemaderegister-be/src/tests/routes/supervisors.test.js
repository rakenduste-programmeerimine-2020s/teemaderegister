const expect = require('chai').expect

module.exports = (supertest, { slug }) => {
  describe('GET /:slug', () => {
    it('it should get supervisor topics by supervisor slug', done => {
      supertest
        .get('/api/supervisors/' + slug)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          const { supervisor, counts } = res.body
          expect(supervisor).to.be.an('object')
          expect(supervisor).to.have.property('_id')
          expect(supervisor).to.have.property('profile')

          expect(counts).to.have.property('available')
          expect(counts).to.have.property('registered')
          expect(counts).to.have.property('defended')
          expect(counts).to.have.property('all')
          expect(counts.defended).to.have.property('chartData')

          done()
        })
    })
  })
}
