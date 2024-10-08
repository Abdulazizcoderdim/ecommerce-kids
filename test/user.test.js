const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Foydalanuvchilar', () => {
  // Test ma'lumotlari
  const testUser = {
    name: 'testuser',
    email: 'test@example.com',
    password: 'Test123!@#',
  };

  let authToken; // Login dan keyin token saqlash uchun

  // Har bir test blokidan oldin database tozalanishi kerak
  before(async () => {
    // Agar database tozalash funksiyasi bo'lsa
    // await clearDatabase();
  });

  describe('POST /api/users/register', () => {
    it("Yangi foydalanuvchini ro'yxatdan o'tkazish", done => {
      chai
        .request(app)
        .post('/api/users/register')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have
            .property('message')
            .eql("Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi");
          res.body.should.have.property('user');
          res.body.user.should.have.property('name').eql(testUser.name);
          res.body.user.should.have.property('email').eql(testUser.email);
          res.body.user.should.not.have.property('password'); // Parol qaytarilmasligi kerak
          done();
        });
    });

    it("Mavjud email bilan ro'yxatdan o'tishda xato berishi", done => {
      chai
        .request(app)
        .post('/api/users/register')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property('error')
            .eql("Bu email allaqachon ro'yxatdan o'tgan");
          done();
        });
    });

    it("Noto'g'ri ma'lumotlar bilan ro'yxatdan o'tishda xato berishi", done => {
      chai
        .request(app)
        .post('/api/users/register')
        .send({
          username: 'test',
          email: 'notvalidemail',
          password: '123', // Juda qisqa parol
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          done();
        });
    });
  });

  describe('POST /api/users/login', () => {
    it("To'g'ri ma'lumotlar bilan tizimga kirish", done => {
      chai
        .request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('user');
          res.body.user.should.have.property('email').eql(testUser.email);
          authToken = res.body.token; // Tokenni saqlab qo'yamiz
          done();
        });
    });

    it("Noto'g'ri email bilan tizimga kirishda xato berishi", done => {
      chai
        .request(app)
        .post('/api/users/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property('error')
            .eql("Email yoki parol noto'g'ri");
          done();
        });
    });

    it("Noto'g'ri parol bilan tizimga kirishda xato berishi", done => {
      chai
        .request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property('error')
            .eql("Email yoki parol noto'g'ri");
          done();
        });
    });
  });

  describe('GET /api/users', () => {
    it("Token bilan foydalanuvchilar ro'yxatini olish", done => {
      chai
        .request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          // Kamida bizning test foydalanuvchimiz bo'lishi kerak
          res.body.length.should.be.at.least(1);
          // Foydalanuvchilar ma'lumotlarida parol bo'lmasligi kerak
          res.body.forEach(user => {
            user.should.not.have.property('password');
          });
          done();
        });
    });

    it("Tokensiz so'rovda xato berishi", done => {
      chai
        .request(app)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql('Token topilmadi');
          done();
        });
    });

    it("Noto'g'ri token bilan so'rovda xato berishi", done => {
      chai
        .request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer wrongtoken')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').eql("Noto'g'ri token");
          done();
        });
    });
  });
});
