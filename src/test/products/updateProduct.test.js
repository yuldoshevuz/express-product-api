import chai from "../test.js";
import { app } from "../../index.js";
import Product from "../../models/product.model.js";

const { expect } = chai;

describe("/PUT /products/:id - Update product", () => {
    let token = ""
    let productId;

    before((done) => {
        chai.request.execute(app)
            .post("/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("ok").equal(true);
                expect(res.body).to.have.property("data").that.includes.key("token");

                token = res.body.data.token;
                done();
            });
    });

    before((done) => {
        Product.create({
            name: 'Old Product',
            description: 'This is an old product',
            price: 49.99
        }).then(product => {
            productId = product.id;
            done();
        }).catch(done);
    });

    it("should update an existing product", (done) => {
        chai.request.execute(app)
            .put(`/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: 'Updated Product',
                description: 'This is an updated product',
                price: 59.99
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                };
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('ok').equal(true);
                expect(res.body).to.have.property('data').that.includes.key('id');
                done();
            })
    });

    it("should return 404 (not product with this id)", (done) => {
        chai.request.execute(app)
            .put("/products/invalidId")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: 'Updated Product',
                description: 'This is an updated product',
                price: 59.99
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                };
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('ok').equal(false);
                expect(res.body).that.includes.key('message');
                done();
            })
    })

    it ("should return 401 (unauthorized) not send authorization token", (done) => {
        chai.request.execute(app)
            .put(`/products/${productId}`)
            .send({
                name: 'Updated Product',
                description: 'This is an updated product',
                price: 59.99
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                };
                expect(res).to.have.status(401);
                expect(res.body).to.have.property("ok").equal(false);
                expect(res.body).to.have.property("message").equal("You are not authorized");
                done();
            });
    });

    after((done) => {
        Product.destroy({ where: { id: productId } })
            .then(() => done())
            .catch(done);
    });
})