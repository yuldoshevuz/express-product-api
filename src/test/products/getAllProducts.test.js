import chai from "../test.js";
import { app } from "../../index.js";

const { expect } = chai;

describe("GET /products - Fetch all products", () => {
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
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("ok").equal(true);
                expect(res.body).to.have.property("data").that.includes.key("token");

                token = res.body.data.token;
                done();
            });
    });

    it("should return all products list", (done) => {
        chai.request.execute(app)
            .get("/products")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("ok").equal(true);
                expect(res.body).that.includes.key("data");
                done();
            })
    });

    it ("should return 401 (unauthorized) not send authorization token", (done) => {
        chai.request.execute(app)
            .get("/products")
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
});