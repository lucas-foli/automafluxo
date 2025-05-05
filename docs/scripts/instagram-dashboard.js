document.addEventListener("DOMContentLoaded", async () => {
  const userInfoDiv = document.getElementById("user-info");

  const fetchCommentsBtn = document.getElementById("fetch-comments");
  // const fetchUserBtn = document.getElementById("fetch-user");
  const replyCommentBtn = document.getElementById("reply-comment");
  const fetchMessagesBtn = document.getElementById("fetch-messages");
  const publishContentBtn = document.getElementById("publish-content");
  const fetchInsightsBtn = document.getElementById("fetch-insights");
  const getIgUserId = document.getElementById("get-ig-user-id");

  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");

  const userResponse = await fetch(
    `/api/instagram/fetch-user-info?username=${username}`
  );
  const user = await userResponse.json();
  const { token, profilePictureUrl } = user.user;
  const userId = '17841472479042560';

  console.log(
    "userId:",
    userId,
    "token:",
    token,
    "profilePictureUrl:",
    profilePictureUrl
  );

  userInfoDiv.innerHTML = `<p style="margin-bottom: 16px; font-size: 18px; font-weight: bold; text-align: center;">
  Welcome
  <img src="${profilePictureUrl}" alt="Profile Picture" style="width: 30px; height: 30px; border-radius: 50%;">
    @${username}!
</p>`;

  fetchCommentsBtn.addEventListener("click", async () => {
    const mediaIdResponse = await fetch(
      `/api/instagram/get-media?access_token=${token}&userId=${userId}`
    );
    const { mediaId } = await mediaIdResponse.json();

    const commentsResponse = await fetch(
      `/api/instagram/fetch-comments?access_token=${token}&mediaId=${mediaId}`
    );

    const data = await commentsResponse.json();
    console.log(data);
    showResult(await data);
    return data;
  });

  replyCommentBtn.addEventListener("click", async () => {
    const commentId = document.getElementById("comment-id").value;
    const message = document.getElementById("reply-message").value;
    const token = document.getElementById("access-token").value;
    const response = await fetch(
      `/api/instagram/reply-comment?commentId=${commentId}&message=${message}&token=${token}`,
      { method: "POST" }
    );
    const data = await response.json();
    console.log(data);
  });

  getIgUserId.addEventListener("click", async () => {
    const userAccessToken = prompt("Enter your Facebook User Access Token");

    // Etapa 1: Obter páginas que o usuário administra
    const pagesRes = await fetch(
      `https://graph.facebook.com/v22.0/me/accounts?access_token=${userAccessToken}`
    );
    const pagesData = await pagesRes.json();
    console.log("Pages Data:", pagesData);

    if (!pagesData.data || pagesData.data.length === 0) {
      alert(
        "Nenhuma página encontrada. Verifique se o usuário administra uma página."
      );
      return;
    }

    // Para simplificar, usamos a primeira página
    const page = pagesData.data[0];
    const pageAccessToken = page.access_token;
    const pageId = page.id;

    // Etapa 2: Obter Instagram Business Account vinculado à página
    const igRes = await fetch(
      `https://graph.facebook.com/v22.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );
    const igData = await igRes.json();
    console.log("Instagram Business Account:", igData);

    if (!igData.instagram_business_account) {
      alert("Essa página não tem uma conta do Instagram vinculada.");
      return;
    }

    const igUserId = igData.instagram_business_account.id;
    alert(`Instagram Business Account ID: ${igUserId}`);

    // Atualiza o campo de IG User ID automaticamente se existir
    const userIdField = document.getElementById("userId");
    if (userIdField) {
      userIdField.value = igUserId;
    }
  });
});

const showResult = (data) => {
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
};
