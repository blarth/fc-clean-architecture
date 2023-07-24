


import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("123", "Product A", 15);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test find Product use case", () => {
  it("should find a Product", async () => {
    const ProductRepository = MockRepository();
    const usecase = new FindProductUseCase(ProductRepository);

    const input = {
      id: "123"
    };

    const output = {
      id: "123",
      name: "Product A",
      price: 15
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  it("should not find a Product", async () => {
    const ProductRepository = MockRepository();
    ProductRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const usecase = new FindProductUseCase(ProductRepository);

    const input = {
      id: "123",
    };

    expect(() => {
      return usecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});
