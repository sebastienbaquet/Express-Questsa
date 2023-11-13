const crypto = require("node:crypto");
const request = require("supertest");
const database = require('../database');

const app = require("../src/app");
const { updateUser } = require("../movieControllers");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one User", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no User", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).post("/api/users").send(newUser);

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const getResponse = await request(app).get(
      `/api/users/${response.body.id}`
    );

    expect(getResponse.headers["content-type"]).toMatch(/json/);
    expect(getResponse.status).toEqual(200);

    expect(getResponse.body).toHaveProperty("id");

    expect(getResponse.body).toHaveProperty("firstname");
    expect(getResponse.body.firstname).toStrictEqual(newUser.firstname);

    expect(getResponse.body).toHaveProperty("lastname");
    expect(getResponse.body.lastname).toStrictEqual(newUser.lastname);
   
    expect(getResponse.body).toHaveProperty("email");
    expect(getResponse.body.email).toStrictEqual(newUser.email);
    
    expect(getResponse.body).toHaveProperty("city");
    expect(getResponse.body.city).toStrictEqual(newUser.city);

    expect(getResponse.body).toHaveProperty("language");
    expect(getResponse.body.language).toStrictEqual(newUser.language);
  });

  it("should return an error", async () => {
    const UserWithMissingProps = { firstname: "Harry " };

    const response = await request(app)
      .post("/api/users")
      .send(UserWithMissingProps);

    expect(response.status).toEqual(500);
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUsers = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [newUsers.firstname, newUsers.lastname, newUsers.email, newUsers.city, newUsers.language]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "dracula",
      lastname: "titi",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "dalton",
      language: "chripiron",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);

    const [resulta] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [userInDatabase] = resulta;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updatedUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updatedUser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updatedUser.language);
  });

    it("should return an error", async () => {
      const userWithMissingProps = { firstname: "Harry " };
  
      const response = await request(app)
        .put(`/api/users/1`)
        .send(userWithMissingProps);
  
      expect(response.status).toEqual(500);
    });

      it("should return no user", async () => {
        const newUser = {
          firstname: "tutu",
          lastname: "tata",
          email: "cupa.tutu@gmail.com",
          city: "paris",
          language: "francais",
        };
    
        const response = await request(app).put("/api/users/0").send(newUser);
    
        expect(response.status).toEqual(404);

  });
});