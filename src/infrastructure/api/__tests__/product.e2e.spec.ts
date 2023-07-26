import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const arrange = {
      type: "a",
      name: "Product A",
      price: 15      
    }
    const response = await request(app)
      .post("/product")
      .send(arrange);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(arrange.name);
    expect(response.body.price).toBe(arrange.price);
    expect(response.body.id).toBeDefined();
  });

  it("should not create a product with invalid type", async () => {
    const response = await request(app).post("/customer").send({
      type: "c",
      name: "Product C",
      price: 10
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const arrange = {
      type: "a",
      name: "Product A",
      price: 15      
    }
    const arrangeB = {
      type: "b",
      name: "Product B",
      price: 10      
    }
    const response = await request(app)
      .post("/product")
      .send(arrange);
    expect(response.status).toBe(200);
    const responseB = await request(app)
      .post("/product")
      .send(arrangeB);
    expect(responseB.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product = listResponse.body.products[0];
    expect(product.name).toBe(arrange.name);
    expect(product.price).toBe(arrange.price);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe(arrangeB.name);
    expect(product2.price).toBe(arrangeB.price*2);

    
  });
});
