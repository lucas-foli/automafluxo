document.addEventListener("DOMContentLoaded", () => {
  const deleteUserDataBtn = document.getElementById("delete-user");

  deleteUserDataBtn.addEventListener("click", async () => {
    const name = "mybusiness.2025";
    alert(`Deleting data for ${name}`);

    await fetch("/api/instagram/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  });
});
