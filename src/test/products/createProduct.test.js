import { app } from "../../index.js";
import Product from "../../models/product.model.js";
import chai from "../test.js";

const { expect } = chai;

describe("POST /products - Create Product", () => {
    let token = "";

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
                };
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("ok").equal(true);
                expect(res.body).to.have.property("data").that.includes.key("token");

                token = res.body.data.token;
                done()
            });
    });

    it("should create new product", (done) => {
        chai.request.execute(app)
            .post("/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test name",
                description: "Test description",
                price: 200
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("ok").equal(true);
                expect(res.body).to.have.property("data").that.includes.key("id");

                const productId = res.body.data.id;

                Product.destroy({ where: { id: productId } })
                    .then(() => done())
                    .catch(done);
            });
    });

    it("should return 401 (unauthorized) not send authorization token", (done) => {
        chai.request.execute(app)
            .post("/products")
            .send({
                name: "Test name",
                description: "Test description",
                price: 20
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

    it("should return 400 for required all parametrs or send (price: string)", (done) => {
        chai.request.execute(app)
            .post("/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test name",
                description: "Test description"
            })
            .send({
                name: "Test name",
                description: "Test description",
                price: "20$"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                };
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("ok").equal(false);
                expect(res.body).that.include.key("message");
                done();
            });
    });
});