import chai from "../test.js";
import { app } from "../../index.js";
import Product from "../../models/product.model.js";

const { expect } = chai

describe('DELETE /products/:id - Delete Product', () => {
    let token = "";
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
            name: 'Product to Delete',
            description: 'This product will be deleted',
            price: 19.99
        }).then(product => {
            productId = product.id;
            done();
        }).catch(done);
    });

    it('should delete an existing product', (done) => {
        chai.request.execute(app)
            .delete(`/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    return done(err);
                };
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('ok').equal(true);
                expect(res.body).to.have.property('message').equal('Deleted successfully');
                done();
            });
    });

    it("should return 404 (not product with this id)", (done) => {
        chai.request.execute(app)
            .delete(`/products/invalidId`)
            .set("Authorization", `Bearer ${token}`)
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
            .delete(`/products/${productId}`)
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
})