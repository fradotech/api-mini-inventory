const request = require('supertest')
const expect = require('chai').expect

const host = "http://" + 'localhost' + ':' + 4000 + '/api/v1'
// Token harus diperbarui jika error 403
const accessToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkZyYW1lc3RhIEZlcm5hbmRvIiwiZW1haWwiOiJmcmFkb3RlY2guaWRAZ21haWwuY29tIiwiaWF0IjoxNjUzNDU2MDU0LCJleHAiOjE2NTQwNjA4NTR9.wlAM0LzRfkEeJAJVGADZIkR7N_4g5q2U6ILleeubNtE'

describe("auth", () => {
  const basePath = "/auth"
  const userCredentials = {
    email: 'fradotech.id@gmail.com', 
    password: 'fradoo'
  }

  it('Login gagal password salah', function (done) {
    const path = basePath + "/login"
    console.log(path)

    request(host)
    .post(path)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({
      email: 'fradotech.id@gmail.com', 
      password: 'passwordSalah'
    })
    .expect(401)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Incorrect User or Password')
    })
    .end(done);
  })

  it('Login berhasil', function (done) {
    const path = basePath + "/login"
    console.log(path)

    request(host)
    .post(path)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(userCredentials)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Successful operation!')
      expect(response.body.data.accessToken).not.to.be.empty // Tes harus mengembalikan token
    })
    .end(done);
  })
})

describe("orders", () => {
  let createdOrder
  const basePath = "/orders"
  const product = {
    quantity: 10,
    productId: 2
  }

  const confirm = {
    customerName: "Fradoo",
    status: false
  }

  it('List products tanpa token gagal, authorized', function (done) {
    const path = basePath + "/products"
    console.log(path)

    request(host)
    .get(path)
    // .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(404)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Not found') // Token tidak ditemukan
    })
    .end(done);
  })

  it('List products berhasil', function (done) {
    const path = basePath + "/products"
    console.log(path)

    request(host)
    .get(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.data).to.be.an('array');
    })
    .end(done);
  })

  it('Membuat order berhasil', function (done) {
    const path = basePath
    const customerName = 'Frado'
    console.log(path)

    request(host)
    .post(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({
      customerName
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Successful operation!')
      expect(response.body.data).to.be.an('object') // Jika ada berarti berhasil disimpan dalam database
      expect(response.body.data.customerName).equal(customerName)
      createdOrder = response.body.data.id
    })
    .end(done);
  })

  it('Menambah product dalam order gagal, orderId tidak ditemukan', function (done) {
    const orderId = 4 // Tidak ada 
    const path = basePath + '/product/' + orderId
    console.log(path)

    request(host)
    .post(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(product)
    .expect(404)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Not found')
    })
    .end(done);
  })

  it('Menambah product dalam order berhasil', function (done) {
    const orderId = createdOrder // Order yang terbuat dari tes akan digunakan
    const path = basePath + '/product/' + orderId
    console.log(path)

    request(host)
    .post(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({
      quantity: 10,
      productId: 2
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Successful operation!')
      expect(response.body.data).to.be.an('object') 
    })
    .end(done);
  })

  it('Menambah product dalam order lagi berhasil', function (done) {
    const orderId = createdOrder // Order yang terbuat dari tes akan digunakan
    const path = basePath + '/product/' + orderId
    console.log(path)

    request(host)
    .post(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({
      quantity: 10,
      productId: 2
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Successful operation!')
      expect(response.body.data).to.be.an('object') 
    })
    .end(done);
  })

  it('List orders berhasil', function (done) {
    const path = basePath
    console.log(path)

    request(host)
    .get(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.data).to.be.an('array')
      expect(response.body.data[0]).to.be.an('Object');
    })
    .end(done);
  })

  it('Menampilkan 1 order berhasil', function (done) {
    const orderId = createdOrder
    const path = basePath + '/' + orderId
    console.log(path)

    request(host)
    .get(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.data).to.be.an('Object')
    })
    .end(done);
  })

  it('Konfirmasi order untuk check out nantinya, berhasil', function (done) {
    const orderId = createdOrder
    const path = basePath + '/' + orderId
    console.log(path)

    request(host)
    .put(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(confirm)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Successful operation!')
      expect(response.body.data).to.be.an('object') 
      expect(response.body.data.OrderItems).to.be.an('array')
      expect(response.body.data.OrderItems[0]).to.be.an('Object')

    })
    .end(done);
  })

  it('Check out order untuk update statusnya menjadi true, berhasil', function (done) {
    const orderId = createdOrder
    const path = basePath + '/' + orderId
    console.log(path)

    request(host)
    .put(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({ status: true})
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.message).equal('Successful operation!')
      expect(response.body.data).to.be.an('object') 
      expect(response.body.data.status).equal(true)
    })
    .end(done);
  })

  it('Menampilkan 1 order dan melihat totalIncome nya, berhasil', function (done) {
    const orderId = createdOrder
    const path = basePath + '/' + orderId
    console.log(path)

    request(host)
    .get(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.data).to.be.an('Object')
      expect(response.body.data.totalIncome).equal(100000)
      console.log('TOTAL INCOME WORK!! Income:', response.body.data.totalIncome)
    })
    .end(done);
  })

  it('Menghapus 1 order beserta order items berhasil', function (done) {
    const orderId = createdOrder // Order yang terbuat dari tes akan dihapus
    const path = basePath + '/' + orderId
    console.log(path)

    request(host)
    .delete(path)
    .set('Authorization', accessToken)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(function(response) {
      expect(response.body.data.id).equal(createdOrder) // OrderId yang terbuat dari tes
    })
    .end(done);
  })
})