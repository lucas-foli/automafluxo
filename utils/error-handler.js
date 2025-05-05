export const handleAxiosError = (error) => {
    if (error.response) {
      // Request made and server responded
      console.error("Axios Error Response:");
      console.error("Status:", error.response.status);
      console.error("Message:", error.response.data?.error || error.response.statusText);
      console.error("Details:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // Request was made but no response
      console.error("No response received from server.");
      console.error("Request:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
    }
  };