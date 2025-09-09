import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchEmployees, fetchEmployeeById, postEmployee } from "./employees";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("employee service", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("fetchEmployees should return employee response on success", async () => {
    const fakeResponse = { items: [{ id: "1", name: "Alice" }] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const data = await fetchEmployees(1, 10);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8090/api/collections/employees/records?page=1&perPage=10",
      expect.objectContaining({ method: "GET" })
    );
    expect(data).toEqual(fakeResponse);
  });

  it("fetchEmployees should throw on failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    await expect(fetchEmployees(1, 10)).rejects.toThrow(
      "Failed to fetch employees: 500 Server Error"
    );
  });

  it("postEmployee should send POST and return created employee", async () => {
    const newEmployee = { name: "Bob", email: "bob@test.com" } as any;
    const fakeResponse = { id: "123", ...newEmployee };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const data = await postEmployee(newEmployee);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8090/api/collections/employees/records",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newEmployee),
      })
    );
    expect(data).toEqual(fakeResponse);
  });

  it("fetchEmployeeById should return employee by id", async () => {
    const fakeEmployee = { id: "42", name: "Charlie" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeEmployee,
    });

    const data = await fetchEmployeeById("42");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8090/api/collections/employees/records/42",
      expect.objectContaining({ method: "GET" })
    );
    expect(data).toEqual(fakeEmployee);
  });
});
