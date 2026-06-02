const BASE_URL =
  "http://localhost:5000/api";

export async function createPrediction(
  data
) {
  try {

    const response =
      await fetch(
        `${BASE_URL}/predictions`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            data
          ),
        }
      );

    if (!response.ok) {
      throw new Error(
        "Failed to create prediction"
      );
    }

    return await response.json();

  } catch (error) {

    throw error;

  }
}

export async function getPredictions() {

  try {

    const response =
      await fetch(
        `${BASE_URL}/predictions`
      );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch predictions"
      );
    }

    return await response.json();

  } catch (error) {

    throw error;

  }
}