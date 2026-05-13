const BASE_URL =
  "https://library-backend-production-244f.up.railway.app";

export async function getBookById(id) {
  const response = await fetch(
    `${BASE_URL}/api/books/${id}`
  );

  return await response.json();
}

export async function createBook(
  bookData,
  token
) {
  const response = await fetch(
    `${BASE_URL}/api/books`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(bookData),
    }
  );

  return await response.json();
}