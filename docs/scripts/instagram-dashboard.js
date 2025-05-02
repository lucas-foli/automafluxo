document.addEventListener("DOMContentLoaded", () => {
  const fetchCommentsBtn = document.getElementById("fetch-comments");
  const replyCommentBtn = document.getElementById("reply-comment");
  const fetchMessagesBtn = document.getElementById("fetch-messages");
  const publishContentBtn = document.getElementById("publish-content");
  const fetchInsightsBtn = document.getElementById("fetch-insights");
  const deleteUserDataBtn = document.getElementById("delete-user");
  const accessToken = document.getElementById("accessToken").value;

  fetchCommentsBtn.addEventListener("click", async () => {
    const mediaId = await fetch(
      `/api/instagram/get-media`
    );
    console.log(mediaId);
    const response = await fetch(
      `/api/instagram/fetch-comments?access_token=${accessToken}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  });
  replyCommentBtn.addEventListener("click", async () => {
    const commentId = document.getElementById("comment-id").value;
    const message = document.getElementById("reply-message").value;
    const accessToken = document.getElementById("access-token").value;
    const response = await fetch(
      `/api/instagram/reply-comment?commentId=${commentId}&message=${message}&accessToken=${accessToken}`,
      { method: "POST" }
    );
    const data = await response.json();
    console.log(data);
  });
});
