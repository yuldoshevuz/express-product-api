import { app } from "../../index.js"; // Importing the app instance from the main application file
import chai from "../test.js"; // Importing chai instance from the test setup file

const { expect } = chai; // Destructuring expect from chai for assertions

describe("POST /auth/login", () => {
    // Test case to verify that a user can log in and receive a JWT token
    it("should login a user and return a JWT token", (done) => {
        chai.request.execute(app) // Initiating a request to the app
            .post("/auth/login") // Sending a POST request to the /login endpoint
            .send({
                email: "test@example.com",
                password: "password123"
            }) // Sending login credentials
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res).to.have.status(200); // Asserting that the response status is 200 (OK)
                expect(res.body).to.have.property("ok").equal(true); // Asserting that the response body has property "ok" set to true
                expect(res.body).to.have.property("data").that.includes.key("token"); // Asserting that the response body contains "data" with a "token" key
                done(); // Indicate completion of the test case
            });
    });

    // Test case to verify that login fails with invalid credentials
    it("should return 400 for invalid credentials", (done) => {
        chai.request.execute(app) // Initiating a request to the app
            .post("/auth/login") // Sending a POST request to the /login endpoint
            .send({
                email: "wrong@example.com",
                password: "wrong password" 
            }) // Sending invalid login credentials
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res).to.have.status(400); // Asserting that the response status is 400 (Bad Request)
                expect(res.body).to.have.property("ok").equal(false); // Asserting that the response body has property "ok" set to false
                done(); // Indicate completion of the test case
            });
    });
});