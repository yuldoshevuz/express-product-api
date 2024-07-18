import { app } from "../../index.js"
import User from "../../models/user.model.js";
import chai from "../test.js"

import { expect } from "chai";

describe("POST /auth/register", () => {
    it("should save user database and return user data", (done) => {
        chai.request.execute(app)
            .post("/auth/register")
            .send({
                fullName: "John Doe",
                email: "johndoe@example.com",
                password: "password123"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                };
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("ok").equal(true);
                expect(res.body).to.have.property("data").that.includes.key("id");
                
                const userId = res.body.data.id;

                User.destroy({ where: { id: userId } })
                    .then(() => done())
                    .catch(done);
            });
    });

    it("should return 400 for already exists with this email", (done) => {
        chai.request.execute(app)
            .post("/auth/register")
            .send({
                fullName: "For test",
                email: "test@example.com",
                password: "password123"
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
            })
    })
})