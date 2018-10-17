const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../app'); // Our app

describe('API endpoint /orders', function() {
  this.timeout(5000); // How long to wait for a response (ms)

  before(function() {

  });

  after(function() {

  });

  // GET - List all orders
  it('should return all orders', function() {
    return chai.request(app)
      .get('/orders')
      .then(function(res) {
        expect(res).to.have.status(200);
        // expect(res).to.be.an('array');
        // expect(res.body).to.be.an('object');
        // expect(res.body.results).to.be.an('array');
      });
  });

});