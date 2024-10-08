const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const app = require('../server');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Mahsulotlar', () => {
  let testProductId; // Test uchun yaratilgan mahsulot ID'sini saqlash
  let testImagePath;

  before(async () => {
    // Test rasmi yaratish
    testImagePath = path.join(__dirname, 'test.jpg');
    if (!fs.existsSync(testImagePath)) {
      fs.writeFileSync(testImagePath, 'test image content');
    }

    // Test uchun mahsulot yaratish
    const res = await chai
      .request(app)
      .post('/api/products/')
      .field('name', 'Test Mahsulot')
      .field('price', 100)
      .field('description', 'Test tavsifi')
      .attach('picture', fs.readFileSync(testImagePath), 'test.jpg');

    testProductId = res.body._id;
  });

  after(() => {
    // Test rasmi tozalash
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  describe('GET /api/products/', () => {
    it("Mahsulotlar ro'yxatini olish", done => {
      chai
        .request(app)
        .get('/api/products/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  describe('POST /api/products/', () => {
    it("Yangi mahsulotni rasm bilan qo'shish", done => {
      const productData = {
        name: 'Yangi Mahsulot',
        price: 100,
        description: 'Bu yangi mahsulot tavsifi',
      };

      chai
        .request(app)
        .post('/api/products/')
        .field('name', productData.name)
        .field('price', productData.price)
        .field('description', productData.description)
        .attach('picture', fs.readFileSync(testImagePath), 'test.jpg')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql(productData.name);
          res.body.should.have.property('imageUrl');
          done();
        });
    });
  });

  describe('PUT /api/products/:id', () => {
    it('Mavjud mahsulotni yangilash', done => {
      const updatedData = {
        name: 'Yangilangan mahsulot',
        price: 200,
        description: 'Yangilangan tavsif',
      };

      chai
        .request(app)
        .put(`/api/products/${testProductId}`)
        .field('name', updatedData.name)
        .field('price', updatedData.price)
        .field('description', updatedData.description)
        .attach('picture', fs.readFileSync(testImagePath), 'updated.jpg')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql(updatedData.name);
          res.body.should.have.property('price').eql(updatedData.price);
          res.body.should.have
            .property('description')
            .eql(updatedData.description);
          res.body.should.have.property('imageUrl');
          done();
        });
    });

    it("Noto'g'ri ID bilan yangilashda xato berishi", done => {
      chai
        .request(app)
        .put('/api/products/wrongid')
        .field('name', 'Test')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it("Mavjud bo'lmagan mahsulotni yangilashda xato berishi", done => {
      chai
        .request(app)
        .put('/api/products/6704b09fd09bccf786adb621')
        .field('name', 'Test')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('DELETE /api/products/:id', () => {
    it("Mavjud mahsulotni o'chirish", done => {
      chai
        .request(app)
        .delete(`/api/products/${testProductId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property('message')
            .eql("Mahsulot muvaffaqiyatli o'chirildi");
          done();
        });
    });

    it("Noto'g'ri ID bilan o'chirishda xato berishi", done => {
      chai
        .request(app)
        .delete('/api/products/wrongid')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it("Mavjud bo'lmagan mahsulotni o'chirishda xato berishi", done => {
      chai
        .request(app)
        .delete('/api/products/6704b09fd09bccf786adb621')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it("O'chirilgan mahsulotni qayta o'chirishda xato berishi", done => {
      chai
        .request(app)
        .delete(`/api/products/${testProductId}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
